'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { captureLeadAction } from '@/app/actions';
import { Loader2, CheckCircle2, TrendingDown, Sparkles } from 'lucide-react';

interface ResultsDisplayProps {
  slug: string;
  auditData: {
    result: {
      totalCurrentSpend: number;
      totalSavings: number;
      recommendations: any[];
    };
    aiSummary: string;
  };
}

export function ResultsDisplay({ slug, auditData }: ResultsDisplayProps) {
  const { result, aiSummary } = auditData;
  const { totalSavings, totalCurrentSpend, recommendations } = result;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const isHighSpend = totalSavings >= 500;
  const isOptimal = totalSavings === 0;

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await captureLeadAction(slug, { email }, honeypot);
      setSubmitted(true);
    } catch (error) {
      alert('Failed to submit email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HERO SECTION */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          {isOptimal ? 'Perfectly Optimized.' : 'You are overpaying.'}
        </h1>
        {totalSavings > 0 ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-2xl md:text-3xl font-medium text-muted-foreground">Estimated Monthly Savings</span>
            <div className="text-6xl md:text-8xl font-black text-emerald-500 flex items-center">
              <TrendingDown className="w-12 h-12 md:w-20 md:h-20 mr-4" />
              ${totalSavings}
            </div>
            <p className="text-xl text-muted-foreground mt-2">That's ${totalSavings * 12} a year you could be saving.</p>
          </div>
        ) : (
          <div className="text-2xl text-emerald-500 font-semibold flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 mr-2" />
            Your AI stack is lean and efficient.
          </div>
        )}
      </div>

      {/* AI SUMMARY CARD */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-indigo-900">
            <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-indigo-950/80 leading-relaxed text-lg">{aiSummary}</p>
        </CardContent>
      </Card>

      {/* PER-TOOL BREAKDOWN */}
      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((rec, i) => (
          <Card key={i} className={rec.savingsAmount > 0 ? 'border-orange-200 bg-orange-50/30' : 'border-emerald-200 bg-emerald-50/30'}>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center text-lg">
                {rec.tool}
                <span className="text-sm font-normal text-muted-foreground">Currently: ${rec.currentSpend}/mo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {rec.savingsAmount > 0 ? (
                <>
                  <p className="font-semibold text-orange-700">Recommend: {rec.recommendedPlan} (${rec.recommendedSpend}/mo)</p>
                  <p className="text-muted-foreground">{rec.reason}</p>
                  <p className="text-emerald-600 font-bold mt-2">Save ${rec.savingsAmount}/mo</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-emerald-700">Optimal Plan Used</p>
                  <p className="text-muted-foreground">{rec.reason}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* LEAD CAPTURE / CTA */}
      <Card className="mt-12 bg-slate-900 text-slate-50 border-none shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isHighSpend ? 'Need help optimizing your Enterprise stack?' : 'Get future optimization alerts'}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {isHighSpend 
              ? 'Credex helps scaling startups negotiate AI tool contracts and consolidate API spend. Book a free consultation.' 
              : 'AI pricing changes fast. We will notify you if a cheaper alternative drops for your stack.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="bg-emerald-500/20 text-emerald-300 p-4 rounded-lg flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {isHighSpend ? "We'll be in touch shortly to schedule your consultation!" : "You're on the list! We sent a copy of this audit to your email."}
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="hidden">
                <input type="text" name="honeypot" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>
              <div className="flex-1">
                <Input 
                  type="email" 
                  placeholder="founder@startup.com" 
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400 h-12 text-lg"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="h-12 bg-indigo-500 hover:bg-indigo-600 text-white" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                {isHighSpend ? 'Book Consultation' : 'Email Me My Report'}
              </Button>
            </form>
          )}
        </CardContent>
        {isHighSpend && (
          <CardFooter>
            <p className="text-xs text-slate-400">By submitting, you agree to receive a copy of this audit and a follow-up email from our team.</p>
          </CardFooter>
        )}
      </Card>
      
    </div>
  );
}
