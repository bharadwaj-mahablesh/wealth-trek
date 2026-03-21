## Context

The Net Worth Certificate Generator is a self-service web application for individuals to track their financial net worth. Currently using shadcn/ui components with basic Tailwind styling. The UI is functional but lacks the polish expected for a public-facing financial tool where users enter sensitive data.

Current state:
- Basic gray/white color scheme
- Minimal visual hierarchy
- Standard shadcn/ui component styling
- No custom branding or distinctive visual identity
- Basic responsive layout

## Goals / Non-Goals

**Goals:**
- Create a professional, trustworthy appearance suitable for financial data
- Improve visual hierarchy to guide users through the workflow
- Add subtle polish (shadows, transitions, spacing) without being flashy
- Maintain excellent readability and accessibility
- Enhance the mobile experience
- Keep the interface clean and focused

**Non-Goals:**
- Adding dark mode (can be a future enhancement)
- Changing the application architecture or data flow
- Adding new features or functionality
- Complex animations or motion design
- Custom illustration or iconography beyond existing Lucide icons

## Decisions

### Decision 1: Color Palette - Professional Blue/Slate

**Chosen approach:** Use a refined blue primary color with slate neutrals. Blue conveys trust and professionalism, appropriate for financial applications.

**Palette:**
- Primary: Indigo-600 (#4F46E5) for actions and accents
- Success: Emerald-600 for positive values (assets)
- Destructive: Rose-600 for negative values (liabilities) and errors
- Neutrals: Slate scale for text and backgrounds
- Background: Subtle warm gray (slate-50) with white cards

**Rationale:** Blue is universally associated with trust and stability in financial contexts. Avoiding flashy colors keeps the interface professional.

### Decision 2: Typography Hierarchy

**Chosen approach:** Use Inter font (already in Next.js) with clear size/weight hierarchy.

- Page title: 2xl/bold
- Section headers: lg/semibold
- Card titles: base/semibold
- Body text: sm/normal
- Labels: xs/medium with uppercase tracking
- Numbers/amounts: tabular-nums for alignment

**Rationale:** Clear typography hierarchy helps users scan and understand information quickly.

### Decision 3: Card and Container Styling

**Chosen approach:** Refined cards with subtle shadows, rounded corners, and hover states.

- Cards: White background, subtle border, soft shadow (shadow-sm)
- Hover: Slight shadow increase for interactive cards
- Sections: Clear visual separation with consistent spacing (space-y-6)
- Borders: Slate-200 for subtle definition

**Rationale:** Subtle shadows and borders create depth without being distracting.

### Decision 4: Form Input Styling

**Chosen approach:** Enhanced input focus states with ring styling and smooth transitions.

- Focus: Primary color ring with transition
- Validation: Clear error states with red border and helper text
- Labels: Consistent positioning and styling
- Inputs: Slightly larger touch targets for mobile

**Rationale:** Clear focus states improve accessibility and user confidence.

### Decision 5: Summary Section Enhancement

**Chosen approach:** Make the net worth summary more visually prominent with larger numbers and color coding.

- Total assets: Emerald color
- Total liabilities: Rose color  
- Net worth: Large, bold, primary color
- Progress-style visual indicator for asset/liability ratio

**Rationale:** The net worth summary is the key output - it should be visually prominent.

### Decision 6: Empty States and Guidance

**Chosen approach:** Add helpful empty states when no data exists.

- Empty document list: Upload prompt with icon
- Empty statement list: Add statement prompt
- First-time user: Brief onboarding guidance

**Rationale:** Empty states reduce confusion and guide new users.

### Decision 7: Subtle Transitions

**Chosen approach:** Add CSS transitions for state changes (150-200ms).

- Button hover/active states
- Card hover effects
- Form focus transitions
- Loading state animations

**Rationale:** Smooth transitions feel polished without being distracting.

## Risks / Trade-offs

**Risk:** Over-styling could make the UI feel heavy or slow.
→ **Mitigation:** Keep animations under 200ms, use CSS transitions (not JS), minimal shadow layers.

**Risk:** Color changes could affect accessibility.
→ **Mitigation:** Ensure all color combinations meet WCAG AA contrast ratios.

**Risk:** Changes could break existing component functionality.
→ **Mitigation:** Make styling changes incrementally, test each component.

**Trade-off:** More custom styling means more CSS to maintain.
→ **Acceptable:** The polish is worth the maintenance cost for a public-facing app.
