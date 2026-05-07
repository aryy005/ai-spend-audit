# Unit Economics

## The Cost Structure (COGS)
This tool is incredibly asset-light. We rely on deterministic rules for the heavy lifting (which costs essentially zero) and only use LLMs for the final qualitative polish.
- **Anthropic API (Claude 3.5 Sonnet)**: ~150 tokens input, ~80 tokens output. At $3/M input and $15/M output, the cost per audit generation is roughly **$0.0016**.
- **Database (Supabase)**: Free tier covers 500MB and 50,000 MAU. Marginal cost is $0.
- **Compute (Vercel)**: Server Actions run on edge/serverless. Free tier handles 100GB-hrs. Marginal cost is $0.
- **Email (Resend)**: Free for first 3,000 emails/mo.

**Total COGS per Audit**: ~$0.002. We can run 10,000 audits for $20.

## The Revenue Model (LTV & CAC)
This product is a top-of-funnel (ToFu) lead magnet for Credex's core business: Enterprise SaaS Negotiation & Procurement.
- **Core Product**: Credex takes a 20% cut of the first year's savings when negotiating Enterprise contracts, OR charges a flat $2,000 retainer for a full stack overhaul.
- **Conversion Math**: 
  - Assume 1,000 audits run.
  - 10% (100) are "High Spend" (>$500/mo waste).
  - 5% of High Spend book a consultation (5 calls).
  - 20% close rate on calls (1 new client).
  - Estimated LTV of a client: $3,000.
  - **Expected Value per Audit run**: $3.00.

## Conclusion
With a COGS of $0.002 and an Expected Value of $3.00, the tool has an asymmetric ROI. It is highly profitable purely as a marketing asset. Every dollar spent driving traffic to this tool yields massive leverage compared to traditional B2B SaaS ads (where CPCs can be $10+).
