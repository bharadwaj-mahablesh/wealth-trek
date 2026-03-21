## Why

When users extract data from multiple uploaded documents sequentially, the extraction review widget only displays entries from the most recent extraction, discarding all previously extracted entries. This prevents users from reviewing and confirming entries from multiple documents together, forcing them to confirm each document's extraction immediately before extracting the next one.

## What Changes

- Fix the `ExtractionReview` component to properly accumulate entries from multiple document extractions instead of replacing them
- Ensure the `extractionResults` state in `page.tsx` correctly adds new extraction results to the existing array
- Verify that the component's `useEffect` or initialization properly handles updates when new documents are extracted

## Capabilities

### New Capabilities
<!-- None - this is a bug fix -->

### Modified Capabilities
- `document-upload`: Fix extraction accumulation logic to properly display all extracted entries from multiple documents in a single consolidated review widget

## Impact

- Affects `ExtractionReview` component (`src/components/ExtractionReview.tsx`)
- Affects main page state management (`src/app/page.tsx`)
- Users will be able to extract from multiple documents and see all entries accumulated in the review widget
- No breaking changes - purely a bug fix to restore expected behavior
