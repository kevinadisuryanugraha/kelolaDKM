# Workspace Rules & Development Methodology: Superpowers (obra/superpowers)

This workspace follows the **Superpowers Agentic Software Development Methodology** (inspired by Jesse Vincent's `obra/superpowers` framework) integrated with anti-AI-slop UI design principles.

## ⚡ Core Superpowers Workflow

1. **Goal & Requirements Clarification**:
   - Never rush directly into code implementation.
   - Establish precise technical specifications and scope boundaries with the user.

2. **Design & Specification Approval**:
   - Formulate clear, well-structured Implementation Plans (`implementation_plan.md`).
   - Obtain user approval on design architecture before writing code.

3. **Incremental Page-by-Page Execution**:
   - Work in small, isolated, verifiable batches (one page or component module at a time).
   - Protect existing API integrations, state logic, and routing from regressions.

4. **Test-Driven & Empirical Verification**:
   - After modifying any component, run static analysis and compilation checks (`npx tsc --noEmit`).
   - Run unit tests (`npm test`) and build verification (`npm run build`) before advancing to the next batch.

5. **Anti-Slop Design Engineering**:
   - Enforce modern aesthetic standards combining **shadcn/ui**, **Motion**, **Anime.js**, **Kokonut UI**, and **BKLIT**.
   - No generic purple glows, no templated mesh gradients, no broken mobile layouts.
