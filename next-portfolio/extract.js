const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\faf7b045-3f69-4aea-ba7c-f43fb405e299\\.system_generated\\logs\\transcript_full.jsonl';
if (!fs.existsSync(logPath)) {
  console.error("Log file does not exist at:", logPath);
  process.exit(1);
}

const fileContent = fs.readFileSync(logPath, 'utf8');
const searchString = "renderMinigame";
let index = fileContent.indexOf(searchString);
let count = 0;

console.log("Searching transcript for:", searchString);
while (index !== -1) {
  count++;
  const start = Math.max(0, index - 2000);
  const end = Math.min(fileContent.length, index + 3500);
  const chunk = fileContent.substring(start, end);
  
  // Unescape JSON string representation to make it readable code
  const readable = chunk
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
    
  const outPath = `found_occurrence_${count}.txt`;
  fs.writeFileSync(outPath, readable);
  console.log(`Wrote occurrence ${count} at index ${index} to ${outPath}`);
  
  index = fileContent.indexOf(searchString, index + 1);
}
console.log(`Done. Found ${count} occurrences.`);
