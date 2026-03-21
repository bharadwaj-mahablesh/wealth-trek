## 1. Component State Management Fix

- [x] 1.1 Add `useEffect` hook to `ExtractionReview` component to watch `extractedDocuments` prop changes
- [x] 1.2 Implement document ID tracking to identify which documents have already been processed
- [x] 1.3 Create merge logic to append only new entries from new documents to `reviewEntries` state
- [x] 1.4 Ensure user edits to existing entries are preserved when new documents are added

## 2. Testing & Validation

- [x] 2.1 Test: Extract from first document → verify entries appear in review widget
- [x] 2.2 Test: Extract from second document → verify both documents' entries appear together
- [x] 2.3 Test: Extract from 3+ documents sequentially → verify all entries accumulate
- [x] 2.4 Test: Edit an entry from Document A, then extract Document B → verify edits are preserved
- [x] 2.5 Test: Extract from same document twice → verify no duplicate entries appear
- [x] 2.6 Test: Confirm individual entries → verify remaining entries stay in widget
- [x] 2.7 Test: Confirm all entries → verify widget closes properly
