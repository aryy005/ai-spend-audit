# Devlog

## Day 1: May 1, 2026 - The Premise & Scaffold
- **Focus**: Validating the idea and setting up the foundation.
- **Actions**: Talked to a founder friend who realized he was paying $1,200/mo for ChatGPT Enterprise seats his team wasn't using. Decided to build "Mint for AI tools". Initialized the Next.js App Router project with TypeScript and Tailwind. Set up the `shadcn/ui` base.
- **Thoughts**: I need this to look incredibly premium. If it looks like a cheap side project, founders won't trust it with their financial data.

## Day 2: May 2, 2026 - The Audit Engine Core
- **Focus**: Building the deterministic logic.
- **Actions**: Researched pricing for Cursor, Copilot, Claude, ChatGPT, Gemini, and Windsurf. Created `src/lib/audit-engine.ts`. Wrote 5 Vitest unit tests to ensure the math is flawless.
- **Thoughts**: Decided against using an LLM for the calculations. The math needs to be bulletproof. A CFO will immediately dismiss the tool if 5 * $20 doesn't equal $100. The LLM will only be used for the qualitative summary later.

## Day 3: May 3, 2026 - Database & Infrastructure
- **Focus**: Persistence and schema design.
- **Actions**: Designed the Supabase schema (`schema.sql`). Split `leads` and `audits` to allow for un-gated audits. Wrote the Next.js Server Actions to handle the DB insertions.
- **Thoughts**: The "give before you get" model is crucial. I want to show them the savings *before* asking for an email. This schema supports that flow perfectly.

## Day 4: May 4, 2026 - The AI Integration
- **Focus**: Adding the "Consultant" touch.
- **Actions**: Integrated the Anthropic SDK. Wrote a strict system prompt instructing Claude 3.5 Sonnet to act as an expert procurement consultant. Fed the deterministic results into the prompt.
- **Thoughts**: Claude is surprisingly good at nailing the professional, slightly encouraging tone I wanted. It makes the purely mathematical audit feel bespoke.

## Day 5: May 5, 2026 - The Input Form UI
- **Focus**: Reducing friction.
- **Actions**: Built `SpendInputForm` using `shadcn/ui`. Implemented dynamic field arrays for subscriptions. Added `localStorage` persistence so users don't lose data if they refresh.
- **Thoughts**: The form is the biggest bottleneck. It needs to be frictionless. I added default values to show them what it should look like.

## Day 6: May 6, 2026 - The Results Page & Viral Loop
- **Focus**: The "Ouch" moment and Lead Capture.
- **Actions**: Built `ResultsDisplay`. Made the total savings number massive and green. Added the lead capture form at the bottom. Integrated Resend to fire confirmation emails.
- **Thoughts**: The conditional CTA is working well. Small teams get a generic "keep me updated" form. High-spend teams get a "Book a Consultation" pitch. This perfectly aligns the product with Credex's core business model.

## Day 7: May 7, 2026 - Polish, Testing & Deployment
- **Focus**: Making it production-ready.
- **Actions**: Fixed a TypeScript bug in the Select component `onValueChange`. Ran full Lighthouse audits. Wrote all GTM, Economics, and Architecture docs. Verified CI/CD passes.
- **Thoughts**: The app feels incredibly fast. Vercel + Server Actions + Supabase is a ridiculously productive stack. Ready for launch.
