import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const INITIAL_REPOSITORIES = [
  {
    name: 'paulchrisycj-debugging-practice-b16',
    owner: 'paulchrisycj',
    repoName: 'Debugging-Practice-B16',
    originalUrl: 'https://github.com/paulchrisycj/Debugging-Practice-B16',
    defaultBranch: 'main',
    language: 'JavaScript / TypeScript',
    framework: 'React + Express (Node.js)',
    category: 'Full-Stack',
    difficulty: 'INTERMEDIATE',
    sourceType: 'EXERCISE_COLLECTION',
    license: 'NO_LICENSE',
    isCommercialAllowed: false,
    importStatus: 'INSPECTED',
    evaluationReadiness: 'MEDIUM',
    testAvailability: 'PUBLIC_ONLY',
    description:
      'Collection of 4 standalone full-stack debugging exercises (broken-fetch, form-state, cart-sync, auth-flow) for React and Express.',
    inspectionReport: {
      exercises: [
        'ex01-broken-fetch: CORS / fetch url syntax error and unhandled promise rejection in React',
        'ex02-form-state: State synchronization and controlled input bugs in React form submission',
        'ex03-cart-sync: In-memory shopping cart item duplication and race condition',
        'ex04-auth-flow: JWT bearer token header parsing and session token loss'
      ],
      runtimes: { node: '>=18.0.0' },
      installCommand: 'npm install',
      buildCommand: 'npm run build',
      testCommand: 'npm test',
      isCompleteApp: false,
      commercialRisk: 'No license specified by author. Must be adapted or rewritten before commercial usage.',
      recommendation: 'Extract ex03-cart-sync or ex04-auth-flow as standalone single-repo challenges with automated Jest assertions.'
    }
  },

  {
    name: 'rjgcabrera-intentionally-buggy-code',
    owner: 'rjgcabrera',
    repoName: 'intentionally-buggy-code',
    originalUrl: 'https://github.com/rjgcabrera/intentionally-buggy-code',
    defaultBranch: 'master',
    language: 'JavaScript',
    framework: 'React + Express',
    category: 'Full-Stack',
    difficulty: 'BEGINNER',
    sourceType: 'EXERCISE_COLLECTION',
    license: 'MIT',
    isCommercialAllowed: true,
    importStatus: 'READY_FOR_TESTING',
    evaluationReadiness: 'HIGH',
    testAvailability: 'PUBLIC_ONLY',
    description:
      'Community open-source debugging project with a buggy Express server (status codes, JSON middleware) and a buggy React frontend (component lifecycle, state mutation).',
    inspectionReport: {
      components: [
        'buggy-express-app: Express server with faulty route handlers, invalid status code returns, missing body-parser',
        'buggy-react-app: React application with unmounted state updates, missing keys in lists, broken event handlers'
      ],
      runtimes: { node: '>=18.0.0' },
      installCommand: 'npm install',
      buildCommand: 'npm run build',
      testCommand: 'npm test',
      isCompleteApp: true,
      commercialRisk: 'None. Clean MIT license allows commercial use, modification, and redistribution.',
      recommendation: 'Ideal candidate for entry-level full-stack debugging assessment. Wrap with Supertest + Jest.'
    }
  },

  {
    name: 'ujjawalpoudel-news-articles-viewer',
    owner: 'ujjawalpoudel',
    repoName: 'technical-assessment-ujjawal-poudel',
    originalUrl: 'https://github.com/ujjawalpoudel/technical-assessment-ujjawal-poudel',
    defaultBranch: 'main',
    language: 'Python & JavaScript',
    framework: 'FastAPI + React (Vite)',
    category: 'Full-Stack',
    difficulty: 'INTERMEDIATE',
    sourceType: 'COMPLETE_APP',
    license: 'NO_LICENSE',
    isCommercialAllowed: false,
    importStatus: 'INSPECTED',
    evaluationReadiness: 'HIGH',
    testAvailability: 'COMPREHENSIVE',
    description:
      'Complete production-like News Articles Viewer full-stack app featuring a Python FastAPI backend with Pytest test cases and a React 18 + Vite frontend with React Testing Library.',
    inspectionReport: {
      backend: 'FastAPI, Pydantic, pytest.ini, tests/test_articles.py (CRUD, pagination, search)',
      frontend: 'React 18, Vite, TailwindCSS, React Testing Library',
      runtimes: { python: '>=3.10', node: '>=18.0.0' },
      installCommand: 'pip install -r backend/requirements.txt && cd frontend && npm install',
      testCommand: 'pytest backend/tests && cd frontend && npm test',
      isCompleteApp: true,
      commercialRisk: 'No license file (take-home assessment format). Needs permission or architectural adaptation.',
      recommendation: 'Exceptional full-stack structure with existing Pytest and RTL suites. Ready for hidden test expansion.'
    }
  },

  {
    name: 'sohumsen96-superrdev-patch-exercise',
    owner: 'sohumsen96',
    repoName: 'superrdev-patch-exercise',
    originalUrl: 'https://github.com/sohumsen96/superrdev-patch-exercise',
    defaultBranch: 'main',
    language: 'Java & TypeScript',
    framework: 'React 18 + Spring Boot 3.2 (H2 Database)',
    category: 'Full-Stack',
    difficulty: 'ADVANCED',
    sourceType: 'COMPLETE_APP',
    license: 'NO_LICENSE',
    isCommercialAllowed: false,
    importStatus: 'NEEDS_CONFIGURATION',
    evaluationReadiness: 'HIGH',
    testAvailability: 'COMPREHENSIVE',
    description:
      'SuperrDev full-stack task tracker app with Spring Boot 3.2, H2 database, and React 18 frontend. Features intentional bugs across SQL queries, backend JPA transactions, and UI reactivity.',
    inspectionReport: {
      backend: 'Spring Boot 3.2, Java 17/21, Spring Data JPA, H2 In-Memory DB, JUnit 5',
      frontend: 'React 18, TypeScript, Vite, TailwindCSS',
      runtimes: { java: '>=17', node: '>=18.0.0' },
      installCommand: './backend/mvnw clean compile && cd frontend && npm install',
      testCommand: './backend/mvnw test',
      isCompleteApp: true,
      commercialRisk: 'No license file present. Original candidate exercise format.',
      recommendation: 'High-value senior assessment candidate. Requires Java 17+ runner container.'
    }
  },

  {
    name: 'angular-debug-quest',
    owner: 'angular-courses-lab',
    repoName: 'angular-debug-quest',
    originalUrl: 'https://github.com/angular-courses-lab/angular-debug-quest',
    defaultBranch: 'main',
    language: 'TypeScript',
    framework: 'Angular 18+',
    category: 'Frontend',
    difficulty: 'INTERMEDIATE',
    sourceType: 'COMPLETE_APP',
    license: 'MIT',
    isCommercialAllowed: true,
    importStatus: 'READY_FOR_TESTING',
    evaluationReadiness: 'HIGH',
    testAvailability: 'COMPREHENSIVE',
    description:
      'Curated debugging quests for modern Angular applications covering RxJS memory leaks, signals reactivity, dependency injection, and routing lifecycle defects.',
    inspectionReport: {
      frameworkFeatures: 'Angular Signals, RxJS pipeable operators, OnPush change detection bugs',
      runtimes: { node: '>=18.19.0' },
      installCommand: 'npm install',
      buildCommand: 'npm run build',
      testCommand: 'npm test -- --watch=false --browsers=ChromeHeadless',
      isCompleteApp: true,
      commercialRisk: 'Clean MIT License. Fully permissive for commercial learning and assessments.',
      recommendation: 'Prime candidate for modern Angular assessment. Ready out-of-the-box.'
    }
  },

  {
    name: 'dsc-sist-d-bug',
    owner: 'DSC-SIST',
    repoName: 'D-Bug',
    originalUrl: 'https://github.com/DSC-SIST/D-Bug',
    defaultBranch: 'main',
    language: 'Multi-Language (C, C++, Java, Python, Go, Kotlin)',
    framework: 'Standard Libraries / Core Runtimes',
    category: 'Algorithm & Logic',
    difficulty: 'BEGINNER',
    sourceType: 'EXERCISE_COLLECTION',
    license: 'MIT',
    isCommercialAllowed: true,
    importStatus: 'READY_FOR_TESTING',
    evaluationReadiness: 'MEDIUM',
    testAvailability: 'PUBLIC_ONLY',
    description:
      'Large community collection of algorithmic and data structure debugging questions across 6 programming languages (pointers, arrays, recursion, string manipulation).',
    inspectionReport: {
      structure: 'Organized by language folders: /C/Question_*, /Python/Question_*, /Go/Question_*',
      runtimes: { python: '>=3.8', gcc: '>=11.0', go: '>=1.18', java: '>=11' },
      isCompleteApp: false,
      commercialRisk: 'MIT License. Clear attribution required.',
      recommendation: 'Can be broken down into quick 15-minute language screening challenges.'
    }
  },

  {
    name: 'amigoscode-java-bug-hunt',
    owner: 'amigoscode',
    repoName: 'java-bug-hunt',
    originalUrl: 'https://github.com/amigoscode/java-bug-hunt',
    defaultBranch: 'main',
    language: 'Java',
    framework: 'Java SE & JUnit 5 (Maven)',
    category: 'Backend',
    difficulty: 'INTERMEDIATE',
    sourceType: 'EXERCISE_COLLECTION',
    license: 'NO_LICENSE',
    isCommercialAllowed: false,
    importStatus: 'INSPECTED',
    evaluationReadiness: 'HIGH',
    testAvailability: 'COMPREHENSIVE',
    description:
      '150 standalone intentionally buggy Java exercises graded by difficulty (easy, medium, hard) with paired JUnit test suites asserting correct outputs.',
    inspectionReport: {
      structure: 'src/main/java/com/amigoscode/bughunt/[easy|medium|hard]/bugNN with matching JUnit test cases',
      runtimes: { java: '>=17', maven: '>=3.8' },
      installCommand: 'mvn clean compile',
      testCommand: 'mvn test -Dtest=Bug*Test',
      isCompleteApp: false,
      commercialRisk: 'No license specified. Free on GitHub but commercial rights unspecified.',
      recommendation: 'High-quality unit tests. Select individual bugs (e.g. string pool equality, concurrency) to convert into isolated RepoHamster challenges.'
    }
  },

  {
    name: 'maruthi-sreeram-p-java-debugging-playground',
    owner: 'maruthi-sreeram-p',
    repoName: 'java-debugging-playground',
    originalUrl: 'https://github.com/maruthi-sreeram-p/java-debugging-playground',
    defaultBranch: 'main',
    language: 'Java',
    framework: 'Spring Boot 3 + MockMvc',
    category: 'Backend',
    difficulty: 'ADVANCED',
    sourceType: 'EXERCISE_COLLECTION',
    license: 'NO_LICENSE',
    isCommercialAllowed: false,
    importStatus: 'NEEDS_CONFIGURATION',
    evaluationReadiness: 'HIGH',
    testAvailability: 'COMPREHENSIVE',
    description:
      'Twenty standalone Spring Boot projects for backend debugging (REST API validation, security context leaks, circular dependencies, JPA n+1 queries, async executor exhaustion).',
    inspectionReport: {
      labs: [
        '01-rest-api-debugging: Student registry controller validation and exception handling',
        '02-security-context-leak: ThreadLocal security context clearing in async request filters',
        '03-jpa-lazy-initialization: N+1 query and transaction boundary bug'
      ],
      runtimes: { java: '>=17', maven: '>=3.8' },
      installCommand: 'mvn clean compile',
      testCommand: 'mvn test',
      isCompleteApp: true,
      commercialRisk: 'No license file. Educational repository.',
      recommendation: 'Outstanding realistic enterprise Spring Boot scenarios. Each numbered lab is a self-contained assessment ready for RepoHamster.'
    }
  },

  {
    name: 'rajjitlai-code-debugging',
    owner: 'rajjitlai',
    repoName: 'code-debugging',
    originalUrl: 'https://github.com/rajjitlai/code-debugging',
    defaultBranch: 'master',
    language: 'Python, JavaScript, C, C++, Java',
    framework: 'Core Standard Runtimes',
    category: 'Algorithm & Syntax',
    difficulty: 'BEGINNER',
    sourceType: 'SNIPPET_COLLECTION',
    license: 'NO_LICENSE',
    isCommercialAllowed: false,
    importStatus: 'NOT_COMPATIBLE',
    evaluationReadiness: 'LOW',
    testAvailability: 'NO_TESTS',
    description:
      'Collection of single-file programming puzzles with intentional syntax errors and logic flaws across C++, C, Java, Python, and JavaScript without automated test harnesses.',
    inspectionReport: {
      structure: 'C++/q1.cpp, Python/q1.py, etc.',
      testHarness: 'None. Contains target output screenshots (.png) without automated tests.',
      isCompleteApp: false,
      commercialRisk: 'No license, lacks automated test runners.',
      recommendation: 'Not compatible for automated candidate evaluation without writing dedicated test suites from scratch.'
    }
  },

  {
    name: 'echrls-stackquest-labs',
    owner: 'eChrls',
    repoName: 'StackQuest-Labs',
    originalUrl: 'https://github.com/eChrls/StackQuest-Labs',
    defaultBranch: 'main',
    language: 'TypeScript, Python, Go, Docker',
    framework: 'Dockerized Microservices & Labs',
    category: 'Full-Stack / DevOps',
    difficulty: 'ADVANCED',
    sourceType: 'BENCHMARK',
    license: 'MIT',
    isCommercialAllowed: true,
    importStatus: 'READY_FOR_TESTING',
    evaluationReadiness: 'HIGH',
    testAvailability: 'COMPREHENSIVE',
    description:
      'Docker-first technical debugging labs designed to inspect, debug, test, and explain unfamiliar architectures across microservices, databases, and message brokers.',
    inspectionReport: {
      features: 'Docker compose orchestration, automated verification scripts, multi-service network debugging',
      runtimes: { docker: '>=24.0', node: '>=18.0.0', python: '>=3.10' },
      isCompleteApp: true,
      commercialRisk: 'MIT License. Fully open-source and commercial friendly.',
      recommendation: 'Superb source for advanced multi-container debugging assignments.'
    }
  }
];

