import { NextResponse } from 'next/server';
import { INITIAL_LEADS, LeadRecord } from '@/lib/data/mock-db';

export async function GET() {
  const pipeline = {
    NEW: INITIAL_LEADS.filter((l) => l.status === 'NEW'),
    RESEARCHING: INITIAL_LEADS.filter((l) => l.status === 'RESEARCHING'),
    CONTACTED: INITIAL_LEADS.filter((l) => l.status === 'CONTACTED'),
    EMAIL_SENT: INITIAL_LEADS.filter((l) => l.status === 'EMAIL_SENT'),
    MEETING_SCHEDULED: INITIAL_LEADS.filter((l) => l.status === 'MEETING_SCHEDULED'),
    PROPOSAL_SENT: INITIAL_LEADS.filter((l) => l.status === 'PROPOSAL_SENT'),
    NEGOTIATION: INITIAL_LEADS.filter((l) => l.status === 'NEGOTIATION'),
    WON: INITIAL_LEADS.filter((l) => l.status === 'WON'),
    LOST: INITIAL_LEADS.filter((l) => l.status === 'LOST'),
  };

  return NextResponse.json({ success: true, pipeline });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { leadId, targetStage } = body;

  const lead = INITIAL_LEADS.find((l) => l.id === leadId);
  if (!lead) {
    return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
  }

  lead.status = targetStage as LeadRecord['status'];
  return NextResponse.json({ success: true, lead });
}
