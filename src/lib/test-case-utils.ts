export interface TestCaseSummary {
  total: number;
  publicCount: number;
  hiddenCount: number;
  hasTestCases: boolean;
  displayText: string;
}

export function getTestCaseSummary(assignment: {
  publicTestInfo?: string | null;
  hiddenTestSpec?: any;
}): TestCaseSummary {
  let hiddenCount = 0;
  if (assignment.hiddenTestSpec) {
    try {
      const parsed =
        typeof assignment.hiddenTestSpec === 'string'
          ? JSON.parse(assignment.hiddenTestSpec)
          : assignment.hiddenTestSpec;

      if (Array.isArray(parsed?.testCases)) {
        hiddenCount = parsed.testCases.length;
      }
    } catch {
      hiddenCount = 0;
    }
  }

  let publicCount = 0;
  if (assignment.publicTestInfo) {
    const match = assignment.publicTestInfo.match(/(\d+)\s*(?:public\s*)?tests?/i);
    if (match) {
      publicCount = parseInt(match[1], 10);
    }
  }

  const total = publicCount + hiddenCount;

  return {
    total,
    publicCount,
    hiddenCount,
    hasTestCases: total > 0,
    displayText:
      total > 0
        ? `${total} Tests (${publicCount} Public + ${hiddenCount} Hidden)`
        : '0 (Unspecified / 0 tests provided)',
  };
}
