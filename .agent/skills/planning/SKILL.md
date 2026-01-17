---
name: planning
description: Use when you have a spec or requirements for a multi-step task, before touching code. Generates detailed implementation plans with bite-sized tasks.
---

# Planning & Implementation Design

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the planning skill to create the implementation plan."

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>.md`

## CORE: Bite-Sized Task Granularity

**Each step must be one atomic action (2-5 minutes):**
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For Agent:** REQUIRED SUB-SKILL: Use `planning` principles and `executing-plans` (if available) to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

## Task Structure Template

Use the following structure for every task in the plan:

```markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.tsx`
- Modify: `exact/path/to/existing.ts:123-145`
- Test: `tests/exact/path/to/test.ts`

**Step 1: Write the failing test**

\`\`\`typescript
// tests/feature.test.ts
import { render, screen } from '@testing-library/react';
// ... test code
\`\`\`

**Step 2: Run test to verify it fails**

Run: \`npm test -- tests/feature.test.ts\`
Expected: FAIL with "function not defined"

**Step 3: Write minimal implementation**

\`\`\`typescript
// src/components/Feature.tsx
export function Feature() {
  return <div>Feature</div>;
}
\`\`\`

**Step 4: Run test to verify it passes**

Run: \`npm test -- tests/feature.test.ts\`
Expected: PASS

**Step 5: Commit**

\`\`\`bash
git add tests/feature.test.ts src/components/Feature.tsx
git commit -m "feat: add specific feature"
\`\`\`
```

## Critical Rules
- **Exact file paths always.** Never say "component folder", say `src/components/ui/button.tsx`.
- **Complete code in plan.** Do not say "add validation", write the validation code.
- **Exact commands with expected output.**
- **Reference relevant skills.** Use instructions from `brand-identity` for styling and tone.
- **DRY, YAGNI, TDD, frequent commits.**

## Resources
-   **Plan Template:** You can use [`resources/template.md`](resources/template.md) to generate the structure.
-   **Brand Identity:** Refer to `brand-identity` skill for tech stack and design tokens.
