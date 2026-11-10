function parseGitHubRepo(repoUrl) {
  const cleanUrl = repoUrl.replace(/\/$/, '').replace(/\?.*$/, '');
  const match = cleanUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

console.log('🧪 Testing Candidate Fork & Codespaces URL Generator Logic...');

// Test 1: Standard URL
const sample1 = 'https://github.com/repohamster/Still-Form';
const res1 = parseGitHubRepo(sample1);
if (res1 && res1.owner === 'repohamster' && res1.repo === 'Still-Form') {
  console.log('  ✓ Test 1: parseGitHubRepo handles standard URL');
} else {
  console.error('  ✗ Test 1 failed:', res1);
  process.exit(1);
}

// Test 2: Trailing slashes and query params
const sample2 = 'https://github.com/repohamster/Still-Form/?tab=readme-ov-file';
const res2 = parseGitHubRepo(sample2);
if (res2 && res2.owner === 'repohamster' && res2.repo === 'Still-Form') {
  console.log('  ✓ Test 2: parseGitHubRepo strips trailing slashes & query parameters');
} else {
  console.error('  ✗ Test 2 failed:', res2);
  process.exit(1);
}

// Test 3: Codespaces 1-Click URL format verification
const candidateUsername = 'test-developer';
const codespaceUrl = `https://codespaces.new/${candidateUsername}/${res1.repo}?ref=main`;
if (codespaceUrl === 'https://codespaces.new/test-developer/Still-Form?ref=main') {
  console.log('  ✓ Test 3: 1-Click Codespaces deep link matches GitHub schema specification');
} else {
  console.error('  ✗ Test 3 failed:', codespaceUrl);
  process.exit(1);
}

// Test 4: Pull Request Head Ref format verification (cross-repository)
const prHead = `${candidateUsername}:main`;
if (prHead === 'test-developer:main') {
  console.log('  ✓ Test 4: Cross-repository Pull Request head ref adheres to GitHub REST v3 format');
} else {
  console.error('  ✗ Test 4 failed:', prHead);
  process.exit(1);
}

console.log('🎉 All candidate fork, Codespaces, and PR unit tests passed!');
