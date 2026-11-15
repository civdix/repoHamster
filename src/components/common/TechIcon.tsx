'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Code2 } from 'lucide-react';

export const TECH_ICON_MAP: Record<string, string> = {
  // Languages
  JavaScript: '/javascript.png',
  Javascript: '/javascript.png',
  JS: '/javascript.png',
  TypeScript: 'https://cdn.simpleicons.org/typescript',
  Typescript: 'https://cdn.simpleicons.org/typescript',
  TS: 'https://cdn.simpleicons.org/typescript',
  Python: 'https://cdn.simpleicons.org/python',
  Java: 'https://cdn.simpleicons.org/openjdk',
  Go: 'https://cdn.simpleicons.org/go',
  Golang: 'https://cdn.simpleicons.org/go',
  Rust: 'https://cdn.simpleicons.org/rust',
  'C++': 'https://cdn.simpleicons.org/cplusplus',
  Cpp: 'https://cdn.simpleicons.org/cplusplus',
  C: 'https://cdn.simpleicons.org/c',
  HTML5: '/html5_logo.png',
  HTML: '/html5_logo.png',
  CSS3: '/css3_logo.png',
  CSS: '/css3_logo.png',
  SQL: 'https://cdn.simpleicons.org/postgresql',
  PostgreSQL: 'https://cdn.simpleicons.org/postgresql',
  Postgres: 'https://cdn.simpleicons.org/postgresql',
  MySQL: '/mysql_logo.png',
  MongoDB: '/mongodb_logo.png',
  Redis: '/redis_logo.png',
  Elasticsearch: '/elasticsearch_logo.png',

  // Frameworks & Runtimes
  React: 'https://cdn.simpleicons.org/react',
  'React.js': 'https://cdn.simpleicons.org/react',
  'React.Js': 'https://cdn.simpleicons.org/react',
  'React Native': 'https://cdn.simpleicons.org/react',
  'Next.js': 'https://cdn.simpleicons.org/nextdotjs',
  'Next.Js': 'https://cdn.simpleicons.org/nextdotjs',
  NextJs: 'https://cdn.simpleicons.org/nextdotjs',
  'Node.js': 'https://cdn.simpleicons.org/nodedotjs',
  Nodejs: 'https://cdn.simpleicons.org/nodedotjs',
  Node: 'https://cdn.simpleicons.org/nodedotjs',
  Express: 'https://cdn.simpleicons.org/express',
  'Express.js': 'https://cdn.simpleicons.org/express',
  ExpressJS: 'https://cdn.simpleicons.org/express',
  FastAPI: 'https://cdn.simpleicons.org/fastapi',
  'Fast API': 'https://cdn.simpleicons.org/fastapi',
  Django: '/drf_logo.png',
  'Django REST Framework': '/drf_logo.png',
  DRF: '/drf_logo.png',
  Redux: '/redux_logo.png',
  RTK: '/redux_logo.png',
  'Tailwind CSS': 'https://cdn.simpleicons.org/tailwindcss',
  Tailwind: 'https://cdn.simpleicons.org/tailwindcss',
  'Vue.js': 'https://cdn.simpleicons.org/vuedotjs',
  Vue: 'https://cdn.simpleicons.org/vuedotjs',
  VueFlow: '/vue_flow.png',
  'D3.js': '/d3_logo.png',
  Celery: '/celery_logo.png',
  'REST APIs': '/restapi_logo.png',
  'Socket.IO': '/socketio_logo.png',
  'WebRTC / Agora': '/agora_logo.png',
  Agora: '/agora_logo.png',
  'JWT & Bcrypt': '/jwt_logo.png',
  JWT: '/jwt_logo.png',
  Docker: 'https://cdn.simpleicons.org/docker',
  Kubernetes: 'https://cdn.simpleicons.org/kubernetes',
  'AWS EKS': 'https://cdn.simpleicons.org/kubernetes',
  Linux: '/linux_logo.png',
  'Unix/Linux': '/linux_logo.png',
  OpenCV: '/opencv_logo.png',
  Pydantic: 'https://cdn.simpleicons.org/pydantic',
  Temporal: 'https://cdn.simpleicons.org/temporal',
  MinIO: 'https://cdn.simpleicons.org/minio',
  Cloudflare: 'https://cdn.simpleicons.org/cloudflare',
  CloudFlare: 'https://cdn.simpleicons.org/cloudflare',
  CDN: 'https://cdn.simpleicons.org/cloudflare',
  AWS: '/aws_logo.png',
  CloudFront: '/cloudfront_logo.png',
  'CDN Caching (CloudFront)': '/cloudfront_logo.png',
  N8N: '/n8n_logo.png',
  'N8N Automation': '/n8n_logo.png',
  n8n: '/n8n_logo.png',
  OpenAI: 'https://cdn.simpleicons.org/openai',
  'OpenAI GPT APIs': 'https://cdn.simpleicons.org/openai',
  'AI Agents': 'https://cdn.simpleicons.org/openai',
  Git: 'https://cdn.simpleicons.org/git',
  GitHub: 'https://cdn.simpleicons.org/github',
  GeeksforGeeks: '/gfg_logo.png',
};

export function getTechIconUrl(techName?: string | null): string | null {
  if (!techName) return null;
  const trimmed = techName.trim();
  if (TECH_ICON_MAP[trimmed]) return TECH_ICON_MAP[trimmed];

  // Case-insensitive fallback
  const lower = trimmed.toLowerCase();
  for (const [key, url] of Object.entries(TECH_ICON_MAP)) {
    if (key.toLowerCase() === lower) return url;
  }

  // Common language / framework fallbacks via simpleicons
  if (['flask', 'spring', 'springboot', 'angular', 'svelte', 'electron', 'graphql', 'prisma'].includes(lower)) {
    return `https://cdn.simpleicons.org/${lower}`;
  }

  return null;
}

interface TechIconProps {
  name: string;
  size?: number;
  className?: string;
  showFallbackText?: boolean;
}

export function TechIcon({ name, size = 16, className = '', showFallbackText = false }: TechIconProps) {
  const [error, setError] = useState(false);
  const iconUrl = getTechIconUrl(name);

  if (!iconUrl || error) {
    return (
      <span className={`inline-flex items-center justify-center rounded bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] text-[var(--yellow-bright)] shrink-0 ${className}`} style={{ width: size, height: size }}>
        <Code2 style={{ width: Math.max(10, size - 4), height: Math.max(10, size - 4) }} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Image
        src={iconUrl}
        alt={name}
        width={size}
        height={size}
        unoptimized={iconUrl.endsWith('.svg') || iconUrl.includes('simpleicons.org')}
        className="object-contain"
        style={{ width: `${size}px`, height: `${size}px` }}
        onError={() => setError(true)}
      />
    </span>
  );
}
