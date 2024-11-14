import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { format as csvWriter } from 'fast-csv';

// Function to run a shell command and get the output
function runCommand(command) {
  return execSync(command).toString().trim();
}

// Get commit count
const commitCount = runCommand('git rev-list --all --count');

// Get unique authors
const authors = runCommand('git shortlog -sne').split('\n').length;

// Get commit dates (actual dates)
const commitDates = runCommand('git log --pretty=format:"%ad" --date=short').split('\n');

// Count lines of code in source files
function countLines(dirPath) {
  let totalLines = 0;
  fs.readdirSync(dirPath).forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      totalLines += countLines(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.svelte')) {
      const lines = fs.readFileSync(fullPath, 'utf-8').split('\n').length;
      totalLines += lines;
    }
  });
  return totalLines;
}

function getLanguageStats() {
  const clocResult = runCommand('cloc --json .'); // Run cloc in the project root
  const clocData = JSON.parse(clocResult);
  const languageStats = {};

  Object.keys(clocData).forEach(language => {
    if (language !== 'header') {
      languageStats[language] = clocData[language].code;
    }
  });

  return languageStats;
}

const linesByLanguage = getLanguageStats(); // Get language stats from cloc
const linesOfCode = countLines('./src'); // Adjust to your codebase path

// Write to CSV
const csvStream = csvWriter({ headers: true });
const outputPath = 'static/code-analysis.csv';
const writeStream = fs.createWriteStream(outputPath);

csvStream.pipe(writeStream);

// Write the data
csvStream.write({ metric: 'Total Commits', value: commitCount });
csvStream.write({ metric: 'Unique Authors', value: authors });
csvStream.write({ metric: 'Lines of Code', value: linesOfCode });
csvStream.write({ metric: 'Commit Dates', value: commitDates.join(', ') });

Object.keys(linesByLanguage).forEach(language => {
  csvStream.write({ metric: `${language}`, value: linesByLanguage[language] });
});

csvStream.end();

console.log(`CSV report generated at: ${outputPath}`);
