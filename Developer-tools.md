# 🛠️ Developer Utilities: PowerShell & TypeScript Commands

This document contains useful PowerShell and TypeScript commands to manage `.js`, `.jsx`, `.txt`, and `.md` files, along with build cleanups for TypeScript projects.

---

## 📁 Move All `.txt` Files to a Folder

Moves all `.txt` files from your project (recursively) into a root-level folder called `TXT-document`.

```powershell
# ✅ Move all .txt files into a root-level folder called "TXT-document"
$txtFolder = "TXT-document"

# Create the folder if it doesn't already exist
if (-not (Test-Path $txtFolder)) {
    New-Item -ItemType Directory -Path $txtFolder
}

# Recursively find all .txt files and move them to TXT-document
Get-ChildItem -Path . -Recurse -Include *.txt -File | ForEach-Object {
    $targetPath = Join-Path -Path $txtFolder -ChildPath $_.Name
    Move-Item -Path $_.FullName -Destination $targetPath -Force
}
```

---

## 📁 Move All `.md` Files to a Folder

Same as above, but for Markdown files.

```powershell
# ✅ Move all .md files into a root-level folder called "MD-document"
$mdFolder = "MD-document"

# Create the folder if it doesn't already exist
if (-not (Test-Path $mdFolder)) {
    New-Item -ItemType Directory -Path $mdFolder
}

# Recursively find all .md files and move them to MD-document
Get-ChildItem -Path . -Recurse -Include *.md -File | ForEach-Object {
    $targetPath = Join-Path -Path $mdFolder -ChildPath $_.Name
    Move-Item -Path $_.FullName -Destination $targetPath -Force
}
```

---

## 📂 List All `.js` and `.jsx` Files

Lists all `.js` and `.jsx` files (excluding those in `node_modules`) for review before deletion.

```powershell
# 📂 List all .js and .jsx files in the project (excluding node_modules)
Get-ChildItem -Path . -Recurse -Include *.js, *.jsx -File |
    Where-Object { $_.FullName -notmatch '\\node_modules\\' }
```

---

## 🗑️ Delete All `.js` and `.jsx` Files

Deletes all `.js` and `.jsx` files (excluding those in `node_modules`). Run the list command first to review!

```powershell
# 🗑️ Delete all .js and .jsx files in the project (excluding node_modules)
Get-ChildItem -Path . -Recurse -Include *.js, *.jsx -File |
    Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
    Remove-Item -Force
```

---

## 🧹 Clean TypeScript Project Output

Removes `.tsbuildinfo` and all generated `.js`/`.d.ts` files for composite or incremental builds.

```bash
# 🧹 Clean the TypeScript project build output
npx tsc --build --clean
```

---

## 🧰 Common & Useful Commands

### 🧪 Preview all file types in your project by extension:

```powershell
# List all unique file extensions in the project (excluding node_modules)
Get-ChildItem -Path . -Recurse -File |
    Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
    Select-Object Extension -Unique | Sort-Object Extension
```

### 🧹 Delete all `.map` files (e.g. from builds):

```powershell
# Delete all source map files
Get-ChildItem -Path . -Recurse -Include *.map -File | Remove-Item -Force
```

### 📦 Clear node\_modules safely:

```powershell
# Remove node_modules and package lock
Remove-Item -Recurse -Force .\node_modules, .\pnpm-lock.yaml, .\package-lock.json
```

### 📄 Find large files (>10MB):

```powershell
# Identify large files to clean or optimize
Get-ChildItem -Path . -Recurse -File | Where-Object { $_.Length -gt 10MB } | Sort-Object Length -Descending
```

### 🧼 Clear project cache (Next.js, Turbo, or general dev cache):

```powershell
# Clear .next cache (for Next.js)
Remove-Item -Recurse -Force .\.next

# Clear Turbo repo cache
Remove-Item -Recurse -Force .\node_modules\.cache

# Clear pnpm store (if needed)
pnpm store prune

# Clear Vite cache
Remove-Item -Recurse -Force .\node_modules\.vite

# Optional: restart editor/IDE to release locked cache files
```

### 📌 Common pnpm Commands

```bash
# Install all dependencies defined in package.json
pnpm install

# Add a package to your dependencies
pnpm add <package-name>

# Add a package to devDependencies
pnpm add -D <package-name>

# Remove a package
pnpm remove <package-name>

# Update all dependencies to their latest versions
pnpm update --latest

# Run a script from package.json
pnpm run <script-name>

# List installed packages
pnpm list

# Rebuild native packages and scripts
pnpm rebuild
```

---

## 🧑‍💻 Next.js 15 & React 19 Development Helpers

### 🚀 Upgrade and Setup

```bash
# Upgrade Next.js and React to the latest versions
npx @next/codemod@canary upgrade latest
npm install next@latest react@latest react-dom@latest
```

### ⚡ Enable Turbopack for blazing-fast development

```bash
# Start dev server using Turbopack
next dev --turbo
```

### 🧠 Enable React Compiler (Experimental)

```bash
# Install the React Compiler Babel plugin
npm install --save-dev @babel/plugin-react-compiler
```

### 📦 Configure Next.js Caching

```ts
// Example of forcing static generation
export const dynamic = 'force-static';
```

### 🧼 Clear Project Cache

```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .\.next

# Clear Turbopack cache
Remove-Item -Recurse -Force .\node_modules\.cache

# Clear pnpm store cache
pnpm store prune
```

---

## ✅ Notes

* These commands are **safe and tested** for development usage.
* Always **review files before deleting or moving**.
* You can turn each command into a script by saving it as a `.ps1` file and running it with `./script.ps1`.
* Commands can be customized further using `-Exclude`, `-Filter`, or `-Depth` as needed.
* Use Turbopack and React Compiler to get the most out of Next.js 15 + React 19.
