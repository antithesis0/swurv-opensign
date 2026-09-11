# Modifications by Swurv

This repository is a fork of [OpenSignLabs/OpenSign](https://github.com/OpenSignLabs/OpenSign),
which is licensed under the **GNU Affero General Public License v3** (see `LICENSE`).

Branch `swurv-theme` is based on upstream tag **v2.41.3** and is deployed at
`https://sign.swurv.tax`. In accordance with AGPL-3 §13, the modified source is
published here for anyone interacting with that instance over a network.

Upstream copyright and licence notices are retained unchanged. "OpenSign" and
"OpenSign™" are marks of OpenSign Labs. As of the 2026-09-11 sweep (below), this
fork retains that attribution in exactly two places — the PDF document-id stamp
and the completion-certificate filename — and nowhere else. AGPL-3 does not
require keeping a licensor's mark visible in a modified copy's UI; it requires
offering Corresponding Source (satisfied by this repository being public) and
preserving copyright notices in the code, which this fork does.

## What was changed

Changes span `apps/OpenSign/` (React frontend) and, since the email retheme,
`apps/OpenSignServer/` — but the server changes are **email templates only**.

The change is a **visual retheme only** — palette, typography, radius language,
logo, favicon, page title and outbound email templates, matching the Swurv brand
(swurv.tax). No signing, cryptographic, authentication or document-handling
behaviour was altered.

| Area | Files | Change |
|---|---|---|
| Theme tokens | `tailwind.config.js` | The two daisyUI themes (`opensigncss`, `opensigndark`) re-valued to the Swurv palette. Theme *keys* deliberately unchanged — they are referenced as Tailwind variants and `data-theme` string literals across ~12 components. Button radius 1.9rem → 0.75rem. |
| Default theme | `index.html`, `src/index.jsx`, `src/components/ThemeToggle.jsx` | Dark is now the default (swurv.tax is dark-only). An absent preference means dark; an explicit "light" choice is still honoured. The toggle is retained. |
| Typography | `index.html`, `src/index.css` | Inter 400–800 added. `body { background-color: white }` replaced with theme-driven `bg-base-100` / `text-base-content`. |
| Utility remap | `src/styles/swurv-overrides.css` (new) | ~200 raw Tailwind colour utilities (`text-gray-500`, `border-gray-300`, `text-blue-700`, …) remapped per theme, rather than editing 147 JSX files. |
| Dark overrides | `src/styles/dark-theme-improvements.css` | Upstream's VS Code greys and blue focus ring rebranded. |
| Literals | `src/constant/const.js`, `src/primitives/Tooltip.jsx`, `src/components/pdf/{RenderPdf,Placeholder}.jsx`, `src/styles/{signature,managesign,opensigndrive}.css`, various JSX | Off-brand blues/teals/purples replaced with brand values or daisyUI semantic classes. Status badge shades darkened so their white labels meet contrast. |
| Branding | `src/components/Title.jsx`, `src/constant/appinfo.js`, `src/hook/useManifestUrl.js`, `public/manifest.json`, logo + favicon assets | App name "Swurv Sign", Swurv logo and favicons. |
| Signer page | `src/pages/GuestLogin.jsx` | Logo now follows the active theme (upstream used one file unconditionally, invisible against the dark default). |
| Build | `apps/OpenSign/Dockerhubfile`, `.dockerignore` | `npm run version` (a GitHub API call that fails soft inside a Docker build) replaced with a pinned `version.txt` and a direct `vite build`. Node heap capped at 3 GB to suit the host. |

## Email templates (added later)

Every outbound message was OpenSign-branded: `#f5f5f5` page, white card, OpenSign's
logo, a teal `#47a3ad` band. All of them now share one `swurvEmailShell()`.

| Template | File |
|---|---|
| Signature request | `apps/OpenSignServer/Utils.js` → `mailTemplate` |
| Signature request (resend/remind) | `apps/OpenSign/src/constant/Utils.js` → `mailTemplate` |
| Customised request body wrapper | `apps/OpenSignServer/cloud/parsefunction/createBatchDocs.js` |
| Signed-by-one / signed-by-all | `apps/OpenSignServer/cloud/parsefunction/pdf/PDF.js` |
| Declined | `.../declinedocument.js` |
| Forwarded copy | `.../ForwardDoc.js` |
| Signer OTP | `.../SendMailOTPv1.js` |
| Parse verification / password reset / custom | `apps/OpenSignServer/files/*.html` |

**Light, not dark, on purpose.** swurv.tax is dark-only, but HTML email is where dark
backgrounds misbehave — Outlook ignores much of it and Gmail/Apple dark-mode inversion
produces a broken-looking hybrid. The shell uses the brand's light tokens (navy band,
orange CTA on white), the same language as the `opensigncss` theme.

**Two upstream bugs fixed in passing:**

- the CTA was `<button>` inside `<a>`. Outlook drops it, so some recipients saw no
  button at all. Now a bulletproof table button.
