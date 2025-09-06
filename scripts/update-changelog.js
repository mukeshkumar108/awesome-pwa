#!/usr/bin/env node

/**
 * Automated Changelog Update Script
 *
 * This script helps automate changelog updates by:
 * 1. Reading recent git commits
 * 2. Formatting them according to our changelog standards
 * 3. Adding entries to CHANGELOG.md
 *
 * Usage: node scripts/update-changelog.js
 */

const fs = require('fs');
const { execSync } = require('child_process');

function updateChangelog() {
  const changelogPath = 'docs/CHANGELOG.md';

  // Get recent commits (last 10)
  const recentCommits = execSync('git log --oneline -10', { encoding: 'utf8' })
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const [hash, ...messageParts] = line.split(' ');
      return {
        hash: hash.substring(0, 7),
        message: messageParts.join(' ')
      };
    });

  // Format new entries
  const timestamp = new Date().toISOString().split('T')[0];
  const newEntries = recentCommits.map(commit =>
    `- ${commit.message} (${commit.hash})`
  ).join('\n');

  // Read current changelog
  const currentContent = fs.readFileSync(changelogPath, 'utf8');

  // Find the first version section
  const lines = currentContent.split('\n');
  const versionSectionIndex = lines.findIndex(line => line.startsWith('## ['));

  if (versionSectionIndex === -1) {
    console.error('Could not find version section in changelog');
    return;
  }

  // Insert new entries after the version header
  const updatedContent =
    lines.slice(0, versionSectionIndex + 1).join('\n') + '\n' +
    `### Automated Update (${timestamp})\n` +
    newEntries + '\n\n' +
    lines.slice(versionSectionIndex + 1).join('\n');

  // Write back to file
  fs.writeFileSync(changelogPath, updatedContent);

  console.log('✅ Changelog updated successfully!');
  console.log(`Added ${recentCommits.length} new entries`);
}

function updateVersionIfNeeded() {
  // Simple version bump logic (could be enhanced)
  const versionPath = 'docs/VERSION.md';
  const versionContent = fs.readFileSync(versionPath, 'utf8');

  // This is a basic implementation - in practice you'd want more sophisticated version management
  console.log('🔄 Version check complete (no automated bumping configured)');
}

// Main execution
try {
  console.log('🚀 Starting automated changelog update...');
  updateChangelog();
  updateVersionIfNeeded();
  console.log('✨ All updates completed successfully!');
} catch (error) {
  console.error('❌ Error during changelog update:', error.message);
  process.exit(1);
}
