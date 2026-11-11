/**
 * Language Utilities for RepoHamster
 * Provides hierarchical language classification (Parent Language -> Sub-Repo Types like Python-Django, Python-Flask),
 * detection, distinct color styling, and test runner defaults.
 */

export interface SubRepoType {
  id: string; // e.g. "Python-Django"
  name: string; // "Django"
  parentLanguage: string; // "Python"
  framework: string; // "Django"
  defaultTestCommand: string;
}

export interface ParentLanguageMeta {
  name: string; // "Python"
  slug: string;
  color: string;
  border: string;
  bg: string;
  dot: string;
  defaultFramework: string;
  defaultTestCommand: string;
  subTypes: SubRepoType[];
}

export const COMMON_LANGUAGES: ParentLanguageMeta[] = [
  {
    name: 'Python',
    slug: 'python',
    color: 'text-emerald-400',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-950/40',
    dot: 'bg-emerald-400',
    defaultFramework: 'FastAPI / Django',
    defaultTestCommand: 'pytest',
    subTypes: [
      {
        id: 'Python-Django',
        name: 'Django',
        parentLanguage: 'Python',
        framework: 'Django',
        defaultTestCommand: 'python manage.py test',
      },
      {
        id: 'Python-Flask',
        name: 'Flask',
        parentLanguage: 'Python',
        framework: 'Flask',
        defaultTestCommand: 'pytest',
      },
      {
        id: 'Python-FastAPI',
        name: 'FastAPI',
        parentLanguage: 'Python',
        framework: 'FastAPI',
        defaultTestCommand: 'pytest',
      },
      {
        id: 'Python-Pytest',
        name: 'Pytest (Core)',
        parentLanguage: 'Python',
        framework: 'Pytest',
        defaultTestCommand: 'pytest',
      },
    ],
  },
  {
    name: 'TypeScript',
    slug: 'typescript',
    color: 'text-sky-400',
    border: 'border-sky-500/40',
    bg: 'bg-sky-950/40',
    dot: 'bg-sky-400',
    defaultFramework: 'Next.js',
    defaultTestCommand: 'npm test',
    subTypes: [
      {
        id: 'TypeScript-Next.js',
        name: 'Next.js',
        parentLanguage: 'TypeScript',
        framework: 'Next.js',
        defaultTestCommand: 'npm test',
      },
      {
        id: 'TypeScript-Angular',
        name: 'Angular',
        parentLanguage: 'TypeScript',
        framework: 'Angular',
        defaultTestCommand: 'npx vitest run',
      },
      {
        id: 'TypeScript-React',
        name: 'React',
        parentLanguage: 'TypeScript',
        framework: 'React',
        defaultTestCommand: 'npm test',
      },
      {
        id: 'TypeScript-Express',
        name: 'Express / Node',
        parentLanguage: 'TypeScript',
        framework: 'Express',
        defaultTestCommand: 'npm test',
      },
      {
        id: 'TypeScript-NestJS',
        name: 'NestJS',
        parentLanguage: 'TypeScript',
        framework: 'NestJS',
        defaultTestCommand: 'npm test',
      },
    ],
  },
  {
    name: 'JavaScript',
    slug: 'javascript',
    color: 'text-amber-300',
    border: 'border-amber-500/40',
    bg: 'bg-amber-950/40',
    dot: 'bg-amber-400',
    defaultFramework: 'React / Node.js',
    defaultTestCommand: 'npm test',
    subTypes: [
      {
        id: 'JavaScript-React',
        name: 'React',
        parentLanguage: 'JavaScript',
        framework: 'React',
        defaultTestCommand: 'npm test',
      },
      {
        id: 'JavaScript-Node.js',
        name: 'Node.js',
        parentLanguage: 'JavaScript',
        framework: 'Node.js',
        defaultTestCommand: 'npm test',
      },
      {
        id: 'JavaScript-Express',
        name: 'Express',
        parentLanguage: 'JavaScript',
        framework: 'Express',
        defaultTestCommand: 'npm test',
      },
      {
        id: 'JavaScript-Vue',
        name: 'Vue.js',
        parentLanguage: 'JavaScript',
        framework: 'Vue',
        defaultTestCommand: 'npm test',
      },
    ],
  },
  {
    name: 'Java',
    slug: 'java',
    color: 'text-orange-400',
    border: 'border-orange-500/40',
    bg: 'bg-orange-950/40',
    dot: 'bg-orange-400',
    defaultFramework: 'Spring Boot',
    defaultTestCommand: 'mvn clean test',
    subTypes: [
      {
        id: 'Java-Spring Boot',
        name: 'Spring Boot',
        parentLanguage: 'Java',
        framework: 'Spring Boot',
        defaultTestCommand: 'mvn clean test -B',
      },
      {
        id: 'Java-Maven',
        name: 'Maven (Standard)',
        parentLanguage: 'Java',
        framework: 'Maven',
        defaultTestCommand: 'mvn test',
      },
      {
        id: 'Java-Gradle',
        name: 'Gradle',
        parentLanguage: 'Java',
        framework: 'Gradle',
        defaultTestCommand: './gradlew test',
      },
      {
        id: 'Java-JUnit',
        name: 'JUnit 5',
        parentLanguage: 'Java',
        framework: 'JUnit 5',
        defaultTestCommand: 'mvn test',
      },
    ],
  },
  {
    name: 'Go',
    slug: 'go',
    color: 'text-cyan-400',
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-950/40',
    dot: 'bg-cyan-400',
    defaultFramework: 'Standard Library / Gin',
    defaultTestCommand: 'go test ./...',
    subTypes: [
      {
        id: 'Go-Standard Library',
        name: 'Standard Library',
        parentLanguage: 'Go',
        framework: 'Standard Library',
        defaultTestCommand: 'go test ./...',
      },
      {
        id: 'Go-Gin',
        name: 'Gin Gonic',
        parentLanguage: 'Go',
        framework: 'Gin',
        defaultTestCommand: 'go test -v ./...',
      },
      {
        id: 'Go-Fiber',
        name: 'Fiber',
        parentLanguage: 'Go',
        framework: 'Fiber',
        defaultTestCommand: 'go test -v ./...',
      },
    ],
  },
  {
    name: 'C++',
    slug: 'cpp',
    color: 'text-blue-400',
    border: 'border-blue-500/40',
    bg: 'bg-blue-950/40',
    dot: 'bg-blue-400',
    defaultFramework: 'CMake / GCC',
    defaultTestCommand: 'ctest',
    subTypes: [
      {
        id: 'C++-CMake',
        name: 'CMake',
        parentLanguage: 'C++',
        framework: 'CMake',
        defaultTestCommand: 'ctest --output-on-failure',
      },
      {
        id: 'C++-Makefile',
        name: 'Makefile / GCC',
        parentLanguage: 'C++',
        framework: 'GCC',
        defaultTestCommand: 'make test',
      },
    ],
  },
  {
    name: 'Rust',
    slug: 'rust',
    color: 'text-rose-400',
    border: 'border-rose-500/40',
    bg: 'bg-rose-950/40',
    dot: 'bg-rose-400',
    defaultFramework: 'Cargo / Actix',
    defaultTestCommand: 'cargo test',
    subTypes: [
      {
        id: 'Rust-Cargo',
        name: 'Cargo (Standard)',
        parentLanguage: 'Rust',
        framework: 'Cargo',
        defaultTestCommand: 'cargo test',
      },
      {
        id: 'Rust-Actix',
        name: 'Actix Web',
        parentLanguage: 'Rust',
        framework: 'Actix Web',
        defaultTestCommand: 'cargo test',
      },
      {
        id: 'Rust-Axum',
        name: 'Axum',
        parentLanguage: 'Rust',
        framework: 'Axum',
        defaultTestCommand: 'cargo test',
      },
    ],
  },
  {
    name: 'Multi-Language',
    slug: 'multi-language',
    color: 'text-purple-300',
    border: 'border-purple-500/40',
    bg: 'bg-purple-950/40',
    dot: 'bg-purple-400',
    defaultFramework: 'Polyglot',
    defaultTestCommand: 'npm test',
    subTypes: [
      {
        id: 'Multi-Language-Polyglot',
        name: 'Polyglot (C/Java/Python/Go)',
        parentLanguage: 'Multi-Language',
        framework: 'Polyglot Harness',
        defaultTestCommand: 'npm test',
      },
    ],
  },
];

