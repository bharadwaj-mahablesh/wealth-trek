## MODIFIED Requirements

### Requirement: Extraction review accumulation
The extraction review widget SHALL accumulate entries from multiple document extractions, displaying all extracted entries together in a single consolidated view rather than replacing previous extractions.

#### Scenario: Extract from first document
- **WHEN** user extracts data from the first uploaded document
- **THEN** the system SHALL display the extracted entries in the review widget

#### Scenario: Extract from second document while first is pending review
- **WHEN** user extracts data from a second document while entries from the first document are still in the review widget
- **THEN** the system SHALL add the new entries to the existing review widget, preserving all entries from the first document

#### Scenario: Extract from multiple documents sequentially
- **WHEN** user extracts data from 3 documents sequentially (Document A, then B, then C)
- **THEN** the review widget SHALL display all entries from all 3 documents together, with each entry showing its source document name

#### Scenario: Prevent duplicate entries from same document
- **WHEN** user extracts data from the same document twice
- **THEN** the system SHALL only add entries from the second extraction if the document ID is different, preventing duplicate entries from the same source

#### Scenario: User edits are preserved during accumulation
- **WHEN** user edits an entry from Document A, then extracts from Document B
- **THEN** the system SHALL preserve the edited values from Document A while adding new entries from Document B
