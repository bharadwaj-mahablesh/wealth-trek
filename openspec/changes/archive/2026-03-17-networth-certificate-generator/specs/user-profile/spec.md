## ADDED Requirements

### Requirement: Capture user personal details
The system SHALL provide a form to capture: full name, address, certificate date (auto-defaults to today), and as-on date (the date for which balances are reported).

#### Scenario: Default certificate date
- **WHEN** user opens the profile form
- **THEN** the certificate date field SHALL be pre-filled with today's date

#### Scenario: Enter all profile fields
- **WHEN** user enters full name "Jane Smith", address "456 Park Avenue, Mumbai", and as-on date "31-Mar-2026"
- **THEN** the system SHALL store these details for use in PDF generation

### Requirement: Full name is required
The system SHALL require the full name field to be non-empty before allowing PDF generation.

#### Scenario: Empty full name rejected
- **WHEN** user leaves the full name field empty and attempts to generate the certificate
- **THEN** the system SHALL display a validation error on the full name field

### Requirement: As-on date is required
The system SHALL require the as-on date field to be filled before allowing PDF generation.

#### Scenario: Empty as-on date rejected
- **WHEN** user leaves the as-on date field empty and attempts to generate the certificate
- **THEN** the system SHALL display a validation error on the as-on date field

### Requirement: Auto-save profile to localStorage
The system SHALL automatically save user profile details to browser localStorage whenever they are changed.

#### Scenario: Profile persists across page refresh
- **WHEN** user has entered profile details and refreshes the page
- **THEN** the system SHALL restore the previously entered profile details from localStorage
