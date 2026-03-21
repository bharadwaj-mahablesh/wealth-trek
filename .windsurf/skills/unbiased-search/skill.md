---
name: unbiased-search
description: Perform unbiased internet research without influence from existing files in the directory. Use when you need fresh, objective information from the web.
license: MIT
compatibility: Requires internet access and search_web tool.
metadata:
  author: cascade
  version: "1.0"
  generatedBy: "1.0"
---

Perform unbiased internet research without being influenced by existing files, code, or context in the current directory.

**IMPORTANT: This skill deliberately ignores local context to ensure objective research.** You must NOT read files, search the codebase, or reference existing project structure during the research phase. Focus purely on external information from the web.

---

## The Approach

- **Objective first** - Start with clean slate, no assumptions from existing code
- **Multiple sources** - Search across different domains and sources
- **Fact-based** - Focus on verifiable information, not opinions
- **Current information** - Prioritize recent and up-to-date sources
- **Broad scope** - Cast wide net before narrowing down

---

## Research Process

### 1. Initial Broad Search
Start with broad searches to understand the landscape:
```
search_web "topic overview current state"
search_web "topic best practices 2024"
search_web "topic alternatives comparison"
```

### 2. Deep Dive on Specific Aspects
Narrow down to specific areas:
```
search_web "specific subtopic implementation"
search_web "specific subtopic pros cons"
search_web "specific subtopic case studies"
```

### 3. Cross-Reference Sources
Search for corroborating information:
```
search_web "topic site:stackoverflow.com"
search_web "topic site:github.com"
search_web "topic site:medium.com"
search_web "topic site:dev.to"
```

### 4. Look for Recent Developments
Ensure information is current:
```
search_web "topic 2024 2025 updates"
search_web "topic latest trends"
search_web "topic new developments"
```

---

## What You Research

Depending on the user's query, you might research:

**Technical topics:**
- Technology comparisons (frameworks, libraries, tools)
- Implementation approaches and patterns
- Performance benchmarks and case studies
- Security considerations and best practices
- Industry standards and specifications

**Industry topics:**
- Market trends and analysis
- Competitor landscape
- User adoption and statistics
- Expert opinions and thought leadership
- Regulatory and compliance information

**Problem-solving:**
- Similar problems and solutions
- Lessons learned from others
- Common pitfalls and how to avoid them
- Success factors and case studies

---

## Research Output Format

Structure your findings clearly:

### Executive Summary
Brief overview of key findings

### Key Findings
- **Finding 1**: [Description with sources]
- **Finding 2**: [Description with sources]
- **Finding 3**: [Description with sources]

### Comparison Analysis
| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| Option A | ... | ... | ... |
| Option B | ... | ... | ... |

### Recommendations (if applicable)
Based purely on research findings, not local context

### Sources
List all sources consulted with URLs

---

## Guardrails

- **DON'T read local files** - Deliberately avoid existing codebase
- **DON'T search codebase** - No local grep or find operations
- **DON'T reference existing context** - Treat as fresh research
- **DO verify sources** - Check credibility and recency
- **DO cross-reference** - Look for consensus across sources
- **DO acknowledge limitations** - Note if information is conflicting or limited
- **DO provide sources** - Always cite where information came from

---

## Example Usage

```
User: /skill:unbiased-search best frontend framework 2024

You: I'll research the current state of frontend frameworks for 2024 without considering your existing codebase.

[Performs multiple web searches]

## Executive Summary
Based on current industry data, React, Vue, and Angular remain the top three frameworks, with Svelte gaining significant traction...

## Key Findings
- **React continues to dominate**: 68% market share according to Stack Overflow 2024 survey
- **Svelte's growth**: 42% year-over-year increase in adoption
- **Vue's stable position**: Consistent 15-20% market share

## Comparison Analysis
[Detailed comparison table]

## Recommendations
For new projects in 2024, consider React for ecosystem support, Svelte for performance, or Vue for learning curve...

## Sources
- Stack Overflow Developer Survey 2024
- State of JS 2024
- GitHub Octoverse Report
```

---

## Transition to Implementation

After research is complete, you can offer:
- "Would you like me to create a proposal based on these findings?"
- "Should we explore how this applies to your specific context?"
- "Ready to move from research to implementation planning?"

But only make these offers AFTER the unbiased research is complete and presented.
