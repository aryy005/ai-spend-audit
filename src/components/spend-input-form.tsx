'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PrimaryUseCase, AIsubscription } from '@/lib/audit-engine';
import { createAuditAction } from '@/app/actions';
import { Trash2, Plus, ArrowRight, Loader2 } from 'lucide-react';

const AVAILABLE_TOOLS = [
  'Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 'Anthropic API', 'OpenAI API', 'Gemini', 'Windsurf'
];

export function SpendInputForm() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [teamSize, setTeamSize] = useState<number>(1);
  const [primaryUseCase, setPrimaryUseCase] = useState<PrimaryUseCase>('coding');
  const [subscriptions, setSubscriptions] = useState<AIsubscription[]>([
    { tool: 'ChatGPT', plan: 'Plus', seats: 1, monthlySpend: 20 }
  ]);

  useEffect(() => {
    setIsMounted(true);
    const savedData = localStorage.getItem('credex-audit-input');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setTeamSize(parsed.teamSize || 1);
        setPrimaryUseCase(parsed.primaryUseCase || 'coding');
        setSubscriptions(parsed.subscriptions || []);
      } catch (e) {
        console.error('Failed to parse local storage', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('credex-audit-input', JSON.stringify({ teamSize, primaryUseCase, subscriptions }));
    }
  }, [teamSize, primaryUseCase, subscriptions, isMounted]);

  const addSubscription = () => {
    setSubscriptions([...subscriptions, { tool: '', plan: '', seats: 1, monthlySpend: 0 }]);
  };

  const removeSubscription = (index: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== index));
  };

  const updateSub = (index: number, field: keyof AIsubscription, value: any) => {
    const newSubs = [...subscriptions];
    newSubs[index] = { ...newSubs[index], [field]: value };
    setSubscriptions(newSubs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { slug, result, aiSummary } = await createAuditAction({
        teamSize,
        primaryUseCase,
        subscriptions
      });
      // Store result locally just in case DB is down so the next page can read it from local state
      sessionStorage.setItem(`audit-${slug}`, JSON.stringify({ result, aiSummary, teamSize, primaryUseCase }));
      router.push(`/audit/${slug}`);
    } catch (error) {
      console.error(error);
      alert('Failed to generate audit. Please try again.');
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-t-4 border-t-primary bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Your AI Stack</CardTitle>
        <CardDescription>Enter your current tools to find out if you are overpaying.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Input 
                id="teamSize" 
                type="number" 
                min={1} 
                value={teamSize} 
                onChange={e => setTeamSize(parseInt(e.target.value) || 1)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryUseCase">Primary Use Case</Label>
              <Select value={primaryUseCase} onValueChange={(v: PrimaryUseCase | null) => v && setPrimaryUseCase(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coding">Coding / Engineering</SelectItem>
                  <SelectItem value="writing">Content / Writing</SelectItem>
                  <SelectItem value="data">Data Analysis</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="mixed">Mixed / General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Subscriptions</h3>
              <Button type="button" variant="outline" size="sm" onClick={addSubscription}>
                <Plus className="w-4 h-4 mr-2" /> Add Tool
              </Button>
            </div>

            {subscriptions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No tools added yet. Click 'Add Tool' to start.</p>
            )}

            {subscriptions.map((sub, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end bg-slate-50/50 p-3 rounded-lg border">
                <div className="col-span-12 sm:col-span-4 space-y-1">
                  <Label className="text-xs">Tool</Label>
                  <Select value={sub.tool} onValueChange={(v) => v && updateSub(index, 'tool', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tool" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_TOOLS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-12 sm:col-span-3 space-y-1">
                  <Label className="text-xs">Plan (e.g. Pro)</Label>
                  <Input value={sub.plan} onChange={e => updateSub(index, 'plan', e.target.value)} required />
                </div>
                <div className="col-span-6 sm:col-span-2 space-y-1">
                  <Label className="text-xs">Seats</Label>
                  <Input type="number" min={1} value={sub.seats} onChange={e => updateSub(index, 'seats', parseInt(e.target.value) || 1)} required />
                </div>
                <div className="col-span-6 sm:col-span-2 space-y-1">
                  <Label className="text-xs">Total $/mo</Label>
                  <Input type="number" min={0} value={sub.monthlySpend} onChange={e => updateSub(index, 'monthlySpend', parseInt(e.target.value) || 0)} required />
                </div>
                <div className="col-span-12 sm:col-span-1 flex justify-center sm:justify-end pb-1">
                  <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeSubscription(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full text-lg h-12" disabled={loading || subscriptions.length === 0}>
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ArrowRight className="w-5 h-5 mr-2" />}
            Generate Free Audit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
