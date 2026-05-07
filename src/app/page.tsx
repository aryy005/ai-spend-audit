import { SpendInputForm } from '@/components/spend-input-form';
import { Sparkles, ArrowDownToLine, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      <main className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800">
            <Sparkles className="w-4 h-4 mr-2" />
            Mint for AI Tool Spend
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            Stop Overpaying for <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              AI Tools.
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find out if you're wasting money on the wrong tiers or overlapping capabilities. Get a free, instant audit of your startup's AI stack.
          </p>
        </div>

        {/* FEATURE HIGHLIGHTS */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">
          <div className="space-y-3">
            <div className="mx-auto bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center text-indigo-600">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Instant Analysis</h3>
            <p className="text-slate-600 text-sm">Our engine checks for seat waste, cheaper tiers, and better alternatives in seconds.</p>
          </div>
          <div className="space-y-3">
            <div className="mx-auto bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center text-purple-600">
              <ArrowDownToLine className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Actionable Savings</h3>
            <p className="text-slate-600 text-sm">Get a customized report showing exactly how to optimize your stack and save money today.</p>
          </div>
          <div className="space-y-3">
            <div className="mx-auto bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center text-emerald-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">AI-Powered Insights</h3>
            <p className="text-slate-600 text-sm">Receive a personalized summary highlighting your most significant optimization opportunities.</p>
          </div>
        </div>

        {/* FORM SECTION */}
        <div id="audit-form" className="scroll-mt-12">
          <SpendInputForm />
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t py-8 mt-16 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Credex. The AI Spend Audit Tool.</p>
        </div>
      </footer>
    </div>
  );
}
