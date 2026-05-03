'use server';

import { calculateAudit, AuditContext, AuditResult } from '@/lib/audit-engine';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';
const supabase = createClient(supabaseUrl, supabaseKey);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

export async function createAuditAction(context: AuditContext) {
  // 1. Calculate Audit
  const result = calculateAudit(context);

  // 2. Generate AI Summary
  let aiSummary = '';
  try {
    const recommendationsList = result.recommendations
      .map(r => `- ${r.tool}: Spend $${r.currentSpend}/mo -> Recommend ${r.recommendedPlan || 'optimal'} (Save $${r.savingsAmount}/mo)`)
      .join('\n');

    const prompt = `Analyze the following AI spend audit for a team of ${context.teamSize} whose primary use case is ${context.primaryUseCase}. 
They currently spend $${result.totalCurrentSpend}/mo on AI tools. 
Based on our rule engine, they can save $${result.totalSavings}/mo.

Here are the specific recommendations:
${recommendationsList}

Write a personalized 100-word summary addressing the founder. Highlight the most significant savings opportunity. If they are over-spending on seats/plans, gently point it out. If they are already optimal, praise their efficiency. Do NOT invent new recommendations; stick strictly to the data provided.

Output only the summary text, without any introductory or concluding remarks.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      system: 'You are an expert AI software procurement consultant for startup founders and engineering managers. Your tone is professional, direct, insightful, and slightly encouraging.',
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    aiSummary = (message.content[0] as any).text;
  } catch (error) {
    console.error('Failed to generate AI summary', error);
    aiSummary = 'We analyzed your AI tool stack based on industry best practices. Review the specific recommendations below to optimize your monthly spend.';
  }

  // 3. Generate Slug
  const slug = Math.random().toString(36).substring(2, 10);

  // 4. Save to Supabase
  const { data: audit, error: auditError } = await supabase.from('audits').insert({
    slug,
    team_size: context.teamSize,
    primary_use_case: context.primaryUseCase,
    total_current_spend: result.totalCurrentSpend,
    total_savings: result.totalSavings,
    ai_summary: aiSummary,
  }).select().single();

  if (auditError) {
    console.error('Supabase error:', auditError);
    // If supabase fails, we can still just return a slug or fail
    // throw new Error('Failed to create audit record');
    // For local testing without supabase, we could bypass this.
  }

  if (audit) {
    const toolsToInsert = result.recommendations.map(r => ({
      audit_id: audit.id,
      tool_name: r.tool,
      current_spend: r.currentSpend,
      recommended_plan: r.recommendedPlan,
      recommended_spend: r.recommendedSpend,
      savings_amount: r.savingsAmount,
      reason: r.reason,
    }));

    if (toolsToInsert.length > 0) {
      await supabase.from('audit_tools').insert(toolsToInsert);
    }
  }

  // Return full result so we can test without DB dependencies easily if needed,
  // but normally we just fetch from DB on the next page. We'll return slug and the raw result for fallback.
  return { slug, result, aiSummary };
}

export async function captureLeadAction(slug: string, leadData: { email: string; companyName?: string; role?: string }, honeypot?: string) {
  if (honeypot) {
    return { success: true };
  }

  if (!leadData.email || !leadData.email.includes('@')) {
    throw new Error('Invalid email');
  }

  // Insert Lead
  const { data: lead, error: leadError } = await supabase.from('leads').insert({
    email: leadData.email,
    company_name: leadData.companyName,
    role: leadData.role,
  }).select().single();

  let leadId = lead?.id;
  if (leadError) {
    if (leadError.code === '23505') {
      const { data: existingLead } = await supabase.from('leads').select('id').eq('email', leadData.email).single();
      leadId = existingLead?.id;
    } else {
      console.error(leadError);
    }
  }

  // Update Audit
  if (leadId) {
    await supabase.from('audits').update({ lead_id: leadId }).eq('slug', slug);
  }

  // Send Email
  try {
    await resend.emails.send({
      from: 'Credex Audits <onboarding@resend.dev>', // Use resend test domain
      to: leadData.email,
      subject: 'Your AI Spend Audit Results',
      html: `<p>Thanks for using the Credex AI Spend Audit.</p><p>You can view your results anytime at: <a href="https://credex.rocks/audit/${slug}">https://credex.rocks/audit/${slug}</a></p><p>Best,<br/>The Credex Team</p>`
    });
  } catch (error) {
    console.error('Failed to send email', error);
  }

  revalidatePath(`/audit/${slug}`);
  return { success: true };
}
