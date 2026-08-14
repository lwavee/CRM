import { NextResponse } from 'next/server';
import { ConnectorManager } from '@/lib/connectors/manager';

const manager = new ConnectorManager();

export async function GET() {
  const connectors = manager.getConnectors();
  return NextResponse.json({ success: true, connectors });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, isEnabled } = body;
  manager.setEnabled(id, isEnabled);

  return NextResponse.json({ success: true, connectors: manager.getConnectors() });
}

export async function POST() {
  // Trigger manual sync
  const newLeads = await manager.runEnabledConnectors();
  return NextResponse.json({
    success: true,
    message: `Triggered sync across active connectors. Discovered ${newLeads.length} leads.`,
    discoveredLeads: newLeads,
  });
}
