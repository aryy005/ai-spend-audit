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
            reason: `Enterprise/Business features are usually overkill for a team of ${context.teamSize}; Pro is sufficient.`,
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
            reason: 'Team plan is meant for 2+ users. Plus provides similar capabilities for a solo user.',
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
            reason: 'Claude Team requires a minimum of 5 seats. If your team is smaller, individual Pro accounts are cheaper.',
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
            reason: 'For writing tasks, using the Anthropic API directly via a custom interface or typing tool often costs significantly less than a flat $20/mo subscription.',
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
            reason: 'Cursor Pro provides a more deeply integrated AI experience for coding and may be more cost-effective than Copilot Enterprise/Business.',
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
        reason: 'You are already using the optimal plan for your use case and team size.',
      });
    }
  }

  return {
    recommendations,
    totalSavings,
    totalCurrentSpend,
  };
}
