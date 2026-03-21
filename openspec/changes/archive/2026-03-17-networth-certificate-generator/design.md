## Context

This is a greenfield web application for individuals to generate net worth certificates. Users upload financial statements (bank accounts, mutual funds, stocks, loans, FDs, PPF, etc.), each categorized as an asset or liability with a closing balance. Users can claim a percentage of ownership for each entry (e.g., 50% for a joint account). The system computes total assets, total liabilities, and net worth, then generates a professional PDF certificate.

There is no existing codebase — this is a new project.

## Goals / Non-Goals

**Goals:**
- Provide a single-page web application where users can input personal details, add financial statement entries, and generate a PDF certificate
- Support categorization of each statement as asset or liability with statement type labels
- Allow ownership percentage (0–100%) per statement entry
- Compute net worth as: `(Sum of Assets × ownership%) − (Sum of Liabilities × ownership%)`
- Generate a clean, professional PDF certificate with itemized breakdown and net worth summary
- Keep the application client-side only — no backend server required; all processing happens in the browser

**Non-Goals:**
- Automated parsing/OCR of uploaded PDF/image statements (users manually enter closing balances)
- User authentication or multi-user support
- Persisting data across sessions (server-side storage)
- CA/auditor digital signatures or legal certification
- Currency conversion or multi-currency support

## Decisions

### 1. Client-Side Only Architecture
**Decision**: Build as a static single-page application with all logic in the browser.
**Rationale**: No sensitive financial data leaves the user's machine. Eliminates server costs, deployment complexity, and data privacy concerns. A net worth certificate generator doesn't need persistent storage or multi-user collaboration.
**Alternatives considered**:
- Full-stack with backend API — overkill for a tool that processes user-entered data into a PDF. Adds hosting cost and data liability.

### 2. Tech Stack: Next.js + React + TailwindCSS + shadcn/ui
**Decision**: Use Next.js (static export) with React, TailwindCSS for styling, and shadcn/ui for UI components.
**Rationale**: Modern, well-supported stack with excellent developer experience. TailwindCSS + shadcn/ui gives a professional look with minimal effort. Next.js static export allows easy deployment to any static host.
**Alternatives considered**:
- Plain HTML/JS — less maintainable, harder to build a polished UI
- Vue/Svelte — viable but React ecosystem has broader component library support (shadcn/ui)

### 3. PDF Generation: jsPDF + jspdf-autotable
**Decision**: Use jsPDF with the autotable plugin for client-side PDF generation.
**Rationale**: Mature, well-documented library that runs entirely in the browser. The autotable plugin handles tabular data (assets/liabilities breakdown) cleanly. No server roundtrip needed.
**Alternatives considered**:
- react-pdf — more React-native but heavier and more complex for simple tabular documents
- html2pdf.js — relies on html2canvas which can have rendering inconsistencies
- Server-side PDF generation — unnecessary complexity given client-side options work well

### 4. State Management: React useState/useReducer
**Decision**: Use React's built-in state management (useState/useReducer) with no external state library.
**Rationale**: The application state is simple — a list of statement entries and user profile data. No need for Redux/Zustand overhead.

### 5. Data Model
**Decision**: Each financial statement entry is represented as:
```
{
  id: string (uuid),
  statementType: string (e.g., "Savings Bank", "Mutual Fund", "Stock Holdings", "Home Loan"),
  description: string (e.g., "SBI Savings Account", "HDFC Equity Fund"),
  category: "asset" | "liability",
  closingBalance: number,
  ownershipPercentage: number (1-100, default 100),
  effectiveValue: number (computed: closingBalance × ownershipPercentage / 100)
}
```
User profile:
```
{
  fullName: string,
  address: string,
  certificateDate: date,
  asOnDate: date (the date for which balances are reported)
}
```

### 6. Statement Type Presets
**Decision**: Provide preset statement types with default category mapping:
- **Assets**: Savings Bank Account, Fixed Deposit, PPF, Mutual Fund, Stock Holdings, Real Estate, Gold/Jewellery, Other Asset
- **Liabilities**: Home Loan, Personal Loan, Car Loan, Credit Card Outstanding, Education Loan, Other Liability

Users can also enter custom types and manually set the category.

## Risks / Trade-offs

- **No data persistence** → User loses data on page refresh. Mitigation: Add localStorage auto-save so in-progress work survives accidental refresh.
- **PDF styling limitations** → jsPDF has limited styling compared to server-side solutions. Mitigation: Keep the certificate design clean and simple; the autotable plugin handles tables well enough.
- **No statement validation** → Users manually enter balances, so errors are possible. Mitigation: Display a clear preview/summary before PDF generation so users can review.
- **Browser compatibility** → jsPDF and Blob downloads may behave differently across browsers. Mitigation: Test on Chrome, Firefox, Edge; provide fallback for Safari.
