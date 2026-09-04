const SHIFT = {
  SPREADSHEET_ID: '1VTobF86dp48NrnbeUBC3vSXLmWtTDBsE4V7SXVOWGsM',
  SHEET_NAME: 'Leads',
  CHAT_SHEET_NAME: 'Chat'
};

function doGet(e) {
  const action = e && e.parameter ? String(e.parameter.action || '') : '';
  if (action === 'chat_poll') return chatPoll_(e);
  return ContentService.createTextOutput('WEBWORK endpoint is running');
}

function doPost(e) {
  try {
    const data = parsePayload_(e);

    if (data && data.update_id != null) {
      return handleTelegramUpdate_(data);
    }

    if (String(data.type || '') === 'chat_message') {
      return handleChatMessage_(data);
    }

    return handleLead_(data);
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function handleLead_(data) {
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
}

function handleChatMessage_(data) {
  const session = cleanSession_(data.session);
  const message = safe_(data.message).slice(0, 1500);
  if (!session || !message) return json_({ ok: false, error: 'session_and_message_required' });

  const now = new Date();
  let telegramMessageId = '';

  try {
    telegramMessageId = sendTelegramChat_(session, message, safe_(data.page), now) || '';
  } catch (err) {
    console.error('Telegram chat notification failed', err);
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getChatSheet_();
    sheet.appendRow([
      now,
      session,
      'visitor',
      message,
      safe_(data.page),
      telegramMessageId,
      safe_(data.name)
    ]);
  } finally {
    lock.releaseLock();
  }

  return json_({ ok: true });
}

function handleTelegramUpdate_(update) {
  const props = PropertiesService.getScriptProperties();
  const expectedChatId = String(props.getProperty('TELEGRAM_CHAT_ID') || '');
  const msg = update && update.message;
  if (!msg || !msg.text) return json_({ ok: true, ignored: true });
  if (expectedChatId && String(msg.chat && msg.chat.id) !== expectedChatId) {
    return json_({ ok: true, ignored: true });
  }

  const reply = msg.reply_to_message;
  if (!reply || reply.message_id == null) {
    return json_({ ok: true, ignored: true, hint: 'reply_to_bot_message_required' });
  }

  const session = sessionFromTelegramReply_(reply);
  if (!session) return json_({ ok: true, ignored: true, error: 'session_not_found' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getChatSheet_();
    sheet.appendRow([
      new Date(),
      session,
      'admin',
      safe_(msg.text).slice(0, 1500),
      '',
      msg.message_id || '',
      ''
    ]);
  } finally {
    lock.releaseLock();
  }

  return json_({ ok: true });
}

function chatPoll_(e) {
  const p = e && e.parameter ? e.parameter : {};
  const session = cleanSession_(p.session);
  const after = Math.max(0, Number(p.after || 0) || 0);
  const adminOnly = String(p.admin_only || '') === '1';
  if (!session) return jsonOrJsonp_({ ok: false, error: 'session_required' }, p.callback);

  const sheet = getChatSheet_();
  const lastRow = sheet.getLastRow();
  const messages = [];

  if (lastRow >= 2) {
    const values = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
    const start = Math.max(0, values.length - 250);
    for (let i = start; i < values.length; i++) {
      const rowId = i + 2;
      if (rowId <= after) continue;
      const row = values[i];
      if (String(row[1]) !== session) continue;
      if (adminOnly && String(row[2]) !== 'admin') continue;
      messages.push({
        id: rowId,
        timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
        role: String(row[2] || ''),
        message: String(row[3] || '')
      });
    }
  }

  return jsonOrJsonp_({ ok: true, messages: messages }, p.callback);
}

function getChatSheet_() {
  const ss = SpreadsheetApp.openById(SHIFT.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHIFT.CHAT_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHIFT.CHAT_SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Session', 'Role', 'Message', 'Page', 'Telegram message ID', 'Name']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendTelegramChat_(session, message, page, now) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('TELEGRAM_BOT_TOKEN');
  const chatId = props.getProperty('TELEGRAM_CHAT_ID');
  if (!token || !chatId) return '';

  const text = [
    '💬 WEBWORK — нове повідомлення з сайту',
    'ID: ' + session,
    '',
    message,
    '',
    '🌐 ' + (page || 'webwork.com.ua'),
    '🕐 ' + Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm'),
    '',
    '↩️ Відповідай через Reply на це повідомлення — відповідь з’явиться у клієнта на сайті.'
  ].join('\n');

  const response = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: chatId,
      text: text,
      disable_web_page_preview: true
    }),
    muteHttpExceptions: true
  });

  try {
    const parsed = JSON.parse(response.getContentText());
    return parsed && parsed.ok && parsed.result ? parsed.result.message_id : '';
  } catch (_) {
    return '';
  }
}

function sessionFromTelegramReply_(reply) {
  const text = String(reply && reply.text || '');
  const match = text.match(/\bID:\s*([A-Za-z0-9_-]{8,120})/);
  if (match) return cleanSession_(match[1]);

  const replyId = String(reply && reply.message_id || '');
  if (!replyId) return '';

  const sheet = getChatSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return '';
  const values = sheet.getRange(2, 2, lastRow - 1, 5).getValues();
  for (let i = values.length - 1; i >= 0; i--) {
    if (String(values[i][4]) === replyId) return cleanSession_(values[i][0]);
  }
  return '';
}

function setupTelegramWebhook() {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('TELEGRAM_BOT_TOKEN');
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is missing in Script properties');

  const url = props.getProperty('WEBAPP_URL') || ScriptApp.getService().getUrl();
  if (!url) throw new Error('WEBAPP_URL is missing and deployed Web App URL could not be detected');

  const response = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/setWebhook', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      url: url,
      allowed_updates: ['message'],
      drop_pending_updates: true
    }),
    muteHttpExceptions: true
  });

  const result = response.getContentText();
  console.log(result);
  return result;
}

function removeTelegramWebhook() {
  const token = PropertiesService.getScriptProperties().getProperty('TELEGRAM_BOT_TOKEN');
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is missing');
  return UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/deleteWebhook', {
    method: 'post',
    muteHttpExceptions: true
  }).getContentText();
}

function parsePayload_(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (_) {}
  }
  return e.parameter || {};
}

function cleanSession_(value) {
  const v = String(value == null ? '' : value).trim();
  return /^[A-Za-z0-9_-]{8,120}$/.test(v) ? v : '';
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

  const subject = 'Нова заявка WEBWORK — ' + safe_(data.name);
  const body = [
    'Нова заявка з WEBWORK',
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
    '🟢 Нова заявка WEBWORK',
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
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function jsonOrJsonp_(obj, callback) {
  const cb = String(callback || '').trim();
  if (/^[A-Za-z_$][0-9A-Za-z_$\.]{0,120}$/.test(cb)) {
    return ContentService
      .createTextOutput(cb + '(' + JSON.stringify(obj) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return json_(obj);
}
