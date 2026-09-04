# WEBWORK lead form + website chat — Google Apps Script

Spreadsheet: `SHIFT — заявки`

## Production deployment

Current Web App endpoint:
`https://script.google.com/macros/s/AKfycbxqmI7d5yqpwn2xtVlUhWwSViv1lK-KsAfLe-sG2lomRvcsjBLaFGu2dvPcfGbO9P4Q/exec`

Deployment settings:

- Execute as: Me
- Who has access: Anyone
- Spreadsheet: `SHIFT — заявки`
- Lead sheet: `Leads`
- Chat sheet: `Chat` (created automatically)
- Time zone: Europe/Kyiv

`form-handler.js` posts leads to this endpoint. `chat-widget.js` uses the same endpoint for website chat.

## Notifications / Telegram

Script properties:

- `NOTIFY_EMAIL` — optional email override for lead notifications.
- `TELEGRAM_BOT_TOKEN` — Telegram bot token from BotFather.
- `TELEGRAM_CHAT_ID` — Telegram chat/user ID where WEBWORK messages should arrive.
- `WEBAPP_URL` — optional explicit Apps Script `/exec` URL; normally `ScriptApp.getService().getUrl()` is enough.

### Activate two-way website chat

After replacing `Code.gs` in the Apps Script project:

1. Deploy a **new version of the existing Web App deployment**. Do not create a second unrelated deployment unless you also update the endpoint on the site.
2. Make sure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` exist in **Project Settings → Script properties**.
3. Run `setupTelegramWebhook()` once from the Apps Script editor and approve permissions.
4. Send a message from the WEBWORK website chat.
5. In Telegram, use **Reply** on the bot message. The reply is stored in the `Chat` sheet and appears in the visitor's website chat within a few seconds.

The bot token stays only in Apps Script properties and is never exposed in GitHub or browser JavaScript.

## Lead attribution

Stored with every lead:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `fbclid`

Lead statuses in the Sheet: `Новий`, `Зв'язались`, `Прорахунок`, `Думає`, `Продано`, `Відмова`.
