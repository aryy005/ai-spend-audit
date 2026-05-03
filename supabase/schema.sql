-- Supabase Database Schema

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  company_name TEXT,
  role TEXT,
  team_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  lead_id UUID REFERENCES leads(id),
  team_size INTEGER NOT NULL,
  primary_use_case TEXT NOT NULL,
  total_current_spend NUMERIC NOT NULL,
  total_savings NUMERIC NOT NULL,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  current_spend NUMERIC NOT NULL,
  recommended_plan TEXT,
  recommended_spend NUMERIC NOT NULL,
  savings_amount NUMERIC NOT NULL,
  reason TEXT NOT NULL
);
