---
name: creating-skills
description: Generates high-quality, predictable, and efficient .agent/skills/ directories based on user requirements. Use when the user asks to create a new skill or standardize an existing workflow.
---

# Antigravity Skill Creator System Instructions

## When to use this skill
- User asks to "create a skill" or "standardize a workflow".
- You need to persist a complex set of behaviors for future agent sessions.
- User mentions "leveling up" or "saving a process".

## Workflow
[ ] **Analyze Requirement**: Understand the goal, triggers, and necessary degrees of freedom.
[ ] **Draft Structure**: Plan the folder hierarchy (`SKILL.md`, `scripts/`, `examples/`).
[ ] **Draft Content**: Write the `SKILL.md` content following the "Claude Way" principles (concise, 3rd person, progressive disclosure).
[ ] **Create Artifact**: Generate the files in `.agent/skills/<skill-name>/`.
[ ] **Verify**: Confirm the skill is saved and adhering to the frontmatter standards.

## Instructions for Writing Skills (The "Claude Way")

### 1. Core Structural Requirements
Every skill you generate must follow this folder hierarchy:
- `<skill-name>/`
    - `SKILL.md` (Required: Main logic and instructions)
    - `scripts/` (Optional: Helper scripts)
    - `examples/` (Optional: Reference implementations)
    - `resources/` (Optional: Templates or assets)

### 2. YAML Frontmatter Standards
The `SKILL.md` must start with YAML frontmatter following these strict rules:
- **name**: Gerund form (e.g., `testing-code`, `managing-databases`). Max 64 chars. Lowercase, numbers, and hyphens only. No "claude" or "anthropic" in the name.
- **description**: Written in **third person**. Must include specific triggers/keywords. Max 1024 chars. (e.g., "Extracts text from PDFs. Use when the user mentions document processing or PDF files.")

### 3. Writing Principles
* **Conciseness**: Assume the agent is smart. Do not explain what a PDF or a Git repo is. Focus only on the unique logic of the skill.
* **Progressive Disclosure**: Keep `SKILL.md` under 500 lines. If more detail is needed, link to secondary files (e.g., `[See ADVANCED.md](ADVANCED.md)`) only one level deep.
* **Forward Slashes**: Always use `/` for paths, never `\`.
* **Degrees of Freedom**: 
    - Use **Bullet Points** for high-freedom tasks (heuristics).
    - Use **Code Blocks** for medium-freedom (templates).
    - Use **Specific Bash Commands** for low-freedom (fragile operations).

### 4. Workflow & Feedback Loops
For complex tasks, include:
1.  **Checklists**: A markdown checklist the agent can copy and update to track state.
2.  **Validation Loops**: A "Plan-Validate-Execute" pattern. (e.g., Run a script to check a config file BEFORE applying changes).
3.  **Error Handling**: Instructions for scripts should be "black boxes"—tell the agent to run `--help` if they are unsure.

## Resources
- N/A
