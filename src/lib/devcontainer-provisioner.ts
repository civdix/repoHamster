import { parseLanguageHierarchy } from './language-utils';

export interface DevcontainerOptions {
  repoName?: string;
  language?: string;
  framework?: string;
  detectedFiles?: string[];
}

export interface LanguageStack {
  isPython: boolean;
  isNode: boolean;
  isJava: boolean;
  isGo: boolean;
  isCpp: boolean;
  isRust: boolean;
  isFullStack: boolean;
  primaryLanguage: string;
}

/**
 * Detects the runtime language stack and multi-tier composition of a challenge repository.
 */
export function detectLanguageStack(
  language?: string,
  framework?: string,
  detectedFiles: string[] = []
): LanguageStack {
  const l = (language || '').toLowerCase().trim();
  const f = (framework || '').toLowerCase().trim();

  const fileNames = detectedFiles.map((fn) => fn.toLowerCase());

  const hasPythonFile = fileNames.some(
    (fn) =>
      fn.endsWith('.py') ||
      fn.includes('requirements') ||
      fn.includes('pyproject.toml') ||
      fn.includes('pipfile') ||
      fn.includes('manage.py') ||
      fn.includes('setup.py')
  );

  const hasNodeFile = fileNames.some(
    (fn) =>
      fn.includes('package.json') ||
      fn.endsWith('.ts') ||
      fn.endsWith('.tsx') ||
      fn.endsWith('.js') ||
      fn.endsWith('.jsx')
  );

  const hasJavaFile = fileNames.some(
    (fn) => fn.includes('pom.xml') || fn.includes('build.gradle') || fn.endsWith('.java')
  );

  const hasGoFile = fileNames.some((fn) => fn.includes('go.mod') || fn.endsWith('.go'));

  const hasCppFile = fileNames.some(
    (fn) => fn.includes('cmakelists.txt') || fn.endsWith('.cpp') || fn.endsWith('.hpp') || fn.endsWith('.cc')
  );

  const hasRustFile = fileNames.some((fn) => fn.includes('cargo.toml') || fn.endsWith('.rs'));

  const isPython =
    l.includes('python') ||
    f.includes('fastapi') ||
    f.includes('django') ||
    f.includes('flask') ||
    f.includes('pytest') ||
    hasPythonFile;

  const isNode =
    l.includes('javascript') ||
    l.includes('typescript') ||
    l.includes('react') ||
    l.includes('node') ||
    l.includes('express') ||
    f.includes('react') ||
    f.includes('vue') ||
    f.includes('next') ||
    f.includes('express') ||
    f.includes('angular') ||
    f.includes('vitest') ||
    f.includes('jest') ||
    hasNodeFile;

  const isJava =
    (l.includes('java') && !l.includes('javascript')) ||
    f.includes('spring') ||
    f.includes('maven') ||
    f.includes('gradle') ||
    hasJavaFile;

  const isGo = l.includes('go') || f.includes('gin') || f.includes('fiber') || hasGoFile;
  const isCpp = l.includes('c++') || l.includes('cpp') || f.includes('cmake') || hasCppFile;
  const isRust = l.includes('rust') || f.includes('cargo') || hasRustFile;

  const isFullStack =
    (isPython && isNode) ||
    (isJava && isNode) ||
    l.includes('full-stack') ||
    l.includes('full stack') ||
    l.includes('&');

  let primaryLanguage = 'JavaScript';
  if (isPython) primaryLanguage = 'Python';
  else if (isJava) primaryLanguage = 'Java';
  else if (isGo) primaryLanguage = 'Go';
  else if (isRust) primaryLanguage = 'Rust';
  else if (isCpp) primaryLanguage = 'C++';
  else if (l.includes('typescript')) primaryLanguage = 'TypeScript';

  return {
    isPython,
    isNode,
    isJava,
    isGo,
    isCpp,
    isRust,
    isFullStack,
    primaryLanguage,
  };
}

/**
 * Builds the robust postCreateCommand script that auto-installs Python pip packages,
 * requirements.txt, and Node dependencies so the user gets a working space immediately on boot.
 */
