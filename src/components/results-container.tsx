'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ResultsDisplay } from '@/components/results-display';

export function ResultsContainer({ slug, initialData }: { slug: string, initialData: any }) {
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (!initialData) {
      // Check session storage
      const cached = sessionStorage.getItem(`audit-${slug}`);
      if (cached) {
        setData(JSON.parse(cached));
      }
      setLoading(false);
    }
  }, [slug, initialData]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  if (!data) {
    return (
      <div className="text-center space-y-4 py-20">
        <h2 className="text-2xl font-bold">Audit Not Found</h2>
        <p className="text-slate-600">We couldn't find an audit with this ID.</p>
        <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
          Create New Audit
        </Link>
      </div>
    );
  }

  return <ResultsDisplay slug={slug} auditData={data} />;
}
