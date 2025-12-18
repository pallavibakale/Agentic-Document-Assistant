# Agentic Document Assistant  
**Structure-first AI drafting and editing**

## Overview

Agentic Document Assistant is a lightweight document editor where AI **creates and edits documents as structured data**, not free-form text.

Instead of generating raw text and pasting it into an editor, the AI produces **schema-compliant document blocks** (sections, headings, paragraphs). This guarantees that document structure is preserved from the first draft through every subsequent edit.

The project explores how AI and humans can collaborate on documents **without breaking formatting, hierarchy, or intent**.

---

## Why this exists

Most AI writing tools treat documents as plain text:
- Structure is lost
- Formatting breaks
- Edits become risky
- Users lose trust

This project takes a different approach:
- Structure is the source of truth
- AI operates within strict boundaries
- All edits are validated before applying

This model is especially important for legal, enterprise, and long-form documents where correctness matters.

---

## Key Ideas

### 1. Structure-first AI generation

AI never returns HTML or markdown.  
It returns **structured JSON** that maps directly to the editor schema.

Example AI output:
```json
{
  "sections": [
    {
      "title": "Introduction",
      "content": [
        "This agreement is made between the Company and the Contractor."
      ]
    },
    {
      "title": "Confidentiality",
      "content": [
        "The Contractor agrees to protect confidential information."
      ]
    }
  ]
}
```

This output is converted into editor nodes, not pasted as text.

---

### 2. Schema-driven editing

The editor is built on ProseMirror with a strict schema:
- Documents are made of sections
- Sections contain headings and paragraphs
- Invalid structures are rejected

This mirrors how real DOCX documents behave.

---

### 3. Agent-based AI actions

AI does not modify the entire document.

Each action is:
- Scoped to a single section
- Explicitly triggered by the user
- Validated before applying

Examples:
- Rewrite a section
- Summarize a section
- Change tone

This keeps AI helpful without being dangerous.

---

### 4. User stays in control

AI suggestions are never automatic.  
Users:
- Trigger actions intentionally
- Review results before applying
- Can edit manually at any time

The system is designed for **trust**, not surprise.

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Editor:** ProseMirror
- **Backend:** Node.js, TypeScript, Express
- **AI:** Mock LLM (easily replaceable with real providers)
- **Styling:** Minimal CSS

---

## Project Structure

```
agentic-doc-assistant/
├── editor/
│   ├── schema.ts
│   ├── documentBuilder.ts
│   ├── sectionActions.ts
│   └── editorSetup.ts
├── server/
│   ├── generate.ts
│   ├── sectionAction.ts
│   └── index.ts
├── ui/
│   ├── PromptInput.tsx
│   └── SectionToolbar.tsx
├── README.md
```

---

## How it works (High level)

1. User provides a document prompt  
2. Backend generates structured JSON via AI  
3. JSON is validated and converted into editor nodes  
4. User edits or selects a section  
5. AI actions operate on that section only  
6. Results are reinserted without breaking structure  

No HTML. No markdown parsing. No unsafe text injection.

---

## What this project demonstrates

- Schema-aware document editing  
- Safe AI integration into editors  
- Agent-based LLM workflows  
- Clear separation between generation, validation, and application  
- Engineering judgment around correctness and user trust  

---

## Non-Goals

- Real-time collaboration  
- Full DOCX import/export  
- Authentication or persistence  
- Visual polish  

This project focuses on **core document and AI mechanics**, not product completeness.

---

## Why this matters

As AI becomes part of writing workflows, correctness and structure matter more than speed.

This project shows one way to:
- Let AI help  
- Keep documents valid  
- Keep users in control  

---

## Future Extensions (Out of scope)

- Track changes  
- Comments and suggestions  
- DOCX export  
- Multi-user collaboration  
- Real LLM integration  

---

