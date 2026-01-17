# [Feature Name] Implementation Plan

> **For Agent:** REQUIRED SUB-SKILL: Use `planning` principles to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries - Reference `brand-identity/resources/tech-stack.md`]

---

## Task Structure

### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.tsx`
- Modify: `exact/path/to/existing.ts:123-145`
- Test: `tests/exact/path/to/test.ts`

**Step 1: Write the failing test**

```typescript
// tests/feature.test.ts
import { render, screen } from '@testing-library/react';
// ... test code
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/feature.test.ts`
Expected: FAIL with "function not defined"

**Step 3: Write minimal implementation**

```typescript
// src/components/Feature.tsx
export function Feature() {
  return <div>Feature</div>;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/feature.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/feature.test.ts src/components/Feature.tsx
git commit -m "feat: add specific feature"
```