/**
 * Parses any language and framework string into hierarchical Parent & SubRepoType.
 * Handles inputs like:
 *   - "Python-Django" -> Parent: "Python", SubType: "Python-Django", SubName: "Django"
 *   - "Python-Flask" or "Python-Flash" -> Parent: "Python", SubType: "Python-Flask"
 *   - "Python" + framework "Django" -> Parent: "Python", SubType: "Python-Django"
 *   - "JavaScript & React" -> Parent: "JavaScript", SubType: "JavaScript-React"
 */
export function parseLanguageHierarchy(languageStr?: string, frameworkStr?: string): {
  parent: string;
  subType: string;
  subTypeName: string;
  framework: string;
  isCustom: boolean;
} {
  const raw = (languageStr || '').trim();
  const fRaw = (frameworkStr || '').trim();

  if (!raw && !fRaw) {
    return {
      parent: 'TypeScript',
      subType: 'TypeScript-Next.js',
      subTypeName: 'Next.js',
      framework: 'Next.js',
      isCustom: false,
    };
  }

  // 1. Direct hyphenated format (e.g. "Python-Django", "Python-Flask", "Python-Flash")
  if (raw.includes('-')) {
    const parts = raw.split('-');
    const potentialParent = parts[0].trim();
    const potentialSub = parts.slice(1).join('-').trim();

    // Check if potentialParent matches known language
    const matchedParent = COMMON_LANGUAGES.find(
      (l) => l.name.toLowerCase() === potentialParent.toLowerCase()
    );

    if (matchedParent) {
      return {
        parent: matchedParent.name,
        subType: `${matchedParent.name}-${potentialSub}`,
        subTypeName: potentialSub,
        framework: fRaw || potentialSub,
        isCustom: !matchedParent.subTypes.some(
          (st) => st.name.toLowerCase() === potentialSub.toLowerCase()
        ),
      };
    }
  }

  // 2. Identify parent language from string
  const lower = raw.toLowerCase();
  let matchedParent = COMMON_LANGUAGES.find((l) =>
    lower.includes(l.name.toLowerCase())
  );

  if (!matchedParent) {
    if (lower.includes('js') || lower.includes('node') || lower.includes('react')) {
      matchedParent = COMMON_LANGUAGES.find((l) => l.name === 'JavaScript');
    } else if (lower.includes('ts') || lower.includes('angular') || lower.includes('next')) {
      matchedParent = COMMON_LANGUAGES.find((l) => l.name === 'TypeScript');
    } else if (lower.includes('py') || lower.includes('django') || lower.includes('flask')) {
      matchedParent = COMMON_LANGUAGES.find((l) => l.name === 'Python');
    } else if (lower.includes('java') && !lower.includes('javascript')) {
      matchedParent = COMMON_LANGUAGES.find((l) => l.name === 'Java');
    } else if (lower.includes('go')) {
      matchedParent = COMMON_LANGUAGES.find((l) => l.name === 'Go');
    } else if (lower.includes('multi') || lower.includes('&') || lower.includes(',')) {
      matchedParent = COMMON_LANGUAGES.find((l) => l.name === 'Multi-Language');
    }
  }

  const parentName = matchedParent?.name || raw || 'TypeScript';

  // 3. Derive sub-type based on framework or secondary language cues
  const subCandidate = fRaw || (raw.includes('&') ? raw.split('&')[1].trim() : '') || (raw.includes('/') ? raw.split('/')[1].trim() : '');

  if (subCandidate && subCandidate.toLowerCase() !== parentName.toLowerCase()) {
    return {
      parent: parentName,
      subType: `${parentName}-${subCandidate}`,
      subTypeName: subCandidate,
      framework: fRaw || subCandidate,
      isCustom: true,
    };
  }

  // Default to first subType if available
  const defaultSub = matchedParent?.subTypes[0];
  return {
    parent: parentName,
    subType: defaultSub?.id || `${parentName}-Standard`,
    subTypeName: defaultSub?.name || 'Standard',
    framework: fRaw || matchedParent?.defaultFramework || 'Standard',
    isCustom: false,
  };
}

