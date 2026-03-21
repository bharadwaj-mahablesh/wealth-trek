## Context

The Net Worth Certificate Generator is a Next.js 16 app (App Router) using React 19, TailwindCSS 4, and shadcn/ui components. Currently, users manually enter financial statement entries one at a time via a form (statement type, description, category, closing balance, ownership percentage). Data is stored in browser localStorage.

Users typically have bank statements, mutual fund reports, and loan documents as PDFs or images. Manually transcribing these is tedious and error-prone. We want to allow document uploads and use OpenAI's API to extract structured financial data automatically.

## Goals / Non-Goals

**Goals:**
- Allow users to upload financial documents (PDF, images) via an intuitive UI
- Use pdfplumber to extract text from PDFs, OpenAI vision for images, then use OpenAI's LLM to extract structured financial data
- Present extracted data for user review/edit before adding to statement entries
- Persist uploaded documents on the server filesystem for future reference
- Maintain the existing manual entry workflow alongside the new upload flow

**Non-Goals:**
- Complex OCR solutions (we use pdfplumber for PDFs which is simpler and cheaper than vision models)
- Supporting document formats beyond PDF, PNG, JPG, JPEG
- User authentication or multi-user document isolation (single-user local app)
- Cloud storage for documents (local filesystem only)
- Automatic ownership percentage extraction (user sets this manually)

## Decisions

### Decision 1: pdfplumber for PDF text extraction + GPT-4o-mini for structured extraction

**Choice**: Use `pdfplumber` (Python library) to extract text from PDFs, then send the extracted text to OpenAI's `gpt-4o-mini` model for structured data extraction. For images (PNG, JPG, JPEG), use `gpt-4o` vision capabilities.

**Rationale**: 
- PDFs are primarily text-based; using pdfplumber is faster, cheaper, and more reliable than vision models
- GPT-4o-mini is sufficient for text-based extraction and significantly cheaper than GPT-4o
- Vision models only needed for actual images where text extraction isn't possible
- This hybrid approach optimizes cost while maintaining accuracy

**Alternatives considered**:
- GPT-4o vision for all documents: Works but unnecessarily expensive for PDFs
- Tesseract OCR: More complex setup, less accurate than pdfplumber for PDFs
- Google Document AI: Requires GCP setup, overkill for this use case

### Decision 2: Python child process for pdfplumber execution

**Choice**: Execute pdfplumber via a Python child process from Node.js using `child_process.spawn()`. Create a Python script (`scripts/extract_pdf_text.py`) that takes a PDF path as input and outputs extracted text to stdout.

**Rationale**: Next.js runs on Node.js; pdfplumber is Python. Spawning a child process is the simplest integration. The Python script is a thin wrapper around pdfplumber that returns plain text.

**Requirements**: Python 3.x must be installed on the server. Add a setup step to install pdfplumber via pip.

### Decision 3: Next.js API routes for server-side processing

**Choice**: Use Next.js App Router API routes (`app/api/`) for document upload and LLM extraction endpoints.

**Rationale**: Keeps the OpenAI API key server-side (never exposed to the client). Leverages existing Next.js infrastructure without needing a separate backend. Two routes:
- `POST /api/documents/upload` — accepts multipart form data, saves file to disk, returns document metadata
- `POST /api/documents/extract` — determines file type, extracts text (pdfplumber for PDF, vision for images), sends to OpenAI LLM, returns structured extraction results

### Decision 4: Filesystem storage for uploaded documents

**Choice**: Store uploaded documents in an `uploads/` directory at the project root, organized by timestamp and original filename.

**Rationale**: Simple, no database needed. File path is stored alongside document metadata. For a single-user local app, filesystem storage is appropriate.

**File naming**: `uploads/<timestamp>-<sanitized-original-name>` to avoid collisions.

### Decision 5: Structured extraction prompt with JSON schema

**Choice**: Use a carefully crafted system prompt that instructs GPT-4o to extract an array of financial entries, each with: `statementType`, `description`, `category` (asset/liability), and `closingBalance`. Return as JSON.

**Rationale**: Structured output ensures we can directly map extraction results to `StatementEntry` types. We provide the list of known statement type presets in the prompt so the model maps to our categories.

### Decision 6: Review-before-confirm UX pattern

**Choice**: After extraction, show results in an editable table/list where users can modify, delete, or confirm individual entries before they're added to the main statement list.

**Rationale**: LLM extraction is not 100% accurate. Users need to verify amounts and categories. This prevents bad data from silently entering the system.

### Decision 7: Image handling via base64 encoding

**Choice**: For images (PNG, JPG, JPEG), convert to base64 and send to OpenAI's vision API. For PDFs, extract text with pdfplumber and send as plain text to the LLM.

**Rationale**: Vision API requires base64 encoding for images. PDFs don't need encoding since we extract text first, which is cheaper and more reliable.

## Risks / Trade-offs

- **LLM accuracy varies by document format** → Mitigation: Review step lets users correct errors before confirming entries
- **OpenAI API costs** → Mitigation: Use GPT-4o-mini for text extraction (PDFs), GPT-4o vision only for images; single extraction per document; user controls when to trigger extraction
- **API key exposure risk** → Mitigation: Key stored in `.env.local`, only accessed server-side via API routes
- **Large PDF files may have too much text** → Mitigation: Enforce a file size limit (e.g., 20MB) on upload; truncate extracted text if needed (first N pages)
- **Python dependency requirement** → Mitigation: Document Python 3.x requirement clearly; provide setup instructions for installing pdfplumber
- **Rate limiting from OpenAI** → Mitigation: Sequential processing, user-initiated only; display clear error messages on failure
- **No persistent database for document metadata** → Mitigation: Acceptable for single-user local app; document list can be stored in localStorage alongside file paths
