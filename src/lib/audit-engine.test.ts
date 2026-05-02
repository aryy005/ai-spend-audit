import { calculateAudit, AuditContext } from './audit-engine';
import { describe, it, expect } from 'vitest';
describe('Audit Engine', () => {
  it('recommends Cursor Pro for over-provisioned seats', () => {
    const context: AuditContext = {
      teamSize: 2,
      primaryUseCase: 'coding',
      subscriptions: [
        { tool: 'Cursor', plan: 'Enterprise', seats: 2, monthlySpend: 80 }
      ]
    };
    const result = calculateAudit(context);
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].recommendedPlan).toBe('Pro');
    expect(result.recommendations[0].savingsAmount).toBe(40);
  });

  it('recommends ChatGPT Plus for a solo developer on Team plan', () => {
    const context: AuditContext = {
      teamSize: 1,
      primaryUseCase: 'mixed',
      subscriptions: [
        { tool: 'ChatGPT', plan: 'Team', seats: 1, monthlySpend: 30 } // Wait, Team is min 2 seats $60, but if they put $30, we calculate based on their input
      ]
    };
    const result = calculateAudit(context);
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].recommendedPlan).toBe('Plus');
    expect(result.recommendations[0].savingsAmount).toBe(10);
  });

  it('recommends Cursor Pro as an alternative to GitHub Copilot Enterprise', () => {
    const context: AuditContext = {
      teamSize: 10,
      primaryUseCase: 'coding',
      subscriptions: [
        { tool: 'GitHub Copilot', plan: 'Enterprise', seats: 10, monthlySpend: 390 }
      ]
    };
    const result = calculateAudit(context);
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].recommendedPlan).toBe('Cursor Pro (Alternative)');
    expect(result.recommendations[0].savingsAmount).toBe(190);
  });

  it('recommends Anthropic API direct over Claude Pro for writing tasks', () => {
    const context: AuditContext = {
      teamSize: 5,
      primaryUseCase: 'writing',
      subscriptions: [
        { tool: 'Claude', plan: 'Pro', seats: 5, monthlySpend: 100 }
      ]
    };
    const result = calculateAudit(context);
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].recommendedPlan).toBe('API Direct');
    expect(result.recommendations[0].savingsAmount).toBe(75);
  });

  it('does not recommend changes for optimal spend', () => {
    const context: AuditContext = {
      teamSize: 1,
      primaryUseCase: 'coding',
      subscriptions: [
        { tool: 'Cursor', plan: 'Pro', seats: 1, monthlySpend: 20 }
      ]
    };
    const result = calculateAudit(context);
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].recommendedPlan).toBeNull();
    expect(result.recommendations[0].savingsAmount).toBe(0);
  });
});
