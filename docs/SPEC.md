# Spec: drag-and-drop file upload on New Document / New Template

Repo: antithesis0/swurv-opensign, branch `swurv-dropzone` (from `swurv-theme`), worktree `~/src/swurv-opensign-dropzone` on the Mini.
Auto-approved by the principal on 2026-10-14 ("auto approve the spec... do the goal function... without me").

## Goal
On sign.swurv.tax, the file field of the New Document / New Template / Request Signatures form (`apps/OpenSign/src/pages/Form.jsx`)
accepts files dragged from Finder onto it, as well as through the existing Browse button. Dropped files go through exactly the
same path as browsed files (size limit, PDF decrypt, DOCX/image conversion, merge).

## Scope
- In: the main upload field in `Form.jsx`. Visual drop target with hover highlight, "Drag and drop a file here, or Browse" text.
  Unsupported file types dropped are rejected with an alert and not processed.
- Out: other file inputs (signature image, contact import, profile picture), deployment/rebuild of the Docker image
  (principal decides when to ship), any change to upload/signing logic.

## Verification setup
- `ssh mac-mini`, `cd ~/src/swurv-opensign-dropzone/apps/OpenSign`
- Install: `npm ci`
- Tests: `npx vitest run`
- Build: `npx vite build` (must exit 0)

## Items
| id | item | done criterion | check | tier | files | status | note |
|---|---|---|---|---|---|---|---|
| 1 | FileDropZone component | `src/components/shared/fields/FileDropZone.jsx` wraps children; on dragover shows highlight; on drop filters files against an `accept` string (mime list, extensions) and calls `onFiles(acceptedFiles)`; calls `onReject(rejected)` if any rejected; ignores drops while `disabled`. | `npx vitest run src/components/shared/fields/FileDropZone.test.jsx` passes (drop accepted, drop rejected, dragover highlight, disabled) | implementer | FileDropZone.jsx, FileDropZone.test.jsx | done | 6 tests pass; review PASS. Adv: aria-label not i18n; nested dragenter untested |
| 2 | Wire into Form.jsx | Upload field wrapped in FileDropZone with the same accept list; drop calls `handleFileInput({ target: { files, value: "" } })`; prompt text shown; Browse still works; existing remove (x) path unchanged. | `npx vite build` exits 0; `grep -n FileDropZone src/pages/Form.jsx` shows import and use | implementer | src/pages/Form.jsx, locale `public/locales/en/translation.json` if text added | done | Done by session (small). Build 0; review PASS. Bug caught in review: file-alert-3 swapped on submit path, restored in item 3 commit |
| 3 | Integration check | Form renders with drop zone and a dropped PDF reaches the "files selected" state. | vitest render test `src/pages/Form.dropzone.test.jsx` (Form mounted with mocks, fireEvent.drop of a PDF File, expects "files-selected" text) OR, if Form cannot mount in jsdom, a browser check against `vite` dev server documented in the note | implementer-opus | Form.dropzone.test.jsx | done | Real Form mounted in jsdom; 3 tests pass (pdf-lib/Parse stubbed) |

## Decisions
- 2026-10-14: no clarifying questions asked; principal asked for a hands-off run. Defaults chosen: Form.jsx field only, no deploy.
- Item 3 ran on implementer-opus instead of session (mocking-heavy). /code-review, /simplify, live /run skipped: live run needs a login on a rebuilt image, left to principal (deploy).