/**
 * Returns distinct styling classes for any given language string.
 */
export function getLanguageStyle(languageStr?: string) {
  if (!languageStr) {
    return {
      color: 'text-[var(--gh-text-secondary)]',
      border: 'border-[var(--gh-border)]',
      bg: 'bg-[var(--gh-bg-secondary)]',
      dot: 'bg-[var(--yellow-bright)]',
    };
  }

  const { parent } = parseLanguageHierarchy(languageStr);
  const matched = COMMON_LANGUAGES.find(
    (l) => l.name.toLowerCase() === parent.toLowerCase()
  );

  if (matched) {
    return {
      color: matched.color,
      border: matched.border,
      bg: matched.bg,
      dot: matched.dot,
    };
  }

  return {
    color: 'text-[var(--yellow-bright)]',
    border: 'border-[var(--amber-badge-border)]',
    bg: 'bg-[var(--amber-badge-bg)]',
    dot: 'bg-[var(--yellow-bright)]',
  };
}

/**
 * Returns list of sub-repo types under a parent language.
 */
export function getSubTypesForParent(parentName: string): SubRepoType[] {
  const parent = COMMON_LANGUAGES.find(
    (l) => l.name.toLowerCase() === parentName.toLowerCase()
  );
  return parent ? parent.subTypes : [];
}

