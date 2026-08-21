# SHIFT lead form — Google Apps Script

Spreadsheet: `SHIFT — заявки`

## One-time deployment

1. Open the Google Sheet `SHIFT — заявки`.
2. Extensions → Apps Script.
3. Replace the default code with `google-apps-script/Code.gs` from this repository.
4. Project Settings → set time zone to Europe/Kyiv.
5. Deploy → New deployment → Web app.
6. Execute as: Me.
7. Who has access: Anyone.
8. Deploy and copy the `/exec` URL.
9. Put that URL into `form-handler.js` as `window.SHIFT_FORM_ENDPOINT` / `ENDPOINT` and push.

## Optional notifications

In Apps Script → Project Settings → Script properties:

- `NOTIFY_EMAIL` — email for new lead notifications. If omitted, script tries to use the effective owner account.
- `TELEGRAM_BOT_TOKEN` — optional Telegram bot token.
- `TELEGRAM_CHAT_ID` — optional Telegram chat ID.

The form stores attribution fields: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`.