- the signature request laid out its detail table with `display:flex`, dead in Outlook.
- (also: upstream's password-reset template labelled its button "Verify email".)

**`appName` on the server** is now `Swurv Sign`. It feeds only the mail sender display
name, these templates and the frontend's appname lookup. The PDF page stamp and
certificate filename read from the **frontend** `Utils.js`, which deliberately still
says `OpenSign™` — attribution belongs on the signed artefact, not on our covering
email.

**Two copies of the shell.** `apps/OpenSignServer/swurvEmail.js` and
`apps/OpenSign/src/constant/swurvEmail.js` are separate bundles and cannot share a
module. Keep them in sync by hand.

**`files/` is a named volume** (`opensign-files`) in the deployment's compose file, so
the three Parse templates baked into the image are masked at runtime. Changing them
requires writing into the volume as well as rebuilding.

### Deliberately left unchanged

The PDF document-id stamp and completion-certificate filenames — attribution on the
signed artefact itself, kept on purpose (see top of this file). In-app plan/upsell
strings (unrelated to branding — pricing-tier copy, not touched).

The `opensignlabs.com` contact details shown to signers were also on this list until
2026-09-11 — see below, that was reversed on explicit instruction.

## Full branding sweep (2026-09-11)

Everything that still said "OpenSign" outside the two exceptions above. Not a bug fix —
the `opensignlabs.com` contact details had been a deliberate keep (previous paragraph)
until this instruction reversed it.

| Area | Files | Change |
|---|---|---|
| `appName` constants | 24 files across `pages/`, `components/`, `reports/`, `primitives/`, `constant/Utils.js`, plus the email-builder sample templates | Each component redeclares its own local `const appName = "OpenSign™"` (not a shared constant) — all switched to `"Swurv Sign"`. Left alone: `constant/Utils.js`'s `embedDocId` (PDF stamp) and `downloadCertificate` (certificate filename). |
| "Drive" naming | `Menu.jsx`, `SubMenu.jsx`, `RenderReportCell.jsx`, `SelectFolder.jsx`, `FolderModal.jsx`, `Opensigndrive.jsx` | `drivename = appName === "OpenSign™" ? "OpenSign™" : ""` collapsed to empty once `appName` changed — the "X Drive" menu item would have silently lost its name. Changed to `drivename = appName` so it reads "Swurv Sign Drive". |
| Terms & Conditions | `components/pdf/AgreementContent.jsx`, `public/locales/en/translation.json` (`term-cond-p29`/`p30`) | Removed the hardcoded `www.opensignlabs.com` link and `support@opensignlabs.com` line from the signer-facing consent modal — that's OpenSignLabs' own support channel, not applicable here. Now just "contact the Sender directly," consistent with the request-email template. |
| **Spam-report footer (email)** | `apps/OpenSignServer/cloud/parsefunction/{sendMailv3,sendMailWithAttachment,sendSystemMail}.js`, `Dockerfile.swurv` | Every one of these unconditionally appended `<p>...file a complaint with OpenSign™ <a href="mailto:complaints@opensignlabs.com?...">here</a></p>` to the HTML of **every outbound email**, including the rebranded request-email — misdirecting any signer's spam complaint about our mail to a third party with no relationship to our clients. Not caught by the earlier email retheme (that touched templates, not this cross-cutting footer). Emptied in all three; added to `Dockerfile.swurv`'s COPY list since the overlay is an explicit allowlist. |
| Post-signing popup contrast | `pages/DocSuccessPage.jsx` | Hardcoded `bg-white`/`text-gray-{800,600,500}` never got the dark-theme treatment the rest of the app got — switched to `bg-base-100`/`text-base-content`(`/70`, `/60`). |
| Save-and-reuse signature | org-level `SignatureType` (API, not code) | `default` re-enabled alongside `draw` (`typed`/`upload` stay off). Traced `saveToMySign`/`handleSaveToMySign` in `WidgetsValueModal.jsx` first — `default` gates the "My signature" reuse tab, which only ever holds whatever image came off the **draw** canvas (upload is off), so this is safe under the draw-only policy, not a loophole. |
| OpenSignLabs self-promotion | `components/SocialMedia.jsx` (deleted), `Sidebar.jsx`, `Footer.jsx`, `layout/HomeLayout.jsx` | Removed: sidebar social-media links to OpenSignLabs' own GitHub/LinkedIn/Twitter/Discord; the footer's version string linking to `github.com/OpenSignLabs/OpenSign/releases/tag/<ver>` (would 404 — that tag doesn't exist for our fork's version string); an onboarding-tour "⭐ Star us on GitHub" CTA pointed at the upstream repo. |
| Misc error copy | `constant/Utils.js` | "This pdf is not compatible with opensign please contact support@opensignlabs.com" → "This PDF isn't compatible — please contact the sender." |
| Sidebar accessibility | `Sidebar.jsx` | `aria-label="OpenSign Sidebar Navigation"` → `"Swurv Sign Sidebar Navigation"`. |

**Left out of scope:** the 6 non-English locale files (`public/locales/{kr,de,it,hi,es,fr}`) carry the same `OpenSign™`-branded strings — not fixed, lower value since this practice serves English-speaking clients only.

## Upstream contrast deviation

`primary-content` is navy `#16154A` on orange `#F0790C` (~5:1) rather than white.
swurv.tax uses white on orange, but only as the hover state of a large CTA; at
~2.8:1 that fails even large-text AA and does not hold up on small dense buttons.