export function generatePostCreateCommand(stack: LanguageStack): string {
  const parts: string[] = [
    'echo "🐹 [RepoHamster] Initializing language runtime and dependencies..."',
  ];

  if (stack.isPython) {
    parts.push(`if command -v python3 >/dev/null 2>&1 || command -v python >/dev/null 2>&1; then
  echo "🐍 [RepoHamster] Configuring Python & upgrading pip..."
  python3 -m pip install --upgrade pip --quiet 2>/dev/null || python -m pip install --upgrade pip --quiet 2>/dev/null || true
  
  if [ -f requirements.txt ]; then
    echo "📦 [RepoHamster] Installing Python packages from root requirements.txt..."
    pip install -r requirements.txt
  fi
  
  for req in backend/requirements.txt server/requirements.txt api/requirements.txt app/requirements.txt requirements-dev.txt; do
    if [ -f "$req" ]; then
      echo "📦 [RepoHamster] Installing Python packages from $req..."
      pip install -r "$req"
    fi
  done
  
  if [ -f pyproject.toml ] || [ -f setup.py ]; then
    echo "📦 [RepoHamster] Installing Python package from pyproject/setup.py..."
    pip install -e . 2>/dev/null || pip install . 2>/dev/null || true
  fi
  
  if [ -f Pipfile ]; then
    echo "📦 [RepoHamster] Installing dependencies via Pipenv..."
    pip install pipenv --quiet && pipenv install --system || true
  fi

  if [ -f poetry.lock ]; then
    echo "📦 [RepoHamster] Installing dependencies via Poetry..."
    pip install poetry --quiet && poetry config virtualenvs.create false 2>/dev/null && poetry install || true
  fi

  echo "🧪 [RepoHamster] Ensuring Pytest and testing harness are installed..."
  pip install pytest pytest-asyncio pytest-cov --quiet 2>/dev/null || true
fi`);
  }

  if (stack.isNode) {
    parts.push(`if command -v npm >/dev/null 2>&1; then
  if [ -f package.json ]; then
    echo "📦 [RepoHamster] Installing Node dependencies from package.json..."
    npm install || true
  fi
  if [ -f frontend/package.json ]; then
    echo "📦 [RepoHamster] Installing frontend dependencies from frontend/package.json..."
    (cd frontend && npm install) || true
  fi
  if [ -f client/package.json ]; then
    echo "📦 [RepoHamster] Installing client dependencies from client/package.json..."
    (cd client && npm install) || true
  fi
fi`);
  }

  if (stack.isGo) {
    parts.push(`if command -v go >/dev/null 2>&1 && [ -f go.mod ]; then
  echo "🐹 [RepoHamster] Downloading Go modules..."
  go mod download || true
fi`);
  }

  // Environment file synchronization
  parts.push(`for env_src in .env.example backend/.env.example frontend/.env.example server/.env.example client/.env.example; do
  env_dest="\${env_src%.example}"
  if [ -f "$env_src" ] && [ ! -f "$env_dest" ]; then
    echo "⚙️ [RepoHamster] Initializing $env_dest from $env_src..."
    cp "$env_src" "$env_dest"
  fi
done`);

  // Anti-cheat guardrails permission enforcement
  parts.push(
    '(sudo chown -R root:root .vscode 2>/dev/null || true) && (chmod 444 .vscode/settings.json .github/copilot-instructions.md .cursorrules .windsurfrules CLAUDE.md 2>/dev/null || true)'
  );

  parts.push('echo "🚀 [RepoHamster] Workspace is ready! Happy debugging."');

  // Wrap all commands in a single resilient subshell
  const singleLineScript = parts.join(' && \\\n');
  return `bash -c '${singleLineScript}'`;
}

/**
 * Builds VS Code settings enforcing assessment integrity while enabling
 * appropriate testing harnesses for the language stack.
 */
