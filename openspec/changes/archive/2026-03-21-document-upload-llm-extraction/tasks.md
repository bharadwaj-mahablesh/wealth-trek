## 1. Setup & Dependencies

- [x] 1.1 Install `openai` npm package
- [x] 1.2 Create `.env.local` with `OPENAI_API_KEY` placeholder and add `.env.local` to `.gitignore` if not already present
- [x] 1.3 Create `uploads/` directory at project root and add it to `.gitignore`
- [x] 1.4 Add new types: `UploadedDocument` (id, originalName, storedPath, fileType, size, uploadedAt) and `ExtractedEntry` (statementType, description, category, closingBalance) to `src/types/index.ts`
- [x] 1.5 Add optional `sourceDocumentId` field to `StatementEntry` type

## 2. Document Upload API

- [x] 2.1 Create `POST /api/documents/upload` route (`src/app/api/documents/upload/route.ts`) — accept multipart form data, validate file type (PDF/PNG/JPG/JPEG) and size (≤20MB), save to `uploads/<timestamp>-<sanitized-name>`, return document metadata JSON
- [x] 2.2 Create `DELETE /api/documents/[id]/route.ts` — delete file from filesystem given document metadata

## 3. LLM Extraction API

- [x] 3.1 Create OpenAI client utility (`src/lib/openai.ts`) that initializes the OpenAI client using `OPENAI_API_KEY` env var
- [x] 3.2 Create extraction prompt utility (`src/lib/extractionPrompt.ts`) with system prompt instructing GPT-4o to extract financial entries as JSON, including the list of known statement type presets for mapping
- [x] 3.3 Create `POST /api/documents/extract` route (`src/app/api/documents/extract/route.ts`) — read document from filesystem, encode as base64, send to OpenAI GPT-4o, parse response into `ExtractedEntry[]`, handle errors (missing API key → 500, rate limit → 429, general failure → 500)

## 4. Document Upload UI

- [x] 4.1 Create `DocumentUpload` component (`src/components/DocumentUpload.tsx`) with drag-and-drop zone and file picker, supporting multiple file selection, file type/size validation on client side, and upload progress indicator
- [x] 4.2 Create `DocumentList` component (`src/components/DocumentList.tsx`) displaying uploaded documents with filename, type, size, timestamp, "Extract Data" button, and delete button
- [x] 4.3 Create `useDocuments` hook (`src/hooks/useDocuments.ts`) to manage uploaded document metadata state (localStorage-backed list of `UploadedDocument`), with add/delete functions that also call the server API

## 5. Extraction Review UI

- [x] 5.1 Create `ExtractionReview` component (`src/components/ExtractionReview.tsx`) showing extracted entries in an editable table/card list — editable fields: statement type (select from presets), description, category, closing balance, ownership percentage (default 100). Include "Confirm" per entry and "Confirm All" button, plus ability to delete unwanted entries
- [x] 5.2 Wire extraction trigger: clicking "Extract Data" on a document calls the extraction API, shows loading state on the button, and on success opens the `ExtractionReview` panel with results

## 6. Integration & Page Assembly

- [x] 6.1 Update `src/app/page.tsx` to include `DocumentUpload`, `DocumentList`, and `ExtractionReview` components in the page layout, between the user profile form and the manual statement form
- [x] 6.2 Wire confirmed extraction entries to `addStatement` (bulk add support) with `sourceDocumentId` set
- [x] 6.3 Update the `useStatements` hook to support bulk adding multiple entries at once

## 7. Testing & Validation

- [x] 7.1 Manually test: upload PDF/image → verify file persisted in `uploads/` and appears in document list
- [x] 7.2 Manually test: trigger extraction → verify loading state, extracted entries displayed in review panel
- [x] 7.3 Manually test: edit/delete entries in review panel, confirm → verify entries added to main statement list
- [x] 7.4 Manually test: delete uploaded document → verify file removed from filesystem and list
- [x] 7.5 Manually test: error cases — unsupported file type, oversized file, missing API key