export async function seedCatalogue() {
  console.log('📦 Seeding RepoHamster Repository Catalogue with 10 Initial Public Repositories...');

  for (const repo of INITIAL_REPOSITORIES) {
    const reportStr = typeof repo.inspectionReport === 'string'
      ? repo.inspectionReport
      : JSON.stringify(repo.inspectionReport);

    await prisma.catalogRepository.upsert({
      where: { originalUrl: repo.originalUrl },
      update: {
        name: repo.name,
        owner: repo.owner,
        repoName: repo.repoName,
        defaultBranch: repo.defaultBranch,
        language: repo.language,
        framework: repo.framework,
        category: repo.category,
        difficulty: repo.difficulty,
        description: repo.description,
        license: repo.license,
        isCommercialAllowed: repo.isCommercialAllowed,
        sourceType: repo.sourceType,
        importStatus: repo.importStatus,
        evaluationReadiness: repo.evaluationReadiness,
        testAvailability: repo.testAvailability,
        inspectionReport: reportStr,
        lastInspectedAt: new Date(),
      },
      create: {
        name: repo.name,
        originalUrl: repo.originalUrl,
        owner: repo.owner,
        repoName: repo.repoName,
        defaultBranch: repo.defaultBranch,
        language: repo.language,
        framework: repo.framework,
        category: repo.category,
        difficulty: repo.difficulty,
        description: repo.description,
        license: repo.license,
        isCommercialAllowed: repo.isCommercialAllowed,
        sourceType: repo.sourceType,
        importStatus: repo.importStatus,
        evaluationReadiness: repo.evaluationReadiness,
        testAvailability: repo.testAvailability,
        inspectionReport: reportStr,
        lastInspectedAt: new Date(),
      },
    });
  }

  const count = await prisma.catalogRepository.count();
  console.log(`✅ Successfully seeded ${count} repositories into CatalogRepository.`);
}

if (process.argv[1]?.endsWith('inspect-repositories.mjs')) {
  seedCatalogue()
    .catch((err) => {
      console.error('❌ Failed seeding catalogue:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
