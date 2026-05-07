# Test Plan: Audit Engine

We will use Jest or Vitest for testing the pure function `calculateAudit` in the Audit Engine.

## Minimum 5 Automated Tests

1. **Test Over-provisioned Seats**:
   - Input: Cursor Enterprise with 2 seats, $80/mo spend.
   - Expected Output: Recommend Cursor Pro. Savings: $40/mo ($80 - 2 * $20). Reason: "Enterprise features are overkill for a 2-person team; Pro is sufficient."

2. **Test Wrong Plan for Solo Developer**:
   - Input: ChatGPT Team with 1 seat, $30/mo spend.
   - Expected Output: Recommend ChatGPT Plus. Savings: $10/mo. Reason: "Team plan is meant for 2+ users; Plus provides the same capabilities for solo use."

3. **Test Alternative Tool for Coding**:
   - Input: GitHub Copilot Business ($19/user/mo) for primary use case 'coding'.
   - Expected Output: Suggest Cursor Pro ($20/mo) as an alternative with higher ROI, OR if spend is too high on an alternative API, suggest Copilot/Cursor. (Specific logic based on PRICING_DATA.md).

4. **Test API over Subscription**:
   - Input: 5 users paying for Claude Pro ($100/mo) but only using it for occasional writing tasks.
   - Expected Output: Suggest Anthropic API Direct. Estimated Savings: ~$75/mo (based on estimated average $5/mo/user API usage vs $20 flat rate).

5. **Test Optimal Spend**:
   - Input: Solo dev on Cursor Pro paying $20/mo for coding.
   - Expected Output: No change recommended. Savings $0. Reason: "You are already using the optimal plan for your use case and team size."