/**
 * Intelligent Language Detector based on repository URL or repository name.
 * Detects both parent language and sub-repo type (e.g. Python-Django, Python-Flask, TypeScript-Angular).
 */
export function detectLanguageFromRepo(
  repoUrlOrName: string,
  catalogRepos: Array<{ name?: string; originalUrl?: string; repoName?: string; language?: string; framework?: string }> = []
): { language: string; subType: string; framework: string; source: 'catalog' | 'heuristic' | 'default'; defaultTestCommand: string } {
  if (!repoUrlOrName || !repoUrlOrName.trim()) {
    return {
      language: 'TypeScript',
      subType: 'TypeScript-Next.js',
      framework: 'Next.js',
      defaultTestCommand: 'npm test',
      source: 'default',
    };
  }

  const clean = repoUrlOrName.trim().toLowerCase();

  // 1. Direct match with catalog repositories
  const catalogMatch = catalogRepos.find((c) => {
    const urlMatch = c.originalUrl && clean.includes(c.originalUrl.toLowerCase());
    const nameMatch = c.name && clean.includes(c.name.toLowerCase());
    const repoNameMatch = c.repoName && clean.includes(c.repoName.toLowerCase());
    return urlMatch || nameMatch || repoNameMatch;
  });

  if (catalogMatch && catalogMatch.language) {
    const parsed = parseLanguageHierarchy(catalogMatch.language, catalogMatch.framework);
    return {
      language: parsed.subType, // e.g. "Python-Django"
      subType: parsed.subType,
      framework: parsed.framework,
      defaultTestCommand: parsed.parent === 'Python' ? 'pytest' : parsed.parent === 'Java' ? 'mvn clean test' : 'npm test',
      source: 'catalog',
    };
  }

  // 2. Specific Framework Heuristics -> Sub-Repo Types
  if (clean.includes('django')) {
    return {
      language: 'Python-Django',
      subType: 'Python-Django',
      framework: 'Django',
      defaultTestCommand: 'python manage.py test',
      source: 'heuristic',
    };
  }
  if (clean.includes('flask') || clean.includes('flash')) {
    return {
      language: 'Python-Flask',
      subType: 'Python-Flask',
      framework: 'Flask',
      defaultTestCommand: 'pytest',
      source: 'heuristic',
    };
  }
  if (clean.includes('fastapi')) {
    return {
      language: 'Python-FastAPI',
      subType: 'Python-FastAPI',
      framework: 'FastAPI',
      defaultTestCommand: 'pytest',
      source: 'heuristic',
    };
  }
  if (clean.includes('angular')) {
    return {
      language: 'TypeScript-Angular',
      subType: 'TypeScript-Angular',
      framework: 'Angular',
      defaultTestCommand: 'npx vitest run',
      source: 'heuristic',
    };
  }
  if (clean.includes('spring')) {
    return {
      language: 'Java-Spring Boot',
      subType: 'Java-Spring Boot',
      framework: 'Spring Boot',
      defaultTestCommand: 'mvn clean test',
      source: 'heuristic',
    };
  }
  if (clean.includes('python') || clean.includes('py')) {
    return {
      language: 'Python-Pytest',
      subType: 'Python-Pytest',
      framework: 'Pytest',
      defaultTestCommand: 'pytest',
      source: 'heuristic',
    };
  }
  if (clean.includes('java') && !clean.includes('javascript')) {
    return {
      language: 'Java-Spring Boot',
      subType: 'Java-Spring Boot',
      framework: 'Spring Boot',
      defaultTestCommand: 'mvn clean test',
      source: 'heuristic',
    };
  }
  if (clean.includes('golang') || clean.includes('go-')) {
    return {
      language: 'Go-Standard Library',
      subType: 'Go-Standard Library',
      framework: 'Standard Library',
      defaultTestCommand: 'go test ./...',
      source: 'heuristic',
    };
  }
  if (clean.includes('react') || clean.includes('next')) {
    return {
      language: 'TypeScript-Next.js',
      subType: 'TypeScript-Next.js',
      framework: 'Next.js',
      defaultTestCommand: 'npm test',
      source: 'heuristic',
    };
  }
  if (clean.includes('d-bug') || clean.includes('multi')) {
    return {
      language: 'Multi-Language',
      subType: 'Multi-Language-Polyglot',
      framework: 'Polyglot',
      defaultTestCommand: 'npm test',
      source: 'heuristic',
    };
  }

  return {
    language: 'TypeScript',
    subType: 'TypeScript-Next.js',
    framework: 'Next.js',
    defaultTestCommand: 'npm test',
    source: 'default',
  };
}
