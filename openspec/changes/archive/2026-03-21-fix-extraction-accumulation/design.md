## Context

The `ExtractionReview` component was recently refactored to accept multiple documents via an `extractedDocuments` array prop and consolidate all entries into a single review widget. However, the component uses `useState` with the initial value set from `extractedDocuments.flatMap()`, which only runs once during component mount. When new documents are extracted and added to the `extractedDocuments` array in the parent component, the `ExtractionReview` component's internal `reviewEntries` state does not update to include the new entries.

Current flow:
1. User extracts from Document A → `extractionResults` array gets Document A → `ExtractionReview` mounts with Document A entries
2. User extracts from Document B → `extractionResults` array gets Document A + B → `ExtractionReview` re-renders but `reviewEntries` state still only has Document A entries (useState initialization doesn't re-run)

## Goals / Non-Goals

**Goals:**
- Fix the `ExtractionReview` component to properly sync its internal state when the `extractedDocuments` prop changes
- Ensure all extracted entries from multiple documents accumulate and display in the review widget
- Maintain existing functionality for editing, deleting, and confirming individual entries

**Non-Goals:**
- Changing the overall architecture of the extraction flow
- Modifying the API routes or extraction logic
- Altering the UI design or layout of the review widget

## Decisions

### Decision 1: Use `useEffect` to sync state with prop changes

**Chosen approach:** Add a `useEffect` hook that watches `extractedDocuments` and updates `reviewEntries` when new documents are added.

**Rationale:** The component needs to respond to prop changes. React's `useState` initializer only runs once on mount, so we need `useEffect` to sync the internal state when the parent passes new data.

**Alternative considered:** Lift all state to the parent component and make `ExtractionReview` fully controlled. Rejected because it would require significant refactoring of the edit/delete logic and complicate the parent component.

### Decision 2: Merge strategy for new entries

**Chosen approach:** When `extractedDocuments` changes, append only the new entries to the existing `reviewEntries` state, preserving any user edits to existing entries.

**Rationale:** Users may have already edited some entries before extracting from another document. We should preserve those edits rather than resetting the entire state.

**Implementation:** Track which document IDs are already in `reviewEntries` and only add entries from new documents.

## Risks / Trade-offs

**Risk:** If the user extracts from the same document twice, duplicate entries could appear.
→ **Mitigation:** Track processed document IDs and skip documents that are already represented in `reviewEntries`.

**Risk:** User edits to entries could be lost if the effect runs unexpectedly.
→ **Mitigation:** Only append new entries, never replace existing ones. Use document ID tracking to ensure we only add truly new extractions.

**Trade-off:** Slightly more complex state management logic in the component.
→ **Acceptable:** The added complexity is minimal and isolated to one component. The benefit of proper accumulation outweighs the cost.
