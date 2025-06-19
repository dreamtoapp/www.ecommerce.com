# Next.js 15 Migration Rules

## 🚨 BREAKING CHANGES - MUST FOLLOW

### 1. Async `params` and `searchParams` (CRITICAL)

**ALL** `params` and `searchParams` are now **Promise objects** in Next.js 15.

#### ✅ CORRECT - Server Components
```typescript
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;              // ✅ AWAIT FIRST
  const { query } = await searchParams;     // ✅ AWAIT FIRST
}
```

#### ✅ CORRECT - Route Handlers
```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // ✅ AWAIT FIRST
}
```

#### ❌ INCORRECT - Will Break
```typescript
// ❌ OLD WAY - WILL ERROR
params: { id: string }           // Should be Promise<{ id: string }>
const id = params.id;            // Should be: const { id } = await params;
```

### 2. Fetch Caching - No Longer Default

```typescript
// ✅ Explicit caching
const data = await fetch('...', { cache: 'force-cache' });

// ✅ No caching (new default)
const data = await fetch('...', { cache: 'no-store' });
```

### 3. Route Handlers - No Default Caching

```typescript
// ✅ Opt into caching
export const dynamic = 'force-static';
export async function GET() { /* cached */ }
```

## 📋 MIGRATION CHECKLIST

- [ ] Update ALL page params to `Promise<{ ... }>`
- [ ] Add `await` before accessing params
- [ ] Update ALL searchParams to `Promise<{ ... }>`
- [ ] Add `await` before accessing searchParams
- [ ] Review fetch calls for caching needs
- [ ] Test all dynamic routes

## 🛠️ REQUIRED PATTERNS

### Dynamic Routes
```typescript
// app/products/[id]/page.tsx
interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;  // MUST AWAIT
  // ... rest of component
}
```

### Search Pages
```typescript
// app/search/page.tsx
interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { q, page } = await searchParams;  // MUST AWAIT
  // ... rest of component
}
```

## ⚠️ COMMON ERRORS TO AVOID

1. `params.id` instead of `await params` then `id`
2. Old interfaces: `params: { id: string }`
3. Forgetting `await` in server components
4. Using `await` in client components (use `use()` hook)

## 🎯 WORKSPACE ENFORCEMENT

**EVERY** dynamic route MUST follow these patterns:
- ✅ `params: Promise<{ ... }>`
- ✅ `const { ... } = await params;`
- ✅ Proper TypeScript interfaces
- ✅ Error handling for missing params

## 🚨 Breaking Changes - Critical Requirements

### 1. Async `params` and `searchParams` (BREAKING CHANGE)

In Next.js 15, `params` and `searchParams` are now **Promise objects** and MUST be awaited before use.

#### ✅ Correct Implementation

**Server Components (Pages/Layouts):**
```typescript
// ✅ Async Page with params
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { query } = await searchParams;
  
  // Use id and query...
}

// ✅ Async Layout with params
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params;
  
  // Use slug...
}
```

**Route Handlers:**
```typescript
// ✅ API Route with async params
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Use id...
}
```

**Client Components:**
```typescript
'use client';
import { use } from 'react';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function Page({ params, searchParams }: PageProps) {
  const { slug } = use(params);
  const { query } = use(searchParams);
  
  // Use slug and query...
}
```

#### ❌ Incorrect (Will Cause Errors)
```typescript
// ❌ Don't access params directly without await
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id; // ERROR: params should be awaited
}

// ❌ Don't use old synchronous typing
interface PageProps {
  params: { id: string }; // Should be Promise<{ id: string }>
}
```

### 2. Fetch Caching Changes

`fetch` requests are **no longer cached by default**.

#### ✅ Explicit Caching
```typescript
// ✅ Opt into caching
const data = await fetch('https://api.example.com/data', {
  cache: 'force-cache'
});

// ✅ Opt out of caching (default behavior)
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
});

// ✅ Use segment config for all fetch in layout/page
export const fetchCache = 'default-cache';
```

### 3. Route Handlers Caching

`GET` methods in Route Handlers are **no longer cached by default**.

#### ✅ Opt into caching
```typescript
// app/api/route.ts
export const dynamic = 'force-static';

export async function GET() {
  // This will be cached
}
```

### 4. Client Router Cache Changes

Page segments are no longer reused from client-side router cache by default.

#### ✅ Opt into caching with staleTimes
```typescript
// next.config.js
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,    // 30 seconds for dynamic pages
      static: 180,    // 3 minutes for static pages
    },
  },
};
```

## 📋 Migration Checklist

### Before Upgrading
- [ ] Review all pages with dynamic routes (`[id]`, `[slug]`, etc.)
- [ ] Check all API routes using `params`
- [ ] Identify pages using `searchParams`
- [ ] Audit `fetch` calls that rely on default caching
- [ ] Review Route Handlers that expect caching

### During Migration
- [ ] Update all `params` and `searchParams` to be Promise types
- [ ] Add `await` before accessing `params` and `searchParams`