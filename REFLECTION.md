# Reflection

## 1. What was the most challenging part of this project?
Modeling the pricing and capability tiers of different AI tools accurately. Many tools have overlapping capabilities, and deciding on a clear "recommendation rule" for cheaper alternatives without overcomplicating the engine required careful thought.

## 2. If you had 2 more weeks, what would you add or change?
I would implement a full multi-tenant dashboard for companies to track their spend over time, rather than just a one-off audit. I would also integrate Plaid or a similar financial API to auto-detect AI spend from bank statements rather than relying on manual input.

## 3. What did you learn about the chosen stack?
Next.js App Router and Server Actions provide a highly cohesive development experience. Handling the form submission, running the audit logic, calling the Anthropic API, and saving to Supabase all securely on the server side from a single Server Action drastically reduced the need for building standalone API routes.

## 4. How did you ensure data accuracy?
By keeping the Audit Engine deterministic and entirely separate from the LLM. The LLM is strictly for qualitative summary, while the savings and overspend calculations are rule-based, testable functions mapped strictly to `PRICING_DATA.md`.

## 5. What are the security/privacy considerations?
We ensure no PII (email, company name) is leaked via the public, shareable `/audit/[slug]` route. We also implemented basic honeypot and rate-limiting concepts to protect the Supabase database and Resend quota from abuse.
