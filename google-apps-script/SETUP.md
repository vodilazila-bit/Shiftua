# SHIFT lead form — Google Apps Script

Spreadsheet: `SHIFT — заявки`

## Production deployment

Web app is deployed and connected to `shiftua.com`.

Endpoint:
`https://script.google.com/macros/s/AKfycbxqmI7d5yqpwn2xtVlUhWwSViv1lK-KsAfLe-sG2lomRvcsjBLaFGu2dvPcfGbO9P4Q/exec`

Deployment settings:

- Execute as: Me
- Who has access: Anyone
- Spreadsheet: `SHIFT — заявки`
- Sheet: `Leads`
- Time zone: Europe/Kyiv

`form-handler.js` posts directly to this endpoint. No Make/Integromat is used.

## Notifications

By default the Apps Script sends a new-lead email to the effective owner account.

Optional Script properties:

- `NOTIFY_EMAIL` — override email for new lead notifications.
- `TELEGRAM_BOT_TOKEN` — optional Telegram bot token.
- `TELEGRAM_CHAT_ID` — optional Telegram chat ID.

## Attribution stored with every lead

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `fbclid`

Lead statuses in the Sheet: `Новий`, `Зв'язались`, `Прорахунок`, `Думає`, `Продано`, `Відмова`.
