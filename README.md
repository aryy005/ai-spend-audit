# Credex AI Spend Audit

![Credex AI Spend Audit](screenshots-placeholder.png)

A free, un-gated tool where startup founders and engineering managers input their AI tool subscriptions and get an instant audit showing overspend, underutilized seat capacity, and redundant capability overlap. Think "Mint for AI tool spend."

## Quickstart

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables based on `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `RESEND_API_KEY`
4. Run the development server: `npm run dev`

## 5 Trade-off Decisions

1. **Deterministic Rules vs. LLM Engine**: I explicitly chose *not* to use an LLM for the core mathematical audit. LLMs hallucinate numbers and struggle with complex pricing matrix logic. A CFO will instantly dismiss the tool if the math is wrong. The math is hardcoded in a pure, testable TypeScript function (`audit-engine.ts`), and the LLM is only used to generate the qualitative executive summary.
2. **Next.js App Router (Server Actions)**: We opted to bypass a traditional REST API (Node/Express). Passing data directly from a Client Component to a Server Action allows us to validate inputs, securely call the Anthropic API without exposing keys, and write to Supabase in one single end-to-end typed request. This minimizes the network waterfall.
3. **Decoupled PII & Financial Data**: To encourage usage, we do not require an email to run the audit. The financial data is written to Supabase and a random `slug` is generated. Only if the user explicitly submits their email on the results page is their `lead_id` attached to the audit record. This drastically improves top-of-funnel conversion.
4. **Tailwind + shadcn/ui vs Custom CSS**: Standardized UI components using shadcn/ui to ensure high aesthetic quality ("premium" feel). Financial tools *must* look trustworthy. Writing custom CSS would take too long and likely result in cross-browser inconsistencies that erode trust.
5. **No Database Strict Dependency on First Render**: The `createAuditAction` attempts to write to Supabase, but if it fails, it still returns the payload to the frontend which caches it in `sessionStorage`. This means even if the database goes down, the core value proposition (the audit) still functions perfectly for the end user.
