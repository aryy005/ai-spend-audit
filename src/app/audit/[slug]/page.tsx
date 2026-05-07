import { createClient } from '@supabase/supabase-js';
import { ResultsContainer } from '@/components/results-container';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: 'Credex AI Spend Audit Results',
    description: 'View your personalized AI spend optimization plan.',
    openGraph: {
      title: 'Credex AI Spend Audit Results',
      description: 'Find out if you are overpaying for AI tools.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Credex AI Spend Audit Results',
      description: 'Find out if you are overpaying for AI tools.',
    }
  };
}

export default async function AuditResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Try to fetch from DB
  const { data: audit, error } = await supabase
    .from('audits')
    .select('*, audit_tools(*)')
    .eq('slug', resolvedParams.slug)
    .single();

  let auditData = null;

  if (audit) {
    auditData = {
      result: {
        totalCurrentSpend: audit.total_current_spend,
        totalSavings: audit.total_savings,
        recommendations: audit.audit_tools.map((t: any) => ({
          tool: t.tool_name,
          currentSpend: t.current_spend,
          recommendedPlan: t.recommended_plan,
          recommendedSpend: t.recommended_spend,
          savingsAmount: t.savings_amount,
          reason: t.reason,
        })),
      },
      aiSummary: audit.ai_summary || '',
    };
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <Link href="/" className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Audit
          </Link>
          <div className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Credex
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <ResultsContainer slug={resolvedParams.slug} initialData={auditData} />
      </main>
    </div>
  );
}
