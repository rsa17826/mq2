#!/usr/bin/env node
/**
 * enumify-manager-refs.js
 *
 * Finds all occurrences of:
 *    manager.<propName>[<number>]
 *
 * For each unique (propName, number) pair:
 *   - Looks for a matching entry in the `const Enum = Object.freeze({...})`
 *     block at the top of the file, under category `Capitalize(propName)`,
 *     i.e. Enum.PropName.someKey === number.
 *   - If found, reuses that key name.
 *   - If not found, shows 3 lines of context around each occurrence and
 *     prompts you for a name. Adds `someKey: number,` to the matching
 *     enum category (creating the category if it doesn't exist yet).
 *
 * Then rewrites every `manager.propName[number]` -> `manager.propName[Enum.PropName.someKey]`
 * and writes the result to <input>.out.js (or an -o path you specify).
 *
 * Usage:
 *   node enumify-manager-refs.js <path/to/file.js> [-o output.js]
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

function die(msg) {
  console.error("Error: " + msg);
  process.exit(1);
}

// ---------- arg parsing ----------
const args = process.argv.slice(2);
if (args.length === 0) {
  die("Usage: node enumify-manager-refs.js <path/to/file.js> [-o output.js]");
}
const inputPath = args[0];
let outputPath = null;
const oIdx = args.indexOf("-o");
if (oIdx !== -1 && args[oIdx + 1]) {
  outputPath = args[oIdx + 1];
}
if (!outputPath) {
  const ext = path.extname(inputPath);
  const base = inputPath.slice(0, -ext.length || undefined);
  outputPath = `${base}.out${ext || ".js"}`;
}

if (!fs.existsSync(inputPath)) {
  die(`File not found: ${inputPath}`);
}

let src = fs.readFileSync(inputPath, "utf8");

// ---------- locate the Enum block ----------
const enumStartMarker = "const Enum = Object.freeze({";
const enumStart = src.indexOf(enumStartMarker);
if (enumStart === -1) {
  die('Could not find "const Enum = Object.freeze({" in the file.');
}

// find matching close for the outer Object.freeze({ ... });
function findMatchingBrace(str, openIdx) {
  // openIdx points at the '{' character
  let depth = 0;
  for (let i = openIdx; i < str.length; i++) {
    if (str[i] === "{") depth++;
    else if (str[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

const enumBraceOpen = src.indexOf("{", enumStart + "const Enum = Object.freeze(".length - 1);
const enumBraceClose = findMatchingBrace(src, enumBraceOpen);
if (enumBraceClose === -1) {
  die("Could not find matching closing brace for Enum block.");
}
// enumBody spans (enumBraceOpen+1 .. enumBraceClose-1), i.e. inside outer {}
const enumBodyStart = enumBraceOpen + 1;
const enumBodyEnd = enumBraceClose; // exclusive
let enumBody = src.slice(enumBodyStart, enumBodyEnd);

// ---------- parse categories within enumBody ----------
// Category shape: CategoryName: Object.freeze({ ...entries... }),
const categoryRegex = /(\w+)\s*:\s*Object\.freeze\(\{/g;
const categories = []; // { name, bodyStart, bodyEnd, openBrace, closeBrace }

let m;
while ((m = categoryRegex.exec(enumBody)) !== null) {
  const name = m[1];
  const openBrace = enumBody.indexOf("{", m.index);
  const closeBrace = findMatchingBrace(enumBody, openBrace);
  if (closeBrace === -1) continue;
  categories.push({
    name,
    openBrace,
    closeBrace,
    bodyStart: openBrace + 1,
    bodyEnd: closeBrace,
  });
}

function parseEntries(catBody) {
  // key: number  pairs (also tolerate string values, but we only care about numeric)
  const entries = [];
  const entryRegex = /(\w+)\s*:\s*(-?\d+)\s*,?/g;
  let em;
  while ((em = entryRegex.exec(catBody)) !== null) {
    entries.push({ key: em[1], value: parseInt(em[2], 10) });
  }
  return entries;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function findCategory(catName) {
  return categories.find((c) => c.name === catName);
}

function lookupExistingName(propName, index) {
  const catName = capitalize(propName);
  const cat = findCategory(catName);
  if (!cat) return null;
  const body = enumBody.slice(cat.bodyStart, cat.bodyEnd);
  const entries = parseEntries(body);
  const found = entries.find((e) => e.value === index);
  return found ? found.key : null;
}

// ---------- find all manager.prop[number] occurrences ----------
const refRegex = /manager\.(\w+)\[(\d+)\]/g;
const allSeen = new Map(); // key: prop|index -> { propName, index }
let rm;
while ((rm = refRegex.exec(src)) !== null) {
  const propName = rm[1];
  const index = parseInt(rm[2], 10);
  const key = `${propName}|${index}`;
  if (!allSeen.has(key)) {
    allSeen.set(key, { propName, index });
  }
}

if (allSeen.size === 0) {
  console.log("No `manager.<prop>[<number>]` references found. Nothing to do.");
  process.exit(0);
}

// ---------- only keep prop/index pairs that have at least one assignment ----------
// Matches: manager.prop[N] = ...   manager.prop[N] += ...  manager.prop[N]++  etc.
// Excludes plain equality/comparison (==, ===, !=, <=, >=) via negative lookahead/lookbehind.
const assignRegex =
  /manager\.(\w+)\[(\d+)\]\s*(?:=(?!=)|\+=|-=|\*=|\/=|%=|\*\*=|&&=|\|\|=|\?\?=|<<=|>>=|>>>=|&=|\^=|\|=|\+\+|--)/g;
const assignedSet = new Set();
let am;
while ((am = assignRegex.exec(src)) !== null) {
  assignedSet.add(`${am[1]}|${parseInt(am[2], 10)}`);
}

const seen = new Map();
for (const [key, val] of allSeen.entries()) {
  if (assignedSet.has(key)) seen.set(key, val);
}

const skippedCount = allSeen.size - seen.size;
if (skippedCount > 0) {
  console.log(
    `Skipping ${skippedCount} reference(s) with no assignment (read-only usages left untouched).`
  );
}

if (seen.size === 0) {
  console.log("No assigned `manager.<prop>[<number>]` references found. Nothing to do.");
  process.exit(0);
}

const lines = src.split("\n");

function findFirstOccurrenceLine(propName, index) {
  const needle = `manager.${propName}[${index}]`;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(needle)) return i;
  }
  return -1;
}

function showContext(propName, index) {
  const lineIdx = findFirstOccurrenceLine(propName, index);
  console.log("\n---------------------------------------------");
  console.log(`manager.${propName}[${index}]  (no matching Enum.${capitalize(propName)} entry found)`);
  console.log("---------------------------------------------");
  if (lineIdx === -1) {
    console.log("(context not found)");
    return;
  }
  const start = Math.max(0, lineIdx - 3);
  const end = Math.min(lines.length - 1, lineIdx + 3);
  for (let i = start; i <= end; i++) {
    const marker = i === lineIdx ? ">> " : "   ";
    console.log(`${marker}${i + 1}: ${lines[i]}`);
  }
  console.log("---------------------------------------------");
}

// ---------- interactive prompt ----------
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function ask(question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
}

// pending additions to make to enumBody, keyed by category name
const pendingAdditions = new Map(); // catName -> [{key, value}]
const resolvedNames = new Map(); // "prop|index" -> name

function addPendingEntry(catName, key, value) {
  if (!pendingAdditions.has(catName)) pendingAdditions.set(catName, []);
  pendingAdditions.get(catName).push({ key, value });
}

// Also need to know, while prompting, entries already added in this run
// (in case the same new name/category comes up twice before we rewrite enumBody)
function lookupPendingName(propName, index) {
  const catName = capitalize(propName);
  const added = pendingAdditions.get(catName);
  if (!added) return null;
  const found = added.find((e) => e.value === index);
  return found ? found.key : null;
}

async function resolveNames() {
  for (const { propName, index } of seen.values()) {
    const key = `${propName}|${index}`;

    let name = lookupExistingName(propName, index);
    if (!name) name = lookupPendingName(propName, index);

    if (!name) {
      showContext(propName, index);
      let answer = "";
      while (!answer) {
        answer = await ask(`Enter a name for Enum.${capitalize(propName)}.<name> = ${index}: `);
        if (!answer) console.log("Name cannot be empty.");
      }
      name = answer;
      addPendingEntry(capitalize(propName), name, index);
    } else {
      console.log(`manager.${propName}[${index}] -> Enum.${capitalize(propName)}.${name} (matched existing)`);
    }

    resolvedNames.set(key, name);
  }
}

function applyEnumAdditions() {
  if (pendingAdditions.size === 0) return;

  // Work on a mutable copy, apply from the end backwards so indices don't shift
  // for earlier edits within enumBody.
  const catOps = [];

  for (const [catName, entries] of pendingAdditions.entries()) {
    let cat = findCategory(catName);
    if (cat) {
      // insert entries just before cat.closeBrace (inside the category's braces)
      const insertText = entries.map((e) => `    ${e.key}: ${e.value},\n  `).join("");
      catOps.push({ pos: cat.closeBrace, insert: insertText, type: "insert-into-existing" });
    } else {
      // new category: insert a whole new block just before enumBody's end
      const entryLines = entries.map((e) => `      ${e.key}: ${e.value},`).join("\n");
      const block = `  ${catName}: Object.freeze({\n${entryLines}\n  }),\n`;
      catOps.push({ pos: enumBody.length, insert: block, type: "insert-new-category" });
    }
  }

  // sort by position descending so earlier splices don't invalidate later positions
  catOps.sort((a, b) => b.pos - a.pos);
  for (const op of catOps) {
    enumBody = enumBody.slice(0, op.pos) + op.insert + enumBody.slice(op.pos);
  }
}

function rewriteReferences(text) {
  return text.replace(refRegex, (whole, propName, indexStr) => {
    const index = parseInt(indexStr, 10);
    const key = `${propName}|${index}`;
    const name = resolvedNames.get(key);
    if (!name) return whole; // shouldn't happen
    return `manager.${propName}[Enum.${capitalize(propName)}.${name}]`;
  });
}

(async function main() {
  console.log(`Found ${seen.size} unique manager.<prop>[<number>] reference(s) in ${inputPath}\n`);

  await resolveNames();
  rl.close();

  applyEnumAdditions();

  // rebuild file: swap in the (possibly modified) enumBody, then rewrite refs
  let newSrc = src.slice(0, enumBodyStart) + enumBody + src.slice(enumBodyEnd);
  // refRegex has lastIndex state from earlier exec loop; reset before reuse
  refRegex.lastIndex = 0;
  newSrc = rewriteReferences(newSrc);

  fs.writeFileSync(outputPath, newSrc, "utf8");
  console.log(`\nDone. Wrote updated file to: ${outputPath}`);
})();
