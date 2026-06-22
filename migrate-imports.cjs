const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'legacy');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('react-router-dom')) return;

  // Add 'use client' at the top if not already present
  if (!content.includes("'use client'")) {
    content = "'use client';\n\n" + content;
  }

  // Replace various react-router-dom import patterns
  const replacements = [
    {
      from: "import { useNavigate, useSearchParams } from 'react-router-dom';",
      to: "import { useRouter, useSearchParams } from 'next/navigation';\nfunction useNavigate() { const r = useRouter(); return (p) => r.push(p); }"
    },
    {
      from: "import { useParams, useNavigate } from 'react-router-dom';",
      to: "import { useRouter, useParams } from 'next/navigation';\nfunction useNavigate() { const r = useRouter(); return (p) => r.push(p); }"
    },
    {
      from: "import { useNavigate, Link, useSearchParams } from 'react-router-dom';",
      to: "import { useRouter, useSearchParams } from 'next/navigation';\nimport Link from 'next/link';\nfunction useNavigate() { const r = useRouter(); return (p) => r.push(p); }"
    },
    {
      from: "import { useNavigate, useLocation } from 'react-router-dom';",
      to: "import { useRouter, usePathname } from 'next/navigation';\nfunction useNavigate() { const r = useRouter(); return (p) => r.push(p); }\nfunction useLocation() { return { pathname: usePathname(), state: null }; }"
    },
    {
      from: "import { useNavigate } from 'react-router-dom';",
      to: "import { useRouter } from 'next/navigation';\nfunction useNavigate() { const r = useRouter(); return (p) => r.push(p); }"
    },
  ];

  for (const r of replacements) {
    content = content.replace(r.from, r.to);
  }

  // Fix useSearchParams usage: RR returns [params], Next returns params directly
  // In React Router: const [searchParams] = useSearchParams()
  // In Next.js: const searchParams = useSearchParams()
  content = content.replace(/const \[searchParams\] = useSearchParams\(\)/g, 'const searchParams = useSearchParams()');

  // Fix useParams usage: in Next.js it's a function call too, but returns a promise in app router
  // For client components with dynamic import (ssr: false), useParams() works synchronously

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated:', path.relative(process.cwd(), filePath));
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx')) {
      processFile(filePath);
    }
  }
}

walkDir(pagesDir);
console.log('Migration complete!');
