import prisma from '@/lib/db';
import { Settings, Shield, Sparkles, Webhook, Cpu, Sliders } from 'lucide-react';
import { SettingsEditorForm } from '@/components/admin/SettingsEditorForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settingsRows = await prisma.adminSettings.findMany({
    orderBy: { key: 'asc' },
  });

  const settingsMap: Record<string, { value: string; description: string }> = {};
  for (const s of settingsRows) {
    settingsMap[s.key] = { value: s.value, description: s.description };
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-white">System, AI & Runner Governance</h2>
        <p className="text-xs text-slate-400">
          Configure platform-wide limits, AI token allocations, passing thresholds, and webhook parameters.
        </p>
      </div>

      <SettingsEditorForm initialSettings={settingsMap} />
    </div>
  );
}
