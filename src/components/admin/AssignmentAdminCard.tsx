'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  FileCode2,
  Clock,
  Sparkles,
  Layers,
  Webhook,
  Shield,
  Wrench,
  RefreshCw,
  GitPullRequest,
} from 'lucide-react';
import { AssignmentEditorModal } from './AssignmentEditorModal';
import { getTestCaseSummary } from '@/lib/test-case-utils';
import { parseLanguageHierarchy } from '@/lib/language-utils';

interface AssignmentAdminCardProps {
  assignment: any;
  catalogRepositories?: any[];
}

export function AssignmentAdminCard({ assignment, catalogRepositories = [] }: AssignmentAdminCardProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Webhook State & Failure tracking
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string>(assignment.webhookStatus || 'PENDING');
  const [webhookError, setWebhookError] = useState<string | null>(assignment.webhookError || null);
  const [webhookMessage, setWebhookMessage] = useState<string | null>(null);

  // Guardrails State & Failure tracking
  const [isProvisioningGuardrails, setIsProvisioningGuardrails] = useState(false);
  const [guardrailsStatus, setGuardrailsStatus] = useState<string>(assignment.guardrailsStatus || 'PENDING');
  const [guardrailsError, setGuardrailsError] = useState<string | null>(assignment.guardrailsError || null);
  const [guardrailsMessage, setGuardrailsMessage] = useState<string | null>(null);

  // Assessment Workflow Checks State & Failure tracking
  const [isProvisioningWorkflow, setIsProvisioningWorkflow] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState<string>(assignment.workflowStatus || 'PENDING');
  const [workflowError, setWorkflowError] = useState<string | null>(assignment.workflowError || null);
  const [workflowMessage, setWorkflowMessage] = useState<string | null>(null);

  const hierarchy = parseLanguageHierarchy(assignment.language, assignment.framework);

  const handleAutoProvisionWorkflow = async () => {
    setIsProvisioningWorkflow(true);
    setWorkflowMessage(null);
    try {
      const res = await fetch('/api/admin/workflows/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: assignment.repoUrl,
          assignmentId: assignment.id,
          language: assignment.language,
          force: workflowStatus === 'ACTIVE',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkflowStatus('ACTIVE');
        setWorkflowError(null);
        setWorkflowMessage(data.message || (workflowStatus === 'ACTIVE' ? 'Assessment checks reinstalled successfully!' : 'Assessment checks installed successfully!'));
      } else {
        setWorkflowStatus('FAILED');
        setWorkflowError(data.message || 'Failed to install checks workflow.');
        setWorkflowMessage(data.message || 'Failed to install checks workflow.');
      }
      router.refresh();
    } catch (err: any) {
      setWorkflowStatus('FAILED');
      setWorkflowError(err?.message || 'Network error.');
      setWorkflowMessage(err?.message || 'Network error.');
    } finally {
      setIsProvisioningWorkflow(false);
    }
  };

  const handleAutoProvisionGuardrails = async () => {
    setIsProvisioningGuardrails(true);
    setGuardrailsMessage(null);
    try {
      const res = await fetch('/api/admin/guardrails/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: assignment.repoUrl, assignmentId: assignment.id }),
      });
      const data = await res.json();
      if (data.success) {
        setGuardrailsStatus('ACTIVE');
        setGuardrailsError(null);
        setGuardrailsMessage(data.message || 'AI Guardrails installed successfully!');
      } else {
        setGuardrailsStatus('FAILED');
        setGuardrailsError(data.message || 'Failed to install guardrails.');
        setGuardrailsMessage(data.message || 'Failed to install guardrails.');
      }
      router.refresh();
    } catch (err: any) {
      setGuardrailsStatus('FAILED');
      setGuardrailsError(err?.message || 'Network error.');
      setGuardrailsMessage(err?.message || 'Network error.');
    } finally {
      setIsProvisioningGuardrails(false);
    }
  };

  const handleAutoProvisionWebhook = async () => {
    setIsProvisioning(true);
    setWebhookMessage(null);
    try {
      const res = await fetch('/api/admin/webhooks/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: assignment.repoUrl, assignmentId: assignment.id }),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookStatus('ACTIVE');
        setWebhookError(null);
        setWebhookMessage(data.message || 'Webhook connected successfully!');
      } else {
        setWebhookStatus('FAILED');
        setWebhookError(data.message || 'Failed to connect webhook.');
        setWebhookMessage(data.message || 'Failed to connect webhook.');
      }
      router.refresh();
    } catch (err: any) {
      setWebhookStatus('FAILED');
      setWebhookError(err?.message || 'Network error.');
      setWebhookMessage(err?.message || 'Network error.');
    } finally {
      setIsProvisioning(false);
    }
  };

  const testSummary = getTestCaseSummary(assignment);
  const completedCount = (assignment.candidateAssignments || []).filter(
    (ca: any) => ca.status === 'COMPLETED'
  ).length;
  const totalAttempts = (assignment.candidateAssignments || []).length;

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/admin/assignments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: assignment.id,
          isActive: !assignment.isActive,
        }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/assignments?id=${assignment.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete assignment:', err);
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      className={`rounded-xl border p-5 space-y-4 transition ${
        assignment.isActive
          ? 'border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]'
          : 'border-[var(--gh-border)] bg-[var(--gh-bg)] opacity-75'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Distinct Parent Language & Sub-Repo Type Badge */}
            <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[11px] font-mono font-semibold text-[var(--amber-badge-text)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)]" />
              <span>{hierarchy.parent}</span>
              <span className="opacity-40">/</span>
              <span className="font-bold text-[var(--amber-badge-text)]">{hierarchy.subType}</span>
            </span>
            <span className="rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--amber-badge-text)] font-semibold">
              {assignment.difficulty}
            </span>

            {/* Visibility Status Badge */}
            {assignment.isActive ? (
              <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono font-medium text-[var(--yellow-bright)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] mr-1.5 animate-pulse" />
                ACTIVE (VISIBLE TO CANDIDATES)
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-0.5 text-[10px] font-mono font-medium text-[var(--gh-text-muted)]">
                <EyeOff className="h-3 w-3 mr-1" />
                HIDDEN (CANDIDATES CANNOT SEE)
              </span>
            )}

            {/* Webhook Status Badge */}
            {webhookStatus === 'ACTIVE' ? (
              <span
                className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400"
                title="GitHub webhook is connected and actively listening for Pull Requests"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>Webhook: Connected</span>
              </span>
            ) : webhookStatus === 'FAILED' ? (
              <span
                className="inline-flex items-center space-x-1.5 rounded-full border border-rose-500/70 bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-rose-400 animate-pulse shadow-sm"
                title={webhookError || 'Webhook connection failed. Click "Fix Hook" to retry.'}
              >
                <AlertCircle className="h-3 w-3 text-rose-500" />
                <span>Webhook: Disconnected / Failed</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center space-x-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-amber-400"
                title="Webhook pending verification"
              >
                <Clock className="h-3 w-3 text-amber-400" />
                <span>Webhook: Unchecked</span>
              </span>
            )}

            {/* AI Guardrails Status Badge */}
            {guardrailsStatus === 'ACTIVE' ? (
              <span
                className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400"
                title="AI Guardrails and Copilot Socratic rules are installed on the repository"
              >
                <Shield className="h-3 w-3 text-emerald-400" />
                <span>Guardrails: Active</span>
              </span>
            ) : guardrailsStatus === 'FAILED' ? (
              <span
                className="inline-flex items-center space-x-1.5 rounded-full border border-rose-500/70 bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-rose-400 animate-pulse shadow-sm"
                title={guardrailsError || 'Guardrail installation failed. Click "Fix Guardrails" to retry.'}
              >
                <AlertCircle className="h-3 w-3 text-rose-500" />
                <span>Guardrails: Failed / Missing</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center space-x-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-amber-400"
                title="Guardrails pending verification"
              >
                <Clock className="h-3 w-3 text-amber-400" />
                <span>Guardrails: Unchecked</span>
              </span>
            )}

            {/* Assessment PR Workflow Checks Status Badge */}
            {workflowStatus === 'ACTIVE' ? (
              <span
                className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400"
                title="Automated PR assessment test workflow (.github/workflows/test.yml) is active"
              >
                <GitPullRequest className="h-3 w-3 text-emerald-400" />
                <span>Checks: Active</span>
              </span>
            ) : workflowStatus === 'FAILED' ? (
              <span
                className="inline-flex items-center space-x-1.5 rounded-full border border-rose-500/70 bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-rose-400 animate-pulse shadow-sm"
                title={workflowError || 'Workflow checks failed to install. Click "Fix Checks" to retry.'}
              >
                <AlertCircle className="h-3 w-3 text-rose-500" />
                <span>Checks: Failed / Missing</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center space-x-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-amber-400"
                title="Assessment checks pending verification"
              >
                <Clock className="h-3 w-3 text-amber-400" />
                <span>Checks: Unchecked</span>
              </span>
            )}

            {webhookMessage && (
              <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--yellow-bright)] animate-in fade-in">
                {webhookMessage}
              </span>
            )}

            {guardrailsMessage && (
              <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--amber-badge-text)] animate-in fade-in">
                {guardrailsMessage}
              </span>
            )}

            {workflowMessage && (
              <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 animate-in fade-in">
                {workflowMessage}
              </span>
            )}
          </div>

          <h3 className="font-bold text-[var(--gh-text)] text-base flex items-center space-x-2">
            <span>{assignment.title}</span>
            <span className="text-xs font-mono font-normal text-[var(--gh-text-muted)]">
              ({assignment.slug})
            </span>
          </h3>
          <p className="text-xs text-[var(--gh-text-secondary)] max-w-3xl leading-relaxed">
            {assignment.description}
          </p>

          {/* Red Failure Warning Alert Box */}
          {(webhookStatus === 'FAILED' || guardrailsStatus === 'FAILED' || workflowStatus === 'FAILED') && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs font-mono text-rose-300 space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 text-rose-400 font-bold">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                <span>Action Needed: Repository Integration Incomplete</span>
              </div>
              {webhookStatus === 'FAILED' && (
                <div className="text-[11px] text-rose-300/90 pl-6 space-y-0.5">
                  <p>
                    <strong className="text-rose-400">Webhook Issue:</strong> {webhookError || 'GitHub webhook is disconnected on this repository.'}
                  </p>
                  <p className="text-[10px] text-rose-400/80">
                    &rarr; Click the red <strong className="text-white underline">Fix Hook</strong> button on the right to connect it.
                  </p>
                </div>
              )}
              {guardrailsStatus === 'FAILED' && (
                <div className="text-[11px] text-rose-300/90 pl-6 space-y-0.5">
                  <p>
                    <strong className="text-rose-400">Guardrails Issue:</strong> {guardrailsError || 'AI guardrails (.github/copilot-instructions.md) could not be verified.'}
                  </p>
                  <p className="text-[10px] text-rose-400/80">
                    &rarr; Click the red <strong className="text-white underline">Fix Guardrails</strong> button on the right to install them.
                  </p>
                </div>
              )}
              {workflowStatus === 'FAILED' && (
                <div className="text-[11px] text-rose-300/90 pl-6 space-y-0.5">
                  <p>
                    <strong className="text-rose-400">Checks Issue:</strong> {workflowError || 'Automated PR test workflow (.github/workflows/test.yml) could not be verified.'}
                  </p>
                  <p className="text-[10px] text-rose-400/80">
                    &rarr; Click the red <strong className="text-white underline">Fix Checks</strong> button on the right to install it.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Hide / Unhide Toggle Button */}
          <button
            onClick={handleToggleActive}
            disabled={isToggling}
            title={assignment.isActive ? 'Hide challenge from candidates' : 'Make challenge active'}
            className={`flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
              assignment.isActive
                ? 'border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] hover:border-[var(--yellow-primary)]'
                : 'border-[var(--yellow-primary)] bg-[var(--yellow-primary)] text-black font-bold'
            }`}
          >
            {isToggling ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : assignment.isActive ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span>Hide</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Unhide</span>
              </>
            )}
          </button>

          {/* Auto-Provision / Fix Webhook Button */}
          <button
            onClick={handleAutoProvisionWebhook}
            disabled={isProvisioning}
            className={`flex items-center space-x-1.5 rounded-xl border px-2.5 py-1.5 text-xs transition active:scale-95 ${
              webhookStatus === 'FAILED'
                ? 'border-rose-500/70 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 hover:border-rose-400 font-bold animate-pulse shadow-sm'
                : webhookStatus === 'ACTIVE'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/70 hover:bg-emerald-500/20'
                : 'border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-secondary)] hover:text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]/50'
            }`}
            title={
              webhookStatus === 'FAILED'
                ? `Webhook failed: ${webhookError || 'Click to retry auto-connecting'}`
                : webhookStatus === 'ACTIVE'
                ? 'Webhook is active on GitHub. Click to re-verify.'
                : 'Auto-create or verify GitHub repository webhook via API'
            }
          >
            {isProvisioning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-current" />
            ) : webhookStatus === 'FAILED' ? (
              <Wrench className="h-3.5 w-3.5 text-rose-400" />
            ) : webhookStatus === 'ACTIVE' ? (
              <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Webhook className="h-3.5 w-3.5 text-current" />
            )}
            <span>{webhookStatus === 'FAILED' ? 'Fix Hook' : webhookStatus === 'ACTIVE' ? 'Reinstall Hook' : 'Connect Hook'}</span>
          </button>

          {/* Install / Fix AI Guardrails Button */}
          <button
            onClick={handleAutoProvisionGuardrails}
            disabled={isProvisioningGuardrails}
            className={`flex items-center space-x-1.5 rounded-xl border px-2.5 py-1.5 text-xs transition active:scale-95 ${
              guardrailsStatus === 'FAILED'
                ? 'border-rose-500/70 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 hover:border-rose-400 font-bold animate-pulse shadow-sm'
                : guardrailsStatus === 'ACTIVE'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/70 hover:bg-emerald-500/20'
                : 'border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-secondary)] hover:text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]/50'
            }`}
            title={
              guardrailsStatus === 'FAILED'
                ? `Guardrails failed: ${guardrailsError || 'Click to retry installing'}`
                : guardrailsStatus === 'ACTIVE'
                ? 'Guardrails active. Click to reinstall/refresh in repository.'
                : 'Install Copilot Socratic rules and disable inline autocompletions in repository'
            }
          >
            {isProvisioningGuardrails ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-current" />
            ) : guardrailsStatus === 'FAILED' ? (
              <Wrench className="h-3.5 w-3.5 text-rose-400" />
            ) : guardrailsStatus === 'ACTIVE' ? (
              <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Shield className="h-3.5 w-3.5 text-current" />
            )}
            <span>{guardrailsStatus === 'FAILED' ? 'Fix Guardrails' : guardrailsStatus === 'ACTIVE' ? 'Reinstall Guardrails' : 'AI Guardrails'}</span>
          </button>

          {/* Install / Fix Assessment PR Checks Workflow Button */}
          <button
            onClick={handleAutoProvisionWorkflow}
            disabled={isProvisioningWorkflow}
            className={`flex items-center space-x-1.5 rounded-xl border px-2.5 py-1.5 text-xs transition active:scale-95 ${
              workflowStatus === 'FAILED'
                ? 'border-rose-500/70 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 hover:border-rose-400 font-bold animate-pulse shadow-sm'
                : workflowStatus === 'ACTIVE'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/70 hover:bg-emerald-500/20'
                : 'border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-secondary)] hover:text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]/50'
            }`}
            title={
              workflowStatus === 'FAILED'
                ? `Checks workflow failed: ${workflowError || 'Click to retry installing'}`
                : workflowStatus === 'ACTIVE'
                ? 'Automated PR check workflow is active on GitHub. Click to reinstall/refresh in repository.'
                : 'Auto-commit .github/workflows/test.yml into repository to run tests on candidate PRs'
            }
          >
            {isProvisioningWorkflow ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-current" />
            ) : workflowStatus === 'FAILED' ? (
              <Wrench className="h-3.5 w-3.5 text-rose-400" />
            ) : workflowStatus === 'ACTIVE' ? (
              <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <GitPullRequest className="h-3.5 w-3.5 text-current" />
            )}
            <span>
              {workflowStatus === 'FAILED'
                ? 'Fix Checks'
                : workflowStatus === 'ACTIVE'
                ? 'Reinstall Checks'
                : 'Install Checks'}
            </span>
          </button>

          {/* Edit Information Modal Button */}
          <AssignmentEditorModal assignment={assignment} catalogRepositories={catalogRepositories} />

          {/* GitHub Repo External Link */}
          <a
            href={assignment.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] transition active:scale-95"
            title="Open GitHub Repository"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {/* Delete Challenge Button */}
          {confirmDelete ? (
            <div className="flex items-center space-x-1 animate-in fade-in duration-150">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center space-x-1 rounded-xl bg-[var(--gh-border)] border border-[var(--gh-border-active)] px-2.5 py-1.5 text-xs font-bold text-[var(--gh-text)] hover:text-[var(--yellow-bright)] transition active:scale-95"
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span>Confirm Delete</span>}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2 py-1.5 text-xs text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:border-[var(--gh-border-active)] transition active:scale-95"
              title="Remove Challenge"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Specs & Configuration Grid - Including Total Testcases Block */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 text-xs font-mono">
        {/* Block 1: Total Test Cases Count Block */}
        <div className="sm:col-span-1 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-2.5">
          <span className="text-[var(--gh-text-muted)] block text-[10px] uppercase font-bold tracking-wider">
            Total Testcases Present
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span
              className={`text-sm font-bold ${
                testSummary.hasTestCases ? 'text-[var(--yellow-bright)] font-mono' : 'text-[var(--gh-text-muted)]'
              }`}
            >
              {testSummary.total}
            </span>
            <span className="text-[11px] text-[var(--gh-text-muted)] truncate">
              {testSummary.hasTestCases ? 'tests configured' : 'unspecified'}
            </span>
          </div>
          <p className="text-[10px] text-[var(--gh-text-muted)] mt-0.5 truncate" title={testSummary.displayText}>
            {testSummary.displayText}
          </p>
        </div>

        {/* Block 2: Repository Target */}
        <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[var(--gh-text-muted)] block text-[10px] uppercase font-bold tracking-wider">
              Repository Target
            </span>
            <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-[var(--yellow-bright)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)]" />
              <span>{hierarchy.subType}</span>
            </span>
          </div>
          <a
            href={assignment.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--yellow-bright)] hover:underline truncate block mt-1 font-semibold"
            title={assignment.repoUrl}
          >
            {assignment.repoUrl.replace('https://github.com/', '')}
          </a>
          <span className="text-[10px] text-[var(--gh-text-muted)] block mt-0.5">
            Branch: {assignment.baseBranch || 'main'}
          </span>
        </div>

        {/* Block 3: AI Quota */}
        <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-2.5">
          <span className="text-[var(--gh-text-muted)] block text-[10px] uppercase font-bold tracking-wider">
            AI Quota / Candidate
          </span>
          <div className="mt-1 text-[var(--yellow-bright)] font-semibold truncate">
            {assignment.aiRequestLimit === 0 ? (
              <span className="text-red-400 font-bold">0 req (Strict Non-AI Mode)</span>
            ) : (
              `${assignment.aiRequestLimit} req / ${assignment.aiTokenLimit?.toLocaleString() || 10000} tok`
            )}
          </div>
          <span className="text-[10px] text-[var(--gh-text-muted)] block mt-0.5">
            ~{assignment.estimatedTimeMinutes} min duration
          </span>
        </div>

        {/* Block 4: Passing Threshold */}
        <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-2.5">
          <span className="text-[var(--gh-text-muted)] block text-[10px] uppercase font-bold tracking-wider">
            Passing Threshold
          </span>
          <div className="mt-1 text-[var(--yellow-bright)] font-bold text-sm">
            {assignment.passingThresholdPercent}%
          </div>
          <span className="text-[10px] text-[var(--gh-text-muted)] block mt-0.5">
            CI Workflow Evaluation
          </span>
        </div>

        {/* Block 5: Completion Rate */}
        <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-2.5 col-span-2 sm:col-span-1">
          <span className="text-[var(--gh-text-muted)] block text-[10px] uppercase font-bold tracking-wider">
            Candidate Submissions
          </span>
          <div className="mt-1 text-[var(--gh-text)] font-semibold">
            {completedCount} / {totalAttempts} passed
          </div>
          <span className="text-[10px] text-[var(--gh-text-muted)] block mt-0.5">
            {totalAttempts > 0 ? Math.round((completedCount / totalAttempts) * 100) : 0}% success rate
          </span>
        </div>
      </div>
    </div>
  );
}
