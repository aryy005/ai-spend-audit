# Reflection

## 1. What was the most challenging part of this project?
The most challenging part was designing the Audit Engine logic to accurately reflect how a seasoned Fractional CFO or Procurement Manager thinks about software spend. I initially wrote basic rules (e.g., "If $ > X, recommend Y"). However, talking to founders revealed that the *real* waste isn't just price—it's underutilized seat capacity and redundant capability overlap (e.g., paying for GitHub Copilot AND Cursor Pro). Codifying these qualitative business realities into a deterministic TypeScript function required deep thought about the "Why" behind the math.

## 2. If you had 2 more weeks, what would you add or change?
I would implement a CSV upload feature parsing Expensify or Ramp exports. Asking founders to manually input their stack introduces friction. If they could drop a CSV, and an LLM extracted the AI tools to feed into the deterministic Audit Engine, the "Time to Value" would drop from 45 seconds to 5 seconds. I would also add OAuth via Google to automatically detect AI subscriptions in their inbox receipts.

## 3. What did you learn about the chosen stack?
Next.js App Router combined with Server Actions is the absolute fastest way to build a transactional SaaS app. By eliminating the REST API layer, I could define `AuditContext` in `audit-engine.ts`, pass it from the Client Component form directly to the Server Action, validate it, run the Anthropic API call server-side securely, and write to Supabase—all with complete end-to-end type safety. The productivity gain here is immense.

## 4. How did you ensure data accuracy?
By strictly isolating the LLM from the math. LLMs are notoriously bad at arithmetic and strictly adhering to complex pricing matrices. Therefore, the `calculateAudit` function is a pure, deterministic TypeScript function backed by Vitest unit tests. It calculates the exact dollars saved based on hardcoded, verified pricing. The Anthropic API is only fed the *results* of this math to generate a natural language summary. This guarantees the CFO reading the report won't find basic arithmetic errors.

## 5. What are the security/privacy considerations?
We intentionally decoupled the financial data from the PII (Personally Identifiable Information). When a user runs an audit, the financial data is saved to Supabase and a random `slug` is generated. At this stage, there is absolutely no way to tie that spend data back to a specific company. Only if they explicitly choose to provide their email *after* seeing the value is the `lead_id` attached. Even then, the public URL strips the email from the payload. We also implemented a honeypot field on the lead capture form to deter basic bot spam.
