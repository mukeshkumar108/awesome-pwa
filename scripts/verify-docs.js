#!/usr/bin/env node

/**
 * Documentation Version Checking System
 *
 * This script verifies documentation accuracy and synchronization:
 * 1. Checks file references in docs are still valid
 * 2. Verifies line numbers in injection points
 * 3. Validates links and cross-references
 * 4. Reports synchronization status
 *
 * Usage: node scripts/verify-docs.js
 */

const fs = require('fs');
const path = require('path');

class DocVerifier {
  constructor() {
    this.issues = [];
    this.warnings = [];
  }

  // Check if file exists
  checkFileExists(filePath, context = '') {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      this.issues.push(`❌ Missing file: ${filePath} ${context ? `(${context})` : ''}`);
      return false;
    }
    return true;
  }

  // Check if line numbers in file are valid
  checkLineNumbers(filePath, lineNumbers, context = '') {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      return; // File existence already checked
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    const maxLines = lines.length;

    lineNumbers.forEach(lineNum => {
      if (lineNum > maxLines) {
        this.issues.push(`❌ Invalid line number ${lineNum} in ${filePath} (max: ${maxLines}) ${context ? `(${context})` : ''}`);
      }
    });
  }

  // Check injection points for accuracy
  verifyInjectionPoints() {
    console.log('🔍 Verifying injection points...');

    const injectionFile = 'docs/CONTEXT_INJECTION.md';
    if (!this.checkFileExists(injectionFile)) return;

    const content = fs.readFileSync(path.join(process.cwd(), injectionFile), 'utf8');
    const lines = content.split('\n');

    // Extract file references and line numbers from injection points
    const fileRefs = [];
    lines.forEach((line, index) => {
      // Look for patterns like "- /src/file.tsx (lines 1-50)"
      const fileMatch = line.match(/- ([^(\n]+) \(lines ([0-9,\-\s]+)\)/);
      if (fileMatch) {
        const filePath = fileMatch[1];
        const lineRange = fileMatch[2];

        // Parse line numbers (handle ranges like "1-50" or "1, 25, 30")
        const lineNumbers = lineRange
          .split(',')
          .map(range => range.trim())
          .flatMap(range => {
            if (range.includes('-')) {
              const [start, end] = range.split('-').map(n => parseInt(n.trim()));
              return Array.from({ length: end - start + 1 }, (_, i) => start + i);
            }
            return [parseInt(range)];
          });

        fileRefs.push({ filePath, lineNumbers, context: `line ${index + 1}` });
      }
    });

    console.log(`Found ${fileRefs.length} injection point references`);

    // Verify each reference
    fileRefs.forEach(ref => {
      if (this.checkFileExists(ref.filePath, `injection point`)) {
        this.checkLineNumbers(ref.filePath, ref.lineNumbers, ref.context);
      }
    });
  }

  // Check cross-references between docs
  verifyCrossReferences() {
    console.log('🔗 Verifying cross-references...');

    const docsDir = 'docs';
    const docFiles = fs.readdirSync(docsDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(docsDir, file));

    const allLinks = new Map();

    // Collect all internal links
    docFiles.forEach(docFile => {
      const content = fs.readFileSync(docFile, 'utf8');
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;

      while ((match = linkRegex.exec(content)) !== null) {
        const [fullMatch, text, link] = match;

        // Only check relative links
        if (!link.startsWith('http') && !link.startsWith('#')) {
          if (!allLinks.has(link)) {
            allLinks.set(link, []);
          }
          allLinks.get(link).push({ from: docFile, text });
        }
      }
    });

    console.log(`Found ${allLinks.size} internal links to verify`);

    // Verify each internal link
    for (const [link, references] of allLinks) {
      const targetPath = path.resolve('docs', link);
      if (!fs.existsSync(targetPath)) {
        references.forEach(ref => {
          this.issues.push(`❌ Broken link: ${link} (referenced in ${ref.from})`);
        });
      }
    }
  }

  // Check documentation version consistency
  verifyVersionConsistency() {
    console.log('📊 Checking version consistency...');

    const versionFile = 'docs/VERSION.md';
    if (!this.checkFileExists(versionFile)) return;

    const versionContent = fs.readFileSync(path.join(process.cwd(), versionFile), 'utf8');
    const versionMatch = versionContent.match(/## Current Version\s*\*\*v([^)]+)\*\*/);

    if (!versionMatch) {
      this.warnings.push('⚠️ Could not extract current version from VERSION.md');
      return;
    }

    const currentVersion = versionMatch[1];
    console.log(`Current documentation version: v${currentVersion}`);

    // Check if version appears in changelog
    const changelogFile = 'docs/CHANGELOG.md';
    if (this.checkFileExists(changelogFile)) {
      const changelogContent = fs.readFileSync(path.join(process.cwd(), changelogFile), 'utf8');
      if (!changelogContent.includes(`[${currentVersion}]`)) {
        this.warnings.push(`⚠️ Version v${currentVersion} not found in CHANGELOG.md`);
      }
    }
  }

  // Run all verification checks
  async run() {
    console.log('🚀 Starting documentation verification...\n');

    try {
      this.verifyInjectionPoints();
      console.log('');
      this.verifyCrossReferences();
      console.log('');
      this.verifyVersionConsistency();
      console.log('');

      // Summary
      console.log('📋 Verification Summary:');
      console.log(`Issues found: ${this.issues.length}`);
      console.log(`Warnings: ${this.warnings.length}`);

      if (this.issues.length > 0) {
        console.log('\n❌ Critical Issues:');
        this.issues.forEach(issue => console.log(`  ${issue}`));
      }

      if (this.warnings.length > 0) {
        console.log('\n⚠️ Warnings:');
        this.warnings.forEach(warning => console.log(`  ${warning}`));
      }

      if (this.issues.length === 0 && this.warnings.length === 0) {
        console.log('\n✅ All documentation checks passed!');
      }

      return this.issues.length === 0;

    } catch (error) {
      console.error('❌ Verification failed:', error.message);
      return false;
    }
  }
}

// Run verification
const verifier = new DocVerifier();
verifier.run().then(success => {
  process.exit(success ? 0 : 1);
});
