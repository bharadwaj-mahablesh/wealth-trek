## Why

Currently, users must manually enter each financial statement's details (statement type, category, closing balance, ownership percentage) one at a time. This is tedious and error-prone, especially for users with many financial accounts. Users already have bank statements, mutual fund reports, loan documents, etc. as PDFs or images. By allowing document uploads and leveraging OpenAI's LLM to automatically extract financial details, we can dramatically reduce data entry effort and improve accuracy.

## What Changes

- Add a document upload interface that accepts PDFs and images (bank statements, investment reports, loan documents, etc.)
- Use `pdfplumber` to extract text from PDF documents, and OpenAI's vision API for images
- Introduce a server-side API route that sends extracted text/image to OpenAI's LLM to extract structured financial data (statement type, description, category, closing balance)
- Auto-populate statement entries from LLM-extracted data, allowing users to review and edit before confirming
- Persist uploaded documents on the server filesystem so they are available for future reference
- Users can still manually add/edit entries alongside LLM-extracted ones
- **BREAKING**: Requires an OpenAI API key configured as an environment variable on the server

## Capabilities

### New Capabilities
- `document-upload`: Upload financial documents (PDF, images) via a drag-and-drop or file picker UI, persist them on the server, and associate them with statement entries
- `llm-extraction`: Extract text from PDFs using pdfplumber, process images with OpenAI vision, then use OpenAI's LLM to extract structured financial data (statement type, description, category, closing balance) and return parsed entries for user review

### Modified Capabilities
- `statement-upload`: Add ability to bulk-add statement entries from LLM extraction results, with a review/confirm step before entries are finalized

## Impact

- **New dependencies**: `openai` npm package for OpenAI API integration, `pdfplumber` Python package for PDF text extraction (requires Python runtime)
- **Python runtime**: Server must have Python 3.x installed to run pdfplumber for PDF text extraction
- **New API routes**: Next.js API routes for document upload and LLM extraction
- **Server filesystem**: Uploaded documents will be stored in a configurable directory (e.g., `uploads/`)
- **Environment config**: Requires `OPENAI_API_KEY` environment variable
- **Frontend**: New document upload component, extraction review UI; existing StatementForm and page layout modified
- **Types**: New types for uploaded documents and extraction results
