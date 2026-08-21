const SHIFT = {
  SPREADSHEET_ID: '1VTobF86dp48NrnbeUBC3vSXLmWtTDBsE4V7SXVOWGsM',
  SHEET_NAME: 'Leads'
};

function doGet() {
  return ContentService.createTextOutput('SHIFT lead endpoint is running');
}

function doPost(e) {
  try {
    const data = parsePayload_(e);
    if (!data.name || !data.contact) {
      return json_({ ok: false, error: 'name_and_contact_required' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.openById(SHIFT.SPREADSHEET_ID);
      const sheet = ss.getSheetByName(SHIFT.SHEET_NAME);
      if (!sheet) throw new Error('Sheet "Leads" not found');

      const now = new Date();
      sheet.appendRow([
        now,
        safe_(data.name),
        safe_(data.contact),
        safe_(data.service),
        safe_(data.message),
        safe_(data.page),
        safe_(data.utm_source),
        safe_(data.utm_medium),
        safe_(data.utm_campaign),
        safe_(data.utm_content),
        safe_(data.utm_term),
        safe_(data.gclid),
        safe_(data.fbclid),
        'Новий',
        ''
      ]);

      notifyEmail_(data, now);
      notifyTelegram_(data, now);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function parsePayload_(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (_) {}
  }
  return e.parameter || {};
}

function safe_(value) {
  value = String(value == null ? '' : value).trim();
  if (/^[=+\-@]/.test(value)) value = "'" + value;
  return value.slice(0, 5000);
}

function notifyEmail_(data, now) {
  const props = PropertiesService.getScriptProperties();
  const configured = props.getProperty('NOTIFY_EMAIL');
  const recipient = configured || Session.getEffectiveUser().getEmail();
  if (!recipient) return;

  const subject = 'Нова заявка SHIFT — ' + safe_(data.name);
  const body = [
    'Нова заявка з shiftua.com',
    '',
    'Дата: ' + Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm:ss'),
    'Ім’я: ' + safe_(data.name),
    'Контакт: ' + safe_(data.contact),
    'Послуга: ' + safe_(data.service),
    'Повідомлення: ' + safe_(data.message),
    '',
    'Джерело: ' + [safe_(data.utm_source), safe_(data.utm_medium), safe_(data.utm_campaign)].filter(Boolean).join(' / '),
    'gclid: ' + safe_(data.gclid),
    'fbclid: ' + safe_(data.fbclid),
    'Сторінка: ' + safe_(data.page)
  ].join('\n');

  MailApp.sendEmail(recipient, subject, body);
}

function notifyTelegram_(data, now) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('TELEGRAM_BOT_TOKEN');
  const chatId = props.getProperty('TELEGRAM_CHAT_ID');
  if (!token || !chatId) return;

  const text = [
    '🟢 Нова заявка SHIFT',
    '',
    '👤 ' + safe_(data.name),
    '📞 ' + safe_(data.contact),
    '🧩 ' + safe_(data.service),
    '💬 ' + safe_(data.message),
    '',
    '📊 ' + [safe_(data.utm_source), safe_(data.utm_medium), safe_(data.utm_campaign)].filter(Boolean).join(' / ')
  ].join('\n');

  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ chat_id: chatId, text: text }),
    muteHttpExceptions: true
  });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
