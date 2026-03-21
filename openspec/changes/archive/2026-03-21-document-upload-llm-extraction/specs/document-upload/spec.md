## ADDED Requirements

### Requirement: Upload financial documents
The system SHALL allow users to upload financial documents (PDF, PNG, JPG, JPEG) via a file picker or drag-and-drop interface.

#### Scenario: Upload a PDF bank statement
- **WHEN** user selects a PDF file via the file picker
- **THEN** the system SHALL upload the file to the server, persist it on the filesystem, and display it in the uploaded documents list with filename, file type, and upload timestamp

#### Scenario: Upload an image of a mutual fund statement
- **WHEN** user drags and drops a JPG image onto the upload area
- **THEN** the system SHALL upload the file to the server, persist it on the filesystem, and display it in the uploaded documents list

### Requirement: Supported file types
The system SHALL accept only PDF, PNG, JPG, and JPEG file formats for upload.

#### Scenario: Reject unsupported file type
- **WHEN** user attempts to upload a .docx file
- **THEN** the system SHALL display an error message indicating the file type is not supported and SHALL NOT upload the file

#### Scenario: Accept supported file type
- **WHEN** user uploads a .pdf file
- **THEN** the system SHALL accept and process the upload

### Requirement: File size limit
The system SHALL enforce a maximum file size of 20MB per uploaded document.

#### Scenario: Reject oversized file
- **WHEN** user attempts to upload a 25MB PDF file
- **THEN** the system SHALL display an error message indicating the file exceeds the 20MB size limit and SHALL NOT upload the file

#### Scenario: Accept file within size limit
- **WHEN** user uploads a 5MB PDF file
- **THEN** the system SHALL accept and process the upload

### Requirement: Document persistence on server
The system SHALL persist uploaded documents on the server filesystem in an `uploads/` directory with a unique filename based on timestamp and original filename.

#### Scenario: File saved to filesystem
- **WHEN** user uploads a file named "sbi_statement.pdf"
- **THEN** the system SHALL save the file to `uploads/<timestamp>-sbi_statement.pdf` and return the stored file path in the response

### Requirement: Upload API endpoint
The system SHALL provide a `POST /api/documents/upload` endpoint that accepts multipart form data and returns document metadata (id, original filename, stored path, file type, size, upload timestamp).

#### Scenario: Successful upload API response
- **WHEN** a valid file is POSTed to `/api/documents/upload`
- **THEN** the system SHALL return a JSON response with `id`, `originalName`, `storedPath`, `fileType`, `size`, and `uploadedAt` fields

#### Scenario: Upload API rejects invalid request
- **WHEN** a request with no file is POSTed to `/api/documents/upload`
- **THEN** the system SHALL return a 400 error with an appropriate error message

### Requirement: Display uploaded documents list
The system SHALL display a list of all uploaded documents showing filename, file type, size, and upload timestamp.

#### Scenario: View uploaded documents
- **WHEN** user has uploaded 3 documents
- **THEN** the system SHALL display all 3 documents in the uploaded documents list with their details

### Requirement: Delete uploaded document
The system SHALL allow users to delete an uploaded document from both the UI list and the server filesystem.

#### Scenario: Delete a document
- **WHEN** user clicks delete on an uploaded document
- **THEN** the system SHALL remove the file from the server filesystem and remove the document from the displayed list

### Requirement: Multiple file upload
The system SHALL allow users to upload multiple files in a single selection.

#### Scenario: Upload multiple files at once
- **WHEN** user selects 3 files via the file picker
- **THEN** the system SHALL upload all 3 files and add each to the uploaded documents list

### Requirement: Upload progress indication
The system SHALL display a loading/progress indicator while a document is being uploaded.

#### Scenario: Upload in progress
- **WHEN** user initiates a file upload
- **THEN** the system SHALL display a loading indicator until the upload completes or fails
