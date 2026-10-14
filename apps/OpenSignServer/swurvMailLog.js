// SWURV: archive BCC + a durable send history for every outbound email.
//
// Container logs vanish whenever the server container is recreated, and OpenSign
// keeps no record of what it emailed. So every send is (1) BCC'd to the archive
// mailbox in SWURV_SIGN_ARCHIVE_BCC and (2) written to the `swurv_MailLog` class,
// master-key only. Logging never blocks or fails a send.
//
// System mail (OTP codes, password reset, email verification) goes through
// Parse's email adapter in index.js: it is logged without its body and is NOT
// BCC'd, so one-time codes and reset links never sit in the archive mailbox.

const ARCHIVE_BCC = (process.env.SWURV_SIGN_ARCHIVE_BCC || '').trim();

function toList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(toList);
  return String(value)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

// Adds the archive address to a message's bcc (string, list or empty).
export function withArchiveBcc(messageParams) {
  if (!ARCHIVE_BCC) return messageParams;
  const bcc = toList(messageParams.bcc);
  if (!bcc.some(a => a.toLowerCase() === ARCHIVE_BCC.toLowerCase())) bcc.push(ARCHIVE_BCC);
  return { ...messageParams, bcc: bcc.join(', ') };
}

// Signing links are /login/<base64("docId/email[/contactId]")>; recover the
// document id so the log can be joined to contracts_Document.
function findDocId(html) {
  const m = String(html || '').match(/\/login\/([A-Za-z0-9+/=_-]+)/);
  if (!m) return '';
  try {
    return Buffer.from(m[1], 'base64').toString('utf8').split('/')[0] || '';
  } catch {
    return '';
  }
}

export async function logMail({ source, messageParams, result, error, docId, archived = true }) {
  try {
    const entry = new Parse.Object('swurv_MailLog');
    entry.set('Source', source);
    entry.set('To', toList(messageParams?.to));
    entry.set('Cc', toList(messageParams?.cc));
    entry.set('Bcc', toList(messageParams?.bcc));
    entry.set('Subject', String(messageParams?.subject || ''));
    entry.set('From', String(messageParams?.from || messageParams?.sender || ''));
    entry.set('DocumentId', docId || findDocId(messageParams?.html));
    entry.set('Archived', Boolean(archived && ARCHIVE_BCC));
    entry.set('Status', error ? 'error' : 'sent');
    if (result) {
      entry.set('MessageId', String(result.messageId || result.id || ''));
      entry.set('ProviderResponse', String(result.response || result.status || result.message || ''));
      if (result.accepted) entry.set('Accepted', toList(result.accepted));
      if (result.rejected) entry.set('Rejected', toList(result.rejected));
    }
    if (error) entry.set('Error', String(error?.message || error));
    entry.setACL(new Parse.ACL()); // no public or user access; master key only
    await entry.save(null, { useMasterKey: true });
  } catch (err) {
    console.log('swurv_MailLog write failed', err?.message || err);
  }
}
