## ADDED Requirements

### Requirement: Generate PDF certificate
The system SHALL generate a net worth certificate in PDF format when the user clicks the "Generate Certificate" button.

#### Scenario: Successful PDF generation
- **WHEN** user has at least one statement entry and valid profile details and clicks "Generate Certificate"
- **THEN** the system SHALL generate and download a PDF file named "NetWorth_Certificate_<fullName>_<asOnDate>.pdf"

### Requirement: PDF contains user profile header
The PDF certificate SHALL include a header section displaying the user's full name, address, certificate generation date, and the "as on" date for which balances are reported.

#### Scenario: Profile details in PDF header
- **WHEN** the PDF is generated with full name "John Doe", address "123 Main St", and as-on date "31-Mar-2026"
- **THEN** the PDF header SHALL display all these details prominently

### Requirement: PDF contains itemized assets table
The PDF certificate SHALL include a table listing all asset entries with columns: S.No, Statement Type, Description, Closing Balance, Ownership %, and Effective Value, followed by a Total Assets row.

#### Scenario: Assets table in PDF
- **WHEN** the user has 3 asset entries
- **THEN** the PDF SHALL contain a table with 3 data rows plus a total row showing the sum of effective values

### Requirement: PDF contains itemized liabilities table
The PDF certificate SHALL include a table listing all liability entries with columns: S.No, Statement Type, Description, Closing Balance, Ownership %, and Effective Value, followed by a Total Liabilities row.

#### Scenario: Liabilities table in PDF
- **WHEN** the user has 2 liability entries
- **THEN** the PDF SHALL contain a table with 2 data rows plus a total row showing the sum of effective values

#### Scenario: No liabilities
- **WHEN** the user has no liability entries
- **THEN** the PDF SHALL display the liabilities section with a "Nil" indication and Total Liabilities as 0

### Requirement: PDF contains net worth summary
The PDF certificate SHALL include a net worth summary section displaying: Total Assets, Total Liabilities, and Net Worth (Total Assets − Total Liabilities).

#### Scenario: Net worth summary in PDF
- **WHEN** total assets are 1000000 and total liabilities are 400000
- **THEN** the PDF summary SHALL show Net Worth as 600000

### Requirement: PDF generation requires profile details
The system SHALL prevent PDF generation if required profile fields (full name, as-on date) are not filled.

#### Scenario: Missing full name prevents generation
- **WHEN** user clicks "Generate Certificate" without entering full name
- **THEN** the system SHALL display a validation error and NOT generate the PDF

### Requirement: Currency formatting in PDF
The PDF certificate SHALL display all monetary values formatted with Indian numbering system (e.g., ₹12,50,000.00).

#### Scenario: Indian currency format
- **WHEN** an effective value is 1250000
- **THEN** the PDF SHALL display it as "₹12,50,000.00"
