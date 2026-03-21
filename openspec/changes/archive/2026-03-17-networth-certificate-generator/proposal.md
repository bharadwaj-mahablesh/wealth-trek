## Why

Individuals often need a networth certificate for loan applications, visa processing, financial planning, or legal purposes. Currently, generating one requires manually consolidating balances from multiple financial statements (bank accounts, mutual funds, stocks, loans, etc.) and computing net worth. This is tedious and error-prone. A dedicated tool that lets users upload their statements, categorize closing balances as assets or liabilities, claim partial ownership, and generate a professional PDF certificate will save significant time and reduce errors.

## What Changes

- Users can upload financial statements (savings bank, mutual funds, stock holdings, loan accounts, fixed deposits, PPF, etc.)
- Each uploaded statement's closing balance is categorized under its respective head: **Assets** or **Liabilities**
- Users can specify a **percentage of ownership** for each statement (e.g., 50% ownership in a joint account)
- The system computes **Total Assets**, **Total Liabilities**, and **Net Worth** (Assets − Liabilities) based on claimed ownership percentages
- Users can generate and download a **Net Worth Certificate in PDF format** summarizing all entries

## Capabilities

### New Capabilities
- `statement-upload`: Upload and manage financial statements with closing balance, category (asset/liability), statement type, and ownership percentage
- `networth-computation`: Compute total assets, total liabilities, and net worth from uploaded statements factoring in ownership percentages
- `pdf-certificate-generation`: Generate a professional net worth certificate in PDF format with itemized assets, liabilities, and final net worth
- `user-profile`: Capture user personal details (name, date, address) required for the certificate header

### Modified Capabilities

## Impact

- **Frontend**: New UI for uploading statements, managing entries, setting ownership percentages, previewing and downloading the PDF certificate
- **Backend**: API endpoints for statement CRUD, networth computation, and PDF generation
- **Dependencies**: PDF generation library, file/state management
- **No existing systems affected** — this is a greenfield application