export function generateVscodeSettings(stack: LanguageStack): Record<string, any> {
  const settings: Record<string, any> = {
    'editor.inlineSuggest.enabled': false,
    'chat.agent.enabled': false,
    'chat.commandCenter.enabled': false,
    'github.copilot.enable': {
      '*': false,
      plaintext: false,
      markdown: false,
      javascript: false,
      typescript: false,
      python: false,
    },
    'github.copilot.inlineSuggest.enable': false,
    'github.copilot.editor.enableCodeActions': false,
    'github.copilot.chat.editor.enable': false,
    'github.copilot.chat.welcomeMessage': 'never',
    'github.copilot.advanced': {
      inlineSuggestCount: 0,
      authProvider: 'none',
    },
  };

  if (stack.isPython) {
    settings['python.testing.pytestEnabled'] = true;
    settings['python.testing.unittestEnabled'] = false;
    settings['python.testing.pytestArgs'] = ['.'];
    settings['python.defaultInterpreterPath'] = '/usr/local/bin/python';
    settings['python.terminal.activateEnvironment'] = true;
  }

  return settings;
}

/**
 * Returns the relevant VS Code extensions for the detected stack.
 */
export function generateDevcontainerExtensions(stack: LanguageStack): string[] {
  const extensions: string[] = [];

  if (stack.isPython) {
    extensions.push('ms-python.python', 'ms-python.vscode-pylance', 'ms-python.debugpy');
  }

  if (stack.isNode) {
    extensions.push('dbaeumer.vscode-eslint');
  }

  if (stack.isGo) {
    extensions.push('golang.go');
  }

  if (stack.isJava) {
    extensions.push('vscjava.vscode-java-pack');
  }

  return extensions;
}

/**
 * Generates an authoritative, production-grade devcontainer.json configuration
 * tailored to the repository's programming language and runtime stack.
 */
export function generateDevcontainerJson(options: DevcontainerOptions): string {
  const stack = detectLanguageStack(options.language, options.framework, options.detectedFiles);
  const repoName = options.repoName || 'RepoHamster Challenge';

  let image = 'mcr.microsoft.com/devcontainers/javascript-node:20';
  const features: Record<string, any> = {};
  const forwardPorts: number[] = [3000, 3001, 5173];

  if (stack.isPython) {
    image = 'mcr.microsoft.com/devcontainers/python:3.12';
    forwardPorts.push(8000, 5000, 8080);

    // If repo also requires Node (e.g. Django + React or FastAPI + Vite)
    if (stack.isNode || stack.isFullStack) {
      features['ghcr.io/devcontainers/features/node:1'] = {
        version: '20',
      };
    }
  } else if (stack.isJava) {
    image = 'mcr.microsoft.com/devcontainers/java:21';
    forwardPorts.push(8080);
    if (stack.isNode) {
      features['ghcr.io/devcontainers/features/node:1'] = {
        version: '20',
      };
    }
  } else if (stack.isGo) {
    image = 'mcr.microsoft.com/devcontainers/go:1.22';
    forwardPorts.push(8080);
  } else if (stack.isCpp) {
    image = 'mcr.microsoft.com/devcontainers/cpp:latest';
  } else if (stack.isRust) {
    image = 'mcr.microsoft.com/devcontainers/rust:latest';
  }

  const uniquePorts = Array.from(new Set(forwardPorts));
  const postCreateCommand = generatePostCreateCommand(stack);
  const vscodeSettings = generateVscodeSettings(stack);
  const extensions = generateDevcontainerExtensions(stack);

  const config: Record<string, any> = {
    name: `${repoName} (${stack.primaryLanguage} • RepoHamster)`,
    image,
    forwardPorts: uniquePorts,
    containerEnv: {
      PIP_BREAK_SYSTEM_PACKAGES: '1',
      PYTHONUNBUFFERED: '1',
      PYTHONDONTWRITEBYTECODE: '1',
    },
    postCreateCommand,
    customizations: {
      vscode: {
        settings: vscodeSettings,
        extensions,
      },
    },
  };

  if (Object.keys(features).length > 0) {
    config.features = features;
  }

  return JSON.stringify(config, null, 2);
}
