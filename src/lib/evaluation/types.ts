export interface EvaluationJob {
  candidateId: string;
  assignmentId: string;
  commitSha: string;
  commitMessage?: string;
  prNumber?: number;
  prUrl?: string;
  repoFullName?: string;
  branchName?: string;
  forceReevaluate?: boolean;
}

export interface ParsedTestItem {
  name: string;
  suite: 'PUBLIC' | 'HIDDEN';
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  executionTimeMs: number;
  errorMessage?: string;
  isHidden: boolean;
}

export interface RunnerResult {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  scorePercent: number;
  isPassed: boolean;
  logs: string;
  executionTimeMs: number;
  testResults: ParsedTestItem[];
}
