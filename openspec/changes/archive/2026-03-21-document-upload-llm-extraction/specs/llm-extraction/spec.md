## ADDED Requirements

### Requirement: Extract financial data from uploaded document
The system SHALL provide a `POST /api/documents/extract` endpoint that accepts a document ID, sends the document to OpenAI's GPT-4o API, and returns an array of extracted financial entries.

#### Scenario: Successful extraction from bank statement
- **WHEN** a valid document ID for an uploaded PDF bank statement is POSTed to `/api/documents/extract`
- **THEN** the system SHALL return a JSON array of extracted entries, each containing `statementType`, `description`, `category` (asset or liability), and `closingBalance`

#### Scenario: Extraction from document with multiple accounts
- **WHEN** a document containing multiple financial accounts is processed
- **THEN** the system SHALL extract separate entries for each identifiable account

### Requirement: Structured extraction output
Each extracted entry SHALL contain: `statementType` (mapped to a known preset when possible), `description` (account identifier or name), `category` ("asset" or "liability"), and `closingBalance` (numeric value).

#### Scenario: Entry mapped to known preset
- **WHEN** the document contains a savings bank account with closing balance of 250000
- **THEN** the extracted entry SHALL have `statementType` "Savings Bank Account", `category` "asset", and `closingBalance` 250000

#### Scenario: Entry with unknown statement type
- **WHEN** the document contains a financial instrument not matching any preset
- **THEN** the extracted entry SHALL use the closest matching `statementType` from the presets or "Other Asset"/"Other Liability" as appropriate

### Requirement: OpenAI API key configuration
The system SHALL require an `OPENAI_API_KEY` environment variable to be configured for LLM extraction to function.

#### Scenario: Missing API key
- **WHEN** the extraction endpoint is called without `OPENAI_API_KEY` configured
- **THEN** the system SHALL return a 500 error with a message indicating the API key is not configured

### Requirement: Extraction error handling
The system SHALL handle OpenAI API errors gracefully and return meaningful error messages to the client.

#### Scenario: OpenAI API rate limit
- **WHEN** the OpenAI API returns a rate limit error during extraction
- **THEN** the system SHALL return a 429 error with a user-friendly message suggesting to try again later

#### Scenario: OpenAI API general failure
- **WHEN** the OpenAI API returns an unexpected error during extraction
- **THEN** the system SHALL return a 500 error with a message indicating extraction failed

### Requirement: Trigger extraction from UI
The system SHALL provide an "Extract Data" button on each uploaded document that triggers LLM extraction for that document.

#### Scenario: User triggers extraction
- **WHEN** user clicks "Extract Data" on an uploaded bank statement
- **THEN** the system SHALL call the extraction API, display a loading indicator during processing, and show extracted entries in a review panel upon completion

#### Scenario: Extraction loading state
- **WHEN** extraction is in progress for a document
- **THEN** the system SHALL display a loading/spinner indicator on that document's "Extract Data" button and disable it until extraction completes

### Requirement: Review extracted entries before adding
The system SHALL display extracted entries in an editable review panel where users can modify any field (statement type, description, category, closing balance), delete unwanted entries, or set ownership percentage before confirming.

#### Scenario: Edit extracted entry before confirming
- **WHEN** user views extraction results and changes the closing balance of an entry from 250000 to 275000
- **THEN** the updated value SHALL be reflected in the review panel

#### Scenario: Delete unwanted extracted entry
- **WHEN** user views extraction results and deletes an entry they don't want
- **THEN** the entry SHALL be removed from the review panel

#### Scenario: Set ownership percentage on extracted entry
- **WHEN** user views extraction results
- **THEN** each entry SHALL have an editable ownership percentage field defaulting to 100

### Requirement: Confirm extracted entries
The system SHALL allow users to confirm reviewed entries, which adds them to the main statement entries list.

#### Scenario: Confirm all extracted entries
- **WHEN** user clicks "Confirm All" on the extraction review panel with 3 entries
- **THEN** all 3 entries SHALL be added to the main statement entries list with their reviewed values

#### Scenario: Confirm individual entry
- **WHEN** user clicks confirm on a single extracted entry
- **THEN** that entry SHALL be added to the main statement entries list and removed from the review panel
