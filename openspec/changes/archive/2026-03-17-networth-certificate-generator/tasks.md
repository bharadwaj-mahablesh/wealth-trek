## 1. Project Setup

- [x] 1.1 Initialize Next.js project with TypeScript, TailwindCSS, and App Router
- [x] 1.2 Install dependencies: shadcn/ui, jspdf, jspdf-autotable, lucide-react, uuid
- [x] 1.3 Configure shadcn/ui components (Button, Input, Select, Card, Dialog, Table, Label, Separator)
- [x] 1.4 Set up project folder structure: `components/`, `lib/`, `types/`

## 2. Data Model & Types

- [x] 2.1 Define TypeScript types for StatementEntry (id, statementType, description, category, closingBalance, ownershipPercentage, effectiveValue)
- [x] 2.2 Define TypeScript types for UserProfile (fullName, address, certificateDate, asOnDate)
- [x] 2.3 Define statement type presets with default category mappings (assets: Savings Bank Account, Fixed Deposit, PPF, Mutual Fund, Stock Holdings, Real Estate, Gold/Jewellery, Other Asset; liabilities: Home Loan, Personal Loan, Car Loan, Credit Card Outstanding, Education Loan, Other Liability)

## 3. State Management & localStorage Persistence

- [x] 3.1 Create custom hook useStatements for managing statement entries (add, edit, delete) with localStorage auto-save and restore
- [x] 3.2 Create custom hook useUserProfile for managing user profile data with localStorage auto-save and restore

## 4. User Profile Form

- [x] 4.1 Build UserProfileForm component with fields: full name (required), address, certificate date (default today), as-on date (required)
- [x] 4.2 Add validation: full name and as-on date are required; display inline errors

## 5. Statement Management UI

- [x] 5.1 Build StatementForm component (add/edit mode) with fields: statement type (dropdown with presets), description, category (auto-filled from preset, editable), closing balance (non-negative validation), ownership percentage (1-100, default 100)
- [x] 5.2 Build StatementList component displaying all entries in a table grouped by assets and liabilities, showing closing balance, ownership %, and effective value
- [x] 5.3 Add edit and delete actions per statement entry row
- [x] 5.4 Implement validation: reject negative closing balance, reject ownership % outside 1-100

## 6. Net Worth Computation & Live Summary

- [x] 6.1 Implement computeEffectiveValue function: closingBalance × ownershipPercentage / 100
- [x] 6.2 Implement computeTotals function: total assets, total liabilities, net worth
- [x] 6.3 Build NetWorthSummary component displaying live total assets, total liabilities, and net worth, updating in real-time as entries change

## 7. PDF Certificate Generation

- [x] 7.1 Implement Indian currency formatting utility (₹12,50,000.00 format)
- [x] 7.2 Build PDF generation function using jsPDF + jspdf-autotable: certificate header with user profile details, itemized assets table, itemized liabilities table (or "Nil"), net worth summary
- [x] 7.3 Add "Generate Certificate" button with validation check (full name and as-on date required, at least one entry exists)
- [x] 7.4 Implement PDF download with filename format: NetWorth_Certificate_<fullName>_<asOnDate>.pdf

## 8. Main Page Layout & Integration

- [x] 8.1 Build main page layout integrating UserProfileForm, StatementForm, StatementList, NetWorthSummary, and Generate Certificate button
- [x] 8.2 Style the page with TailwindCSS for a clean, professional look with responsive design
- [x] 8.3 Add app header/branding and footer

## 9. Testing & Polish

- [x] 9.1 Test full flow: add profile → add assets/liabilities with various ownership % → generate PDF → verify PDF contents
- [x] 9.2 Test edge cases: no entries, only assets, only liabilities, negative net worth, 0% and 100% ownership boundary
- [x] 9.3 Test localStorage persistence across page refresh
- [x] 9.4 Cross-browser testing (Chrome, Firefox, Edge)
