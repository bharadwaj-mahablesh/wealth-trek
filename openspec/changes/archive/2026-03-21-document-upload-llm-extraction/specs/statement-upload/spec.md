## ADDED Requirements

### Requirement: Bulk add statement entries from extraction
The system SHALL support adding multiple statement entries at once from LLM extraction results, in addition to the existing single-entry add flow.

#### Scenario: Bulk add from extraction confirmation
- **WHEN** user confirms 5 extracted entries from a document
- **THEN** the system SHALL add all 5 entries to the statements list, save them to localStorage, and update the net worth summary

### Requirement: Document source tracking
Each statement entry MAY optionally track the source document ID from which it was extracted.

#### Scenario: Entry created from document extraction
- **WHEN** a statement entry is added via LLM extraction from an uploaded document
- **THEN** the entry SHALL store a reference to the source document ID

#### Scenario: Entry created manually
- **WHEN** a statement entry is added via the manual form
- **THEN** the entry SHALL have no source document reference
