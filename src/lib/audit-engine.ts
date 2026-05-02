export type PrimaryUseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface AIsubscription {
  tool: string;
  plan: string;
  seats: number;
  monthlySpend: number;
}

export interface AuditContext {
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  subscriptions: AIsubscription[];
}

export interface Recommendation {
  tool: string;
  currentSpend: number;
  recommendedPlan: string | null;
  recommendedSpend: number;
  savingsAmount: number;
  reason: string;
}

export interface AuditResult {
  recommendations: Recommendation[];
  totalSavings: number;
  totalCurrentSpend: number;
}

export function calculateAudit(context: AuditContext): AuditResult {
  const recommendations: Recommendation[] = [];
  let totalSavings = 0;
  let totalCurrentSpend = 0;

  for (const sub of context.subscriptions) {
    totalCurrentSpend += sub.monthlySpend;
    let savings = 0;
    let rec: Recommendation | null = null;
    const toolLower = sub.tool.toLowerCase();
    const planLower = sub.plan.toLowerCase();

    // Cursor
    if (toolLower.includes('cursor')) {
      if ((planLower.includes('enterprise') || planLower.includes('business')) && context.teamSize < 5) {
        const recommendedSpend = sub.seats * 20; // Pro is $20
        savings = sub.monthlySpend - recommendedSpend;
        if (savings > 0) {
          rec = {
            tool: sub.tool,
            currentSpend: sub.monthlySpend,
            recommendedPlan: 'Pro',
            recommendedSpend,
            savingsAmount: savings,
            reason: `Underutilized seat capacity: Enterprise SSO and advanced compliance features yield negative ROI for teams under 5. Downgrading to Pro eliminates deadweight loss.`,
          };
        }
      }
    }

    // ChatGPT
    if (toolLower.includes('chatgpt')) {
      if (planLower.includes('team') && context.teamSize === 1) {
        const recommendedSpend = 20; // Plus is $20, Team minimum is $60
        savings = sub.monthlySpend - recommendedSpend;
        if (savings > 0) {
          rec = {
            tool: sub.tool,
            currentSpend: sub.monthlySpend,
            recommendedPlan: 'Plus',
            recommendedSpend,
            savingsAmount: savings,
            reason: 'Sub-optimal tier allocation: The Team plan minimum seat requirements create deadweight loss for solo users. Plus provides identical model utility at a lower unit cost.',
          };
        }
      }
    }

    // Claude
    if (toolLower.includes('claude')) {
      if (planLower.includes('team') && context.teamSize < 5) {
        const recommendedSpend = context.teamSize * 20; // Pro is $20/user
        savings = sub.monthlySpend - recommendedSpend;
        if (savings > 0) {
          rec = {
            tool: sub.tool,
            currentSpend: sub.monthlySpend,
            recommendedPlan: 'Pro',
            recommendedSpend,
            savingsAmount: savings,
            reason: 'Inefficient minimums: Claude Team enforces a 5-seat minimum ($150/mo baseline). Your current headcount makes individual Pro licenses strictly dominant economically.',
          };
        }
      } else if (context.primaryUseCase === 'writing' && (planLower.includes('pro') || planLower.includes('team'))) {
        const recommendedSpend = sub.seats * 5; // Estimated API spend
        savings = sub.monthlySpend - recommendedSpend;
        if (savings > 0) {
          rec = {
            tool: sub.tool,
            currentSpend: sub.monthlySpend,
            recommendedPlan: 'API Direct',
            recommendedSpend,
            savingsAmount: savings,
            reason: 'Asset mismatch: Flat-rate subscriptions for occasional writing tasks are economically inefficient. Migrating to a consumption-based API model better aligns cost with actual token utilization.',
          };
        }
      }
    }

    // GitHub Copilot
    if (toolLower.includes('copilot') || toolLower.includes('github')) {
      if (planLower.includes('enterprise') || planLower.includes('business')) {
        const recommendedSpend = sub.seats * 20; // Cursor Pro alternative
        savings = sub.monthlySpend - recommendedSpend;
        if (savings > 0 && context.primaryUseCase === 'coding') {
          rec = {
            tool: sub.tool,
            currentSpend: sub.monthlySpend,
            recommendedPlan: 'Cursor Pro (Alternative)',
            recommendedSpend,
            savingsAmount: savings,
            reason: 'Redundant capability overlap: Copilot Enterprise/Business provides diminishing marginal utility for pure coding workflows compared to Cursor Pro. Consolidating yields significant unit cost reduction.',
          };
        }
      }
    }

    if (rec) {
      recommendations.push(rec);
      totalSavings += rec.savingsAmount;
    } else {
      // If no recommendation, it's optimal
      recommendations.push({
        tool: sub.tool,
        currentSpend: sub.monthlySpend,
        recommendedPlan: null,
        recommendedSpend: sub.monthlySpend,
        savingsAmount: 0,
        reason: 'Capital efficient allocation: Your current tier structure aligns perfectly with your headcount and primary utilization patterns. No arbitrage opportunities identified.',
      });
    }
  }

  return {
    recommendations,
    totalSavings,
    totalCurrentSpend,
  };
}
