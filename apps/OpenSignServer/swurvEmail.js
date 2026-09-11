/**
 * SWURV-branded email shell.
 *
 * Every outbound template in this server used the same layout: #f5f5f5 page, white
 * card, OpenSign logo, teal #47a3ad title band. This replaces that with the Swurv
 * brand (see NOTICE-swurv.md).
 *
 * Deliberately LIGHT, not the dark swurv.tax canvas: HTML email is the one place a
 * dark background misbehaves. Outlook ignores much of it and Gmail/Apple dark-mode
 * auto-inversion produces a broken-looking hybrid. This uses the same "brand on
 * light" language as the app's opensigncss theme -- navy band, orange CTA -- which
 * mirrors swurv.tax's navy-hero + orange-CTA structure and renders predictably.
 *
 * Email-client constraints honoured here:
 *   - tables, not flexbox (the old templates used display:flex, dead in Outlook)
 *   - a bulletproof table button, not <button> inside <a> (which Outlook drops)
 *   - inline styles only; no <style> block, no CSS variables
 *   - 600px max width; logo served from swurv.tax over https
 */

const NAVY = '#1F1E5B';
const ORANGE = '#F0790C';
const ON_ORANGE = '#16154A'; // navy on orange ~5:1; white would be ~2.8:1 and fail AA
const TEXT = '#2D3748';
const MUTED = '#718096';
const LINE = '#E0E0E0';
const PAGE = '#F9FAFB';
const FONT = "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

// Self-hosted, NOT hotlinked from swurv.tax. That site's /images/ copies are stale
// (it still serves an old black mark and a 1.34 MB legacy white one), and updating
// them needs a separate website deploy. Serving from this deployment means the email
// logo ships with the same build as everything else.
const LOGO = (process.env.PUBLIC_URL || 'https://sign.swurv.tax').replace(/\/$/, '') + '/email-logo.png';

const esc = v =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Label/value rows, replacing the old nested <table> with inconsistent styling. */
export const swurvDetailRows = (rows = []) => {
  const body = rows
    .filter(r => r && r.value !== undefined && r.value !== null && String(r.value).trim() !== '')
    .map(
      r =>
        `<tr>` +
        `<td style="padding:6px 16px 6px 0;font-family:${FONT};font-size:14px;color:${MUTED};white-space:nowrap;vertical-align:top">${esc(r.label)}</td>` +
        `<td style="padding:6px 0;font-family:${FONT};font-size:14px;color:${TEXT};font-weight:600">${esc(r.value)}</td>` +
        `</tr>`
    )
    .join('');
  if (!body) return '';
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:18px 0 4px 0">${body}</table>`;
};

/**
 * @param {object}  o
 * @param {string}  o.title       navy band heading
 * @param {string}  o.bodyHtml    already-escaped/trusted HTML for the message body
 * @param {object} [o.cta]        { text, url }
 * @param {string} [o.footerHtml] small print under the card
 */
export const swurvEmailShell = ({ title, bodyHtml, cta, footerHtml }) => {
  const button = cta?.url
    ? `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:26px 0 6px 0">
         <tr><td align="center" bgcolor="${ORANGE}" style="border-radius:10px">
           <a href="${cta.url}" target="_blank" rel="noopener noreferrer"
              style="display:inline-block;padding:13px 30px;font-family:${FONT};font-size:15px;font-weight:700;color:${ON_ORANGE};text-decoration:none;border-radius:10px">${esc(cta.text || 'Open')}</a>
         </td></tr>
       </table>`
    : '';

  return `<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><meta name="color-scheme" content="light only" /><meta name="supported-color-schemes" content="light only" /><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background-color:${PAGE};">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${PAGE};padding:24px 12px">
  <tr><td align="center">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background-color:#FFFFFF;border:1px solid ${LINE};border-radius:12px">
      <tr><td style="padding:22px 24px 16px 24px">
        <img src="${LOGO}" alt="Swurv" height="32" style="height:32px;width:auto;display:block;border:0" />
      </td></tr>
      <tr><td bgcolor="${NAVY}" style="background-color:${NAVY};padding:13px 24px">
        <span style="font-family:${FONT};font-size:17px;font-weight:600;color:#FFFFFF">${esc(title)}</span>
      </td></tr>
      <tr><td style="padding:22px 24px 26px 24px;font-family:${FONT};font-size:15px;line-height:1.6;color:${TEXT}">
        ${bodyHtml}
        ${button}
      </td></tr>
    </table>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%">
      <tr><td style="padding:16px 24px;font-family:${FONT};font-size:12px;line-height:1.5;color:${MUTED}">
        ${footerHtml || ''}
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
};

export default swurvEmailShell;
