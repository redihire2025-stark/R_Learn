-- ============================================================
-- R-Learn Platform — Complete Curriculum Seed
-- Run this in Supabase SQL Editor AFTER supabase_schema.sql
-- ============================================================

-- Clear existing modules, lessons, challenges, quizzes
truncate public.quiz_questions cascade;
truncate public.quizzes cascade;
truncate public.lessons cascade;
truncate public.modules cascade;
truncate public.challenges cascade;

-- ============================================================
-- MODULES — All 14 Tracks
-- ============================================================

insert into public.modules (id, course_id, title, order_index) values

-- TRACK 1: HTML5 FUNDAMENTALS
('m101','c1000000-0000-0000-0000-000000000001','How the Internet & Web Works',1),
('m102','c1000000-0000-0000-0000-000000000001','HTML Document Structure',2),
('m103','c1000000-0000-0000-0000-000000000001','Text, Headings & Paragraphs',3),
('m104','c1000000-0000-0000-0000-000000000001','Links, Images & Media',4),
('m105','c1000000-0000-0000-0000-000000000001','Lists & Tables',5),
('m106','c1000000-0000-0000-0000-000000000001','HTML Forms & Input Types',6),
('m107','c1000000-0000-0000-0000-000000000001','Semantic HTML5 Elements',7),
('m108','c1000000-0000-0000-0000-000000000001','Accessibility & ARIA',8),
('m109','c1000000-0000-0000-0000-000000000001','SEO Fundamentals',9),
('m110','c1000000-0000-0000-0000-000000000001','Audio, Video & Canvas',10),
('m111','c1000000-0000-0000-0000-000000000001','SVG & Web Graphics',11),
('m112','c1000000-0000-0000-0000-000000000001','HTML Performance & Best Practices',12),

-- TRACK 2: CSS3 & TAILWIND
('m201','c1000000-0000-0000-0000-000000000002','CSS Fundamentals & Selectors',1),
('m202','c1000000-0000-0000-0000-000000000002','Colors, Typography & Units',2),
('m203','c1000000-0000-0000-0000-000000000002','The Box Model & Spacing',3),
('m204','c1000000-0000-0000-0000-000000000002','Positioning & Display',4),
('m205','c1000000-0000-0000-0000-000000000002','Flexbox Layout',5),
('m206','c1000000-0000-0000-0000-000000000002','CSS Grid Layout',6),
('m207','c1000000-0000-0000-0000-000000000002','Responsive Design & Media Queries',7),
('m208','c1000000-0000-0000-0000-000000000002','Animations & Transitions',8),
('m209','c1000000-0000-0000-0000-000000000002','CSS Variables & Architecture',9),
('m210','c1000000-0000-0000-0000-000000000002','Tailwind CSS Fundamentals',10),
('m211','c1000000-0000-0000-0000-000000000002','Tailwind Layout & Components',11),
('m212','c1000000-0000-0000-0000-000000000002','Tailwind Responsive & Dark Mode',12),
('m213','c1000000-0000-0000-0000-000000000002','Tailwind Customization & Plugins',13),

-- TRACK 3: JAVASCRIPT ES6+
('m301','c1000000-0000-0000-0000-000000000003','JavaScript Foundations',1),
('m302','c1000000-0000-0000-0000-000000000003','Variables, Types & Operators',2),
('m303','c1000000-0000-0000-0000-000000000003','Functions & Scope',3),
('m304','c1000000-0000-0000-0000-000000000003','Arrays & Array Methods',4),
('m305','c1000000-0000-0000-0000-000000000003','Objects & Destructuring',5),
('m306','c1000000-0000-0000-0000-000000000003','Control Flow & Loops',6),
('m307','c1000000-0000-0000-0000-000000000003','DOM Manipulation',7),
('m308','c1000000-0000-0000-0000-000000000003','Events & Event Handling',8),
('m309','c1000000-0000-0000-0000-000000000003','Asynchronous JavaScript',9),
('m310','c1000000-0000-0000-0000-000000000003','Promises & Async/Await',10),
('m311','c1000000-0000-0000-0000-000000000003','Fetch API & HTTP',11),
('m312','c1000000-0000-0000-0000-000000000003','Error Handling',12),
('m313','c1000000-0000-0000-0000-000000000003','ES6+ Modules',13),
('m314','c1000000-0000-0000-0000-000000000003','OOP & Classes',14),
('m315','c1000000-0000-0000-0000-000000000003','Closures & Prototypes',15),
('m316','c1000000-0000-0000-0000-000000000003','Functional Programming',16),
('m317','c1000000-0000-0000-0000-000000000003','Design Patterns in JS',17),

-- TRACK 4: TYPESCRIPT
('m401','c1000000-0000-0000-0000-000000000004','TypeScript Introduction',1),
('m402','c1000000-0000-0000-0000-000000000004','Basic Types & Type Annotations',2),
('m403','c1000000-0000-0000-0000-000000000004','Interfaces & Type Aliases',3),
('m404','c1000000-0000-0000-0000-000000000004','Functions in TypeScript',4),
('m405','c1000000-0000-0000-0000-000000000004','Classes & OOP',5),
('m406','c1000000-0000-0000-0000-000000000004','Generics',6),
('m407','c1000000-0000-0000-0000-000000000004','Utility Types',7),
('m408','c1000000-0000-0000-0000-000000000004','Advanced Types',8),
('m409','c1000000-0000-0000-0000-000000000004','Modules & Namespaces',9),
('m410','c1000000-0000-0000-0000-000000000004','TypeScript Configuration',10),
('m411','c1000000-0000-0000-0000-000000000004','TypeScript with React',11),
('m412','c1000000-0000-0000-0000-000000000004','Enterprise TypeScript Patterns',12),

-- TRACK 5: REACT JS
('m501','c1000000-0000-0000-0000-000000000005','React Fundamentals',1),
('m502','c1000000-0000-0000-0000-000000000005','JSX & Rendering',2),
('m503','c1000000-0000-0000-0000-000000000005','Components & Props',3),
('m504','c1000000-0000-0000-0000-000000000005','State & useState',4),
('m505','c1000000-0000-0000-0000-000000000005','Events & Forms',5),
('m506','c1000000-0000-0000-0000-000000000005','useEffect & Lifecycle',6),
('m507','c1000000-0000-0000-0000-000000000005','React Router',7),
('m508','c1000000-0000-0000-0000-000000000005','Context API',8),
('m509','c1000000-0000-0000-0000-000000000005','Custom Hooks',9),
('m510','c1000000-0000-0000-0000-000000000005','API Integration',10),
('m511','c1000000-0000-0000-0000-000000000005','State Management (Zustand/Redux)',11),
('m512','c1000000-0000-0000-0000-000000000005','Performance Optimization',12),
('m513','c1000000-0000-0000-0000-000000000005','Testing React Apps',13),
('m514','c1000000-0000-0000-0000-000000000005','Authentication in React',14),
('m515','c1000000-0000-0000-0000-000000000005','Deployment & Build Optimization',15),

-- TRACK 6: TAILWIND DEEP DIVE
('m601','c1000000-0000-0000-0000-000000000006','Tailwind Core Concepts',1),
('m602','c1000000-0000-0000-0000-000000000006','Spacing, Sizing & Layout',2),
('m603','c1000000-0000-0000-0000-000000000006','Typography & Colors',3),
('m604','c1000000-0000-0000-0000-000000000006','Flexbox & Grid with Tailwind',4),
('m605','c1000000-0000-0000-0000-000000000006','Responsive Design',5),
('m606','c1000000-0000-0000-0000-000000000006','Dark Mode & Themes',6),
('m607','c1000000-0000-0000-0000-000000000006','Component Patterns',7),
('m608','c1000000-0000-0000-0000-000000000006','Custom Configuration',8),

-- TRACK 7: NODE.JS
('m701','c1000000-0000-0000-0000-000000000007','Node.js Runtime & Architecture',1),
('m702','c1000000-0000-0000-0000-000000000007','Modules & NPM',2),
('m703','c1000000-0000-0000-0000-000000000007','The Event Loop',3),
('m704','c1000000-0000-0000-0000-000000000007','File System & Buffers',4),
('m705','c1000000-0000-0000-0000-000000000007','Streams & Pipes',5),
('m706','c1000000-0000-0000-0000-000000000007','HTTP Server Fundamentals',6),
('m707','c1000000-0000-0000-0000-000000000007','Async Patterns',7),
('m708','c1000000-0000-0000-0000-000000000007','Error Handling & Logging',8),
('m709','c1000000-0000-0000-0000-000000000007','Environment & Configuration',9),
('m710','c1000000-0000-0000-0000-000000000007','Security Fundamentals',10),
('m711','c1000000-0000-0000-0000-000000000007','Performance & Clustering',11),

-- TRACK 8: EXPRESS.JS
('m801','c1000000-0000-0000-0000-000000000008','Express Setup & Core Concepts',1),
('m802','c1000000-0000-0000-0000-000000000008','Routing',2),
('m803','c1000000-0000-0000-0000-000000000008','Middleware',3),
('m804','c1000000-0000-0000-0000-000000000008','Request & Response',4),
('m805','c1000000-0000-0000-0000-000000000008','Controllers & Services',5),
('m806','c1000000-0000-0000-0000-000000000008','Validation & Sanitization',6),
('m807','c1000000-0000-0000-0000-000000000008','Authentication Middleware',7),
('m808','c1000000-0000-0000-0000-000000000008','Error Handling',8),
('m809','c1000000-0000-0000-0000-000000000008','API Architecture & Best Practices',9),

-- TRACK 9: REST API DESIGN
('m901','c1000000-0000-0000-0000-000000000009','HTTP Fundamentals',1),
('m902','c1000000-0000-0000-0000-000000000009','REST Principles',2),
('m903','c1000000-0000-0000-0000-000000000009','Resource Design & Naming',3),
('m904','c1000000-0000-0000-0000-000000000009','CRUD Operations',4),
('m905','c1000000-0000-0000-0000-000000000009','Validation & Error Responses',5),
('m906','c1000000-0000-0000-0000-000000000009','Pagination, Filtering & Search',6),
('m907','c1000000-0000-0000-0000-000000000009','API Versioning',7),
('m908','c1000000-0000-0000-0000-000000000009','API Documentation with OpenAPI',8),
('m909','c1000000-0000-0000-0000-000000000009','API Security',9),
('m910','c1000000-0000-0000-0000-000000000009','API Testing',10),

-- TRACK 10: AUTH & SECURITY
('m1001','c1000000-0000-0000-0000-000000000010','Security Fundamentals',1),
('m1002','c1000000-0000-0000-0000-000000000010','Authentication Concepts',2),
('m1003','c1000000-0000-0000-0000-000000000010','Sessions & Cookies',3),
('m1004','c1000000-0000-0000-0000-000000000010','JSON Web Tokens (JWT)',4),
('m1005','c1000000-0000-0000-0000-000000000010','OAuth 2.0 & OpenID Connect',5),
('m1006','c1000000-0000-0000-0000-000000000010','Role-Based Access Control',6),
('m1007','c1000000-0000-0000-0000-000000000010','Password Security',7),
('m1008','c1000000-0000-0000-0000-000000000010','OWASP Top 10',8),
('m1009','c1000000-0000-0000-0000-000000000010','XSS, CSRF & SQL Injection',9),
('m1010','c1000000-0000-0000-0000-000000000010','HTTPS & API Security',10),

-- TRACK 11: DATABASE FUNDAMENTALS
('m1101','c1000000-0000-0000-0000-000000000011','Relational Database Concepts',1),
('m1102','c1000000-0000-0000-0000-000000000011','SQL Basics — SELECT & Filtering',2),
('m1103','c1000000-0000-0000-0000-000000000011','SQL — INSERT, UPDATE, DELETE',3),
('m1104','c1000000-0000-0000-0000-000000000011','Joins',4),
('m1105','c1000000-0000-0000-0000-000000000011','Aggregations & Grouping',5),
('m1106','c1000000-0000-0000-0000-000000000011','Indexes & Performance',6),
('m1107','c1000000-0000-0000-0000-000000000011','Transactions & ACID',7),
('m1108','c1000000-0000-0000-0000-000000000011','Database Design & Normalization',8),
('m1109','c1000000-0000-0000-0000-000000000011','Views & Stored Procedures',9),
('m1110','c1000000-0000-0000-0000-000000000011','PostgreSQL Advanced Features',10),
('m1111','c1000000-0000-0000-0000-000000000011','Database Security',11),

-- TRACK 12: GIT & GITHUB
('m1201','c1000000-0000-0000-0000-000000000012','Git Fundamentals',1),
('m1202','c1000000-0000-0000-0000-000000000012','Commits & History',2),
('m1203','c1000000-0000-0000-0000-000000000012','Branching & Merging',3),
('m1204','c1000000-0000-0000-0000-000000000012','Remote Repositories',4),
('m1205','c1000000-0000-0000-0000-000000000012','Pull Requests & Code Review',5),
('m1206','c1000000-0000-0000-0000-000000000012','Git Workflows',6),
('m1207','c1000000-0000-0000-0000-000000000012','Advanced Git',7),
('m1208','c1000000-0000-0000-0000-000000000012','GitHub Actions & CI/CD',8),

-- TRACK 13: BACKEND ARCHITECTURE
('m1301','c1000000-0000-0000-0000-000000000013','Layered Architecture',1),
('m1302','c1000000-0000-0000-0000-000000000013','Monolithic vs Microservices',2),
('m1303','c1000000-0000-0000-0000-000000000013','API Gateway & Service Mesh',3),
('m1304','c1000000-0000-0000-0000-000000000013','Event-Driven Architecture',4),
('m1305','c1000000-0000-0000-0000-000000000013','Message Queues & Pub/Sub',5),
('m1306','c1000000-0000-0000-0000-000000000013','Caching Strategies',6),
('m1307','c1000000-0000-0000-0000-000000000013','Scalability Patterns',7),
('m1308','c1000000-0000-0000-0000-000000000013','Observability & Monitoring',8),
('m1309','c1000000-0000-0000-0000-000000000013','Resilience Patterns',9),
('m1310','c1000000-0000-0000-0000-000000000013','Cloud Deployment',10),

-- TRACK 14: SYSTEM DESIGN
('m1401','c1000000-0000-0000-0000-000000000014','System Design Fundamentals',1),
('m1402','c1000000-0000-0000-0000-000000000014','Scalability & Load Balancing',2),
('m1403','c1000000-0000-0000-0000-000000000014','Database Design at Scale',3),
('m1404','c1000000-0000-0000-0000-000000000014','Caching & CDN',4),
('m1405','c1000000-0000-0000-0000-000000000014','Message Queues & Async Processing',5),
('m1406','c1000000-0000-0000-0000-000000000014','Availability & Reliability',6),
('m1407','c1000000-0000-0000-0000-000000000014','CAP Theorem & Consistency',7),
('m1408','c1000000-0000-0000-0000-000000000014','Designing Real Systems',8),
('m1409','c1000000-0000-0000-0000-000000000014','System Design Interview Prep',9)

on conflict do nothing;

-- ============================================================
-- LESSONS — Track 1: HTML5 (Full Content)
-- ============================================================

insert into public.lessons (id, module_id, title, content, duration_minutes, order_index) values

-- Module 1: How the Internet Works
('l10101', 'm101', 'How the Internet Works', E'# How the Internet Works\n\n## Why This Topic Matters\nEvery web developer needs to understand the infrastructure their code runs on. Knowing how data travels from a server to a browser helps you debug problems, optimize performance, and design better applications.\n\n## Learning Objectives\n- Understand what the internet is and how it transmits data\n- Explain the difference between the internet and the web\n- Describe the client-server model\n- Understand IP addresses and DNS\n\n## Core Concepts\n\n### The Internet vs The Web\nThe **internet** is a global network of computers connected together. The **web** (World Wide Web) is a service that runs ON the internet — a collection of web pages and resources.\n\n> 🏙️ **Real-World Analogy**: The internet is like the road network. The web is like the shops and buildings you can visit using those roads.\n\n## Visual Diagram\n```\n[Your Browser] → [DNS Server] → [IP Address]\n      ↓\n[Router] → [Internet] → [Web Server]\n      ↓\n[HTML/CSS/JS] ← [Response]\n```\n\n## How Data Travels\n1. You type `google.com` in your browser\n2. Your browser asks a **DNS server**: "What is the IP address of google.com?"\n3. DNS replies: `142.250.80.46`\n4. Your browser sends an **HTTP request** to that IP\n5. The server receives it and sends back HTML\n6. Your browser renders the HTML as a webpage\n\n## Key Terms\n| Term | Meaning |\n|---|---|\n| IP Address | Unique number identifying a device on the internet |\n| DNS | Domain Name System — phone book of the internet |\n| HTTP/HTTPS | Protocol for sending web data |\n| Server | Computer that stores and serves websites |\n| Client | Your browser that requests websites |\n\n## Best Practices\n- Always use HTTPS (secure) not HTTP\n- Understand that every network request takes time (latency)\n- CDNs serve files from servers close to the user\n\n## Common Mistakes\n- ❌ Confusing the internet with the web\n- ❌ Thinking websites are stored on your computer\n\n## Interview Questions\n1. What is the difference between the internet and the World Wide Web?\n2. What does DNS stand for and what does it do?\n3. What happens when you type a URL into a browser?\n4. What is the difference between HTTP and HTTPS?\n\n## Summary\n- The internet = infrastructure (cables, routers, servers)\n- The web = content served over the internet (HTML pages)\n- Browsers make HTTP requests; servers send back responses\n- DNS translates domain names to IP addresses\n\n## Mini Quiz\n1. What does DNS stand for?\n2. Which protocol is secure: HTTP or HTTPS?\n3. What is a web server?\n\n## Assignment\nOpen your browser DevTools (F12) → Network tab → visit any website → identify 3 HTTP requests and note their status codes.', 15, 1),

('l10102', 'm101', 'Clients, Servers & HTTP', E'# Clients, Servers & HTTP\n\n## Why This Topic Matters\nHTTP is the language of the web. Every web request you make — loading a page, submitting a form, fetching data — uses HTTP. Understanding it makes you a better developer.\n\n## Learning Objectives\n- Understand the client-server architecture\n- Know HTTP methods (GET, POST, PUT, DELETE)\n- Understand HTTP status codes\n- Read HTTP request and response headers\n\n## Core Concepts\n\n### Client-Server Model\n- **Client** (browser): Makes requests, displays results\n- **Server**: Receives requests, processes them, returns responses\n\n> 🍕 **Real-World Analogy**: A client is a customer at a restaurant. The server is the waiter. HTTP is the language they use to communicate.\n\n## HTTP Methods\n| Method | Purpose | Example |\n|---|---|---|\n| GET | Retrieve data | Load a web page |\n| POST | Send data | Submit a login form |\n| PUT | Update data | Edit a profile |\n| DELETE | Remove data | Delete an account |\n| PATCH | Partial update | Change just the email |\n\n## HTTP Status Codes\n| Code | Meaning |\n|---|---|\n| 200 | OK — success |\n| 201 | Created |\n| 301 | Moved Permanently |\n| 400 | Bad Request |\n| 401 | Unauthorized |\n| 403 | Forbidden |\n| 404 | Not Found |\n| 500 | Server Error |\n\n## HTTP Request Structure\n```\nGET /index.html HTTP/1.1\nHost: www.example.com\nAccept: text/html\nUser-Agent: Mozilla/5.0\n```\n\n## HTTP Response Structure\n```\nHTTP/1.1 200 OK\nContent-Type: text/html\nContent-Length: 1234\n\n<html>...</html>\n```\n\n## Best Practices\n- Use the correct HTTP method for each operation\n- Return meaningful status codes from your APIs\n- Always check status codes when fetching data\n\n## Common Mistakes\n- ❌ Using GET to send sensitive data (it appears in the URL)\n- ❌ Returning 200 for error responses\n- ❌ Ignoring HTTPS\n\n## Interview Questions\n1. What is the difference between GET and POST?\n2. What does a 404 status code mean?\n3. What is a request header?\n4. What is REST?\n\n## Assignment\nUsing browser DevTools Network tab, find one GET and one POST request on any website. Record the URL, method, status code, and response type.', 20, 2),

-- Module 2: HTML Document Structure
('l10201', 'm102', 'Your First HTML Document', E'# Your First HTML Document\n\n## Why This Topic Matters\nEvery web page starts with an HTML document. Understanding its structure is the foundation of all web development.\n\n## Learning Objectives\n- Write a valid HTML5 document\n- Understand the DOCTYPE declaration\n- Use the html, head, and body elements correctly\n- Add metadata with meta tags\n\n## Core Concepts\n\n### HTML Document Anatomy\n```html\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n    <p>My first web page.</p>\n  </body>\n</html>\n```\n\n### Breaking It Down\n| Part | Purpose |\n|---|---|\n| `<!DOCTYPE html>` | Tells the browser this is HTML5 |\n| `<html lang="en">` | Root element, sets language |\n| `<head>` | Metadata (not visible) |\n| `<meta charset>` | Character encoding (use UTF-8 always) |\n| `<meta viewport>` | Makes page responsive on mobile |\n| `<title>` | Tab title in browser |\n| `<body>` | All visible content goes here |\n\n## Essential Meta Tags\n```html\n<!-- Always include these -->\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="Page description for SEO">\n<meta name="author" content="Your Name">\n```\n\n## Linking CSS and JavaScript\n```html\n<head>\n  <!-- CSS goes in head -->\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <!-- JS goes before closing body tag -->\n  <script src="app.js"></script>\n</body>\n```\n\n## Best Practices\n- Always include `<!DOCTYPE html>`\n- Always set `charset="UTF-8"`\n- Always include the viewport meta tag\n- Place CSS in `<head>`, JS before `</body>`\n- Use `lang` attribute on `<html>`\n\n## Common Mistakes\n- ❌ Forgetting `<!DOCTYPE html>` (triggers quirks mode)\n- ❌ Putting `<script>` in `<head>` without `defer` attribute\n- ❌ Missing viewport meta (breaks mobile layout)\n\n## Interview Questions\n1. Why do we need `<!DOCTYPE html>`?\n2. Where should you place `<script>` tags and why?\n3. What does `charset="UTF-8"` do?\n\n## Assignment\nCreate an HTML file for a personal profile page with: title, description meta tag, your name as h1, a short bio paragraph, and a link to your favourite website.', 20, 1),

('l10202', 'm102', 'HTML Tags & Attributes', E'# HTML Tags & Attributes\n\n## Why This Topic Matters\nTags and attributes are the building blocks of HTML. Every element you create uses them. Mastering their syntax eliminates a huge class of bugs.\n\n## Learning Objectives\n- Distinguish between opening and closing tags\n- Understand void elements\n- Use attributes correctly\n- Know global attributes\n\n## Core Concepts\n\n### Tag Syntax\n```html\n<!-- Opening + closing tag (most elements) -->\n<tagname attribute="value">Content</tagname>\n\n<!-- Void element (self-closing, no content) -->\n<img src="photo.jpg" alt="Photo">\n<br>\n<input type="text">\n```\n\n### Attribute Rules\n```html\n<!-- String attributes -->\n<a href="https://example.com">Link</a>\n\n<!-- Boolean attributes (presence = true) -->\n<input type="checkbox" checked>\n<button disabled>Click me</button>\n\n<!-- Data attributes (custom data) -->\n<div data-user-id="123">Profile</div>\n```\n\n## Global Attributes (Work on ANY element)\n| Attribute | Purpose |\n|---|---|\n| `id` | Unique identifier |\n| `class` | CSS class name(s) |\n| `style` | Inline CSS |\n| `data-*` | Custom data |\n| `hidden` | Hides element |\n| `tabindex` | Keyboard navigation order |\n| `title` | Tooltip text |\n| `lang` | Language of content |\n\n## Nesting Rules\n```html\n<!-- CORRECT: properly nested -->\n<p>This is <strong>bold</strong> text.</p>\n\n<!-- WRONG: overlapping tags -->\n<p>This is <strong>bold</p></strong>\n```\n\n## Best Practices\n- Always quote attribute values: `class="name"` not `class=name`\n- Use lowercase tag names\n- Always close non-void elements\n- Use `id` sparingly — only one element per ID\n\n## Common Mistakes\n- ❌ `<br/>` vs `<br>` — both work in HTML5 but be consistent\n- ❌ Using the same `id` twice on a page\n- ❌ Forgetting to close tags\n\n## Interview Questions\n1. What is the difference between an attribute and a property?\n2. What are void elements? Give 3 examples.\n3. What is the purpose of the `data-*` attribute?\n\n## Assignment\nCreate a div with: an id, two classes, a data attribute storing a user role, and a title tooltip. Nest a paragraph inside it with bold and italic text.', 15, 2),

-- Module 6: HTML Forms
('l10601', 'm106', 'HTML Forms Fundamentals', E'# HTML Forms Fundamentals\n\n## Why This Topic Matters\nForms are how users interact with your application — login, registration, search, checkout. Building them correctly is essential for usability and security.\n\n## Learning Objectives\n- Create forms with the `<form>` element\n- Use all common input types\n- Understand form attributes: action, method, enctype\n- Label inputs correctly for accessibility\n\n## Core Concepts\n\n### Basic Form Structure\n```html\n<form action="/submit" method="POST">\n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required>\n\n  <label for="password">Password:</label>\n  <input type="password" id="password" name="password" required>\n\n  <button type="submit">Sign In</button>\n</form>\n```\n\n### Form Attributes\n| Attribute | Values | Purpose |\n|---|---|---|\n| `action` | URL | Where to send data |\n| `method` | GET, POST | How to send data |\n| `enctype` | multipart/form-data | For file uploads |\n| `novalidate` | boolean | Disable browser validation |\n| `autocomplete` | on/off | Browser autocomplete |\n\n### All Input Types\n```html\n<input type="text"      name="username">\n<input type="email"     name="email">\n<input type="password"  name="pass">\n<input type="number"    name="age" min="0" max="120">\n<input type="tel"       name="phone">\n<input type="url"       name="website">\n<input type="date"      name="birthday">\n<input type="time"      name="appointment">\n<input type="checkbox"  name="agree" value="yes">\n<input type="radio"     name="gender" value="male">\n<input type="file"      name="avatar" accept="image/*">\n<input type="range"     name="volume" min="0" max="100">\n<input type="color"     name="theme">\n<input type="hidden"    name="csrf_token" value="abc123">\n<input type="search"    name="q">\n<input type="submit"    value="Submit">\n```\n\n### Select, Textarea, and Fieldset\n```html\n<select name="country">\n  <option value="">-- Select Country --</option>\n  <option value="IN">India</option>\n  <option value="US">United States</option>\n</select>\n\n<textarea name="message" rows="5" cols="40"\n  placeholder="Write your message..."></textarea>\n\n<fieldset>\n  <legend>Shipping Address</legend>\n  <input type="text" name="address">\n</fieldset>\n```\n\n## HTML5 Validation\n```html\n<input type="email" required>\n<input type="text" minlength="3" maxlength="50">\n<input type="number" min="1" max="100">\n<input type="text" pattern="[A-Za-z]+" title="Letters only">\n```\n\n## Best Practices\n- Always use `<label>` with `for` matching input `id`\n- Use `name` attributes — data is sent by name\n- Use `required` for mandatory fields\n- Group related fields in `<fieldset>`\n- Use correct input types for mobile keyboard support\n\n## Common Mistakes\n- ❌ Using `<div>` instead of `<label>`\n- ❌ Missing `name` attributes (data not sent)\n- ❌ Using GET for sensitive data (password in URL)\n- ❌ Relying only on HTML validation (always validate server-side too)\n\n## Interview Questions\n1. What is the difference between GET and POST in a form?\n2. How do you make a form field mandatory?\n3. What is the purpose of the `name` attribute on inputs?\n4. How do you handle file uploads in HTML forms?\n\n## Assignment\nBuild a registration form with: full name, email, password, confirm password, date of birth, department (select), profile picture (file), terms checkbox. Apply proper labels and validation attributes.', 30, 1),

-- Module 7: Semantic HTML
('l10701', 'm107', 'Semantic HTML5 Elements', E'# Semantic HTML5 Elements\n\n## Why This Topic Matters\nSemantic HTML makes your code meaningful to browsers, search engines, and screen readers. It improves SEO, accessibility, and code maintainability.\n\n## Learning Objectives\n- Know all major HTML5 semantic elements\n- Use them in the correct context\n- Understand the difference between semantic and non-semantic elements\n- Structure a complete webpage semantically\n\n## Core Concepts\n\n### Semantic vs Non-Semantic\n```html\n<!-- ❌ Non-semantic: no meaning -->\n<div class="header">\n  <div class="nav">...</div>\n</div>\n<div class="main">...</div>\n<div class="footer">...</div>\n\n<!-- ✅ Semantic: meaningful -->\n<header>\n  <nav>...</nav>\n</header>\n<main>...</main>\n<footer>...</footer>\n```\n\n### Page Structure Elements\n```html\n<header>   <!-- Site/section header -->\n<nav>      <!-- Navigation links -->\n<main>     <!-- Main unique content (only one per page) -->\n<article>  <!-- Self-contained content (blog post) -->\n<section>  <!-- Thematic grouping of content -->\n<aside>    <!-- Sidebar / related content -->\n<footer>   <!-- Site/section footer -->\n```\n\n### Content Elements\n```html\n<figure>    <!-- Image with caption -->\n  <img src="chart.png" alt="Sales chart">\n  <figcaption>Q3 Sales Data</figcaption>\n</figure>\n\n<time datetime="2024-01-15">January 15, 2024</time>\n\n<mark>highlighted text</mark>\n\n<details>\n  <summary>Click to expand</summary>\n  <p>Hidden content revealed here.</p>\n</details>\n\n<address>\n  Contact: <a href="mailto:info@company.com">info@company.com</a>\n</address>\n```\n\n### A Complete Semantic Page\n```html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Tech Blog</title>\n</head>\n<body>\n  <header>\n    <h1>TechBlog</h1>\n    <nav>\n      <ul>\n        <li><a href="/">Home</a></li>\n        <li><a href="/about">About</a></li>\n      </ul>\n    </nav>\n  </header>\n\n  <main>\n    <article>\n      <header>\n        <h2>Understanding React Hooks</h2>\n        <time datetime="2024-06-01">June 1, 2024</time>\n      </header>\n      <section>\n        <h3>What are Hooks?</h3>\n        <p>Hooks are functions that...</p>\n      </section>\n    </article>\n\n    <aside>\n      <h3>Related Articles</h3>\n    </aside>\n  </main>\n\n  <footer>\n    <p>&copy; 2024 TechBlog</p>\n  </footer>\n</body>\n</html>\n```\n\n## Best Practices\n- Only ONE `<main>` per page\n- `<article>` should make sense if taken out of context\n- Use `<section>` with a heading\n- Nest `<nav>` inside `<header>` for main nav\n- Use `<figure>` for images that need captions\n\n## Common Mistakes\n- ❌ Using `<section>` instead of `<div>` everywhere\n- ❌ Nesting `<main>` inside `<article>`\n- ❌ Using `<article>` for UI components\n- ❌ Skipping heading levels (h1 → h3)\n\n## Interview Questions\n1. What is the difference between `<section>` and `<article>`?\n2. How many `<main>` elements should a page have?\n3. What is the `<figure>` element used for?\n4. Why is semantic HTML important for SEO?\n\n## Assignment\nConvert a div-soup layout into proper semantic HTML. Take a page with only `<div>` tags and replace every div with the appropriate semantic element.', 25, 1)

on conflict do nothing;

-- ============================================================
-- LESSONS — Track 3: JavaScript (Key lessons)
-- ============================================================

insert into public.lessons (id, module_id, title, content, duration_minutes, order_index) values

('l30101', 'm301', 'What is JavaScript?', E'# What is JavaScript?\n\n## Why This Topic Matters\nJavaScript is the only programming language that runs natively in browsers. It powers interactivity on 97% of websites. It also runs on servers (Node.js), mobile apps, and even IoT devices.\n\n## Learning Objectives\n- Understand what JavaScript is and where it runs\n- Know the difference between JS and HTML/CSS\n- Write your first JavaScript code\n- Understand the role of the JS engine\n\n## Core Concepts\n\n### The Web Trio\n| Technology | Role | Analogy |\n|---|---|---|\n| HTML | Structure | Skeleton |\n| CSS | Presentation | Clothes |\n| JavaScript | Behaviour | Muscles |\n\n### Where JavaScript Runs\n```\nBrowser: Chrome (V8), Firefox (SpiderMonkey), Safari (JavaScriptCore)\nServer:  Node.js (V8)\nMobile:  React Native\nDesktop: Electron\n```\n\n### Your First JavaScript\n```html\n<!DOCTYPE html>\n<html>\n<body>\n  <button onclick="greet()">Click Me</button>\n  <p id="output"></p>\n\n  <script>\n    function greet() {\n      document.getElementById("output").textContent = "Hello, World!";\n    }\n  </script>\n</body>\n</html>\n```\n\n### The Browser Console\nOpen DevTools → Console tab → type JavaScript directly:\n```javascript\nconsole.log("Hello!");\nconsole.log(2 + 2);\nconsole.log(typeof "hello");\n```\n\n## Best Practices\n- Keep JavaScript in separate `.js` files for large projects\n- Use `console.log()` for debugging\n- Link scripts with `defer` attribute: `<script src="app.js" defer>`\n\n## Common Mistakes\n- ❌ Mixing JavaScript with HTML (inline onclick handlers in large apps)\n- ❌ Not using `defer` — causes JS to block page loading\n\n## Interview Questions\n1. What is the difference between JavaScript and Java?\n2. What is a JavaScript engine?\n3. Where can JavaScript run besides browsers?\n\n## Assignment\nCreate an HTML page with a button that, when clicked, changes the background color of the page to a random color using JavaScript.', 15, 1),

('l30201', 'm302', 'Variables: var, let & const', E'# Variables: var, let & const\n\n## Why This Topic Matters\nVariables are containers for data. Choosing the right declaration (`var`, `let`, `const`) affects your code''s behavior in subtle but critical ways — especially in loops and async code.\n\n## Learning Objectives\n- Declare variables with var, let, and const\n- Understand scope differences\n- Know when to use each\n- Understand hoisting\n\n## Core Concepts\n\n### The Three Keywords\n```javascript\nvar name = "Alice";    // Old way — avoid in modern JS\nlet age = 25;          // Reassignable variable\nconst PI = 3.14159;    // Constant — cannot reassign\n```\n\n### Scope Comparison\n```javascript\n// var — function scoped (leaks out of blocks)\nif (true) {\n  var x = 10;\n}\nconsole.log(x); // 10 — var leaks!\n\n// let — block scoped (stays inside {})\nif (true) {\n  let y = 20;\n}\nconsole.log(y); // ReferenceError — y is not defined\n\n// const — block scoped + cannot reassign\nconst MAX = 100;\nMAX = 200; // TypeError: Assignment to constant variable\n```\n\n### Hoisting\n```javascript\n// var is hoisted (moved to top) but undefined\nconsole.log(a); // undefined (not error)\nvar a = 5;\n\n// let/const are NOT accessible before declaration\nconsole.log(b); // ReferenceError\nlet b = 5;\n```\n\n### const with Objects & Arrays\n```javascript\n// const prevents reassignment, NOT mutation\nconst user = { name: "Alice" };\nuser.name = "Bob";      // ✅ Allowed (mutation)\nuser = { name: "Bob" }; // ❌ Error (reassignment)\n\nconst numbers = [1, 2, 3];\nnumbers.push(4);    // ✅ Allowed\nnumbers = [5, 6];   // ❌ Error\n```\n\n## Best Practices\n- Default to `const` — change to `let` only if you need to reassign\n- Never use `var` in modern JavaScript\n- Use SCREAMING_SNAKE_CASE for true constants: `const MAX_SIZE = 100`\n- Declare variables at the top of their scope\n\n## Common Mistakes\n- ❌ Using `var` in loops with async code (famous closure bug)\n- ❌ Assuming `const` makes objects immutable\n- ❌ Declaring variables without any keyword (creates global!)\n\n## Interview Questions\n1. What is the difference between let and const?\n2. What is hoisting?\n3. Why should we avoid var?\n4. Can you change a property of a const object?\n\n## Assignment\nFix this code: it uses var inside a for loop and has a classic closure bug. Replace with let and explain why it works:\n```javascript\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Prints: 3 3 3 (wrong!)\n// Fix it to print: 0 1 2\n```', 25, 1),

('l30901', 'm309', 'Callbacks & the Event Loop', E'# Callbacks & the Event Loop\n\n## Why This Topic Matters\nJavaScript is single-threaded but handles thousands of async operations. Understanding the event loop is crucial for debugging async bugs and writing performant code.\n\n## Learning Objectives\n- Understand synchronous vs asynchronous code\n- Explain the call stack and event loop\n- Write and use callbacks\n- Identify callback hell and why to avoid it\n\n## Core Concepts\n\n### Synchronous vs Asynchronous\n```javascript\n// Synchronous — runs line by line\nconsole.log("1");\nconsole.log("2");\nconsole.log("3");\n// Output: 1, 2, 3\n\n// Asynchronous — non-blocking\nconsole.log("1");\nsetTimeout(() => console.log("2"), 1000);\nconsole.log("3");\n// Output: 1, 3, 2  ← 2 comes last!\n```\n\n### The Event Loop Model\n```\n┌─────────────┐     ┌──────────────┐\n│  Call Stack  │     │   Web APIs   │\n│             │     │  setTimeout  │\n│  main()     │     │  fetch()     │\n│  greet()    │     │  addEventListener │\n└─────────────┘     └──────┬───────┘\n                           ↓\n                    ┌──────────────┐\n                    │  Callback    │\n                    │  Queue       │\n                    └──────────────┘\n                    ← Event Loop checks if stack empty\n```\n\n### Callbacks\n```javascript\n// A callback is a function passed to another function\nfunction fetchData(callback) {\n  setTimeout(() => {\n    const data = { user: "Alice" };\n    callback(null, data); // Node-style: error first\n  }, 1000);\n}\n\nfetchData((error, data) => {\n  if (error) return console.error(error);\n  console.log(data.user); // "Alice"\n});\n```\n\n### Callback Hell\n```javascript\n// ❌ Callback hell — deeply nested, hard to read\ngetUser(userId, (err, user) => {\n  getOrders(user.id, (err, orders) => {\n    getOrderDetails(orders[0].id, (err, details) => {\n      getPayment(details.paymentId, (err, payment) => {\n        console.log(payment); // 4 levels deep!\n      });\n    });\n  });\n});\n\n// ✅ Solved with Promises (next lesson)\n```\n\n## Best Practices\n- Use error-first callbacks in Node.js style\n- Avoid more than 2 levels of callback nesting\n- Name your callback functions for better stack traces\n\n## Common Mistakes\n- ❌ Expecting async code to run synchronously\n- ❌ Not handling errors in callbacks\n- ❌ Creating callback hell\n\n## Interview Questions\n1. What is the JavaScript event loop?\n2. What is callback hell and how do you avoid it?\n3. Is JavaScript single-threaded? How does it handle async operations?\n\n## Assignment\nWrite a function `loadUserProfile(userId, callback)` that simulates: first fetching the user (500ms delay), then fetching their posts (300ms delay), then calling the callback with combined data. Handle errors properly.', 30, 1),

('l31001', 'm310', 'Promises', E'# Promises\n\n## Why This Topic Matters\nPromises solve callback hell and make async code readable. They are the foundation of modern JavaScript async patterns and are used in virtually every API call.\n\n## Learning Objectives\n- Create and consume Promises\n- Chain promises with .then()\n- Handle errors with .catch()\n- Use Promise.all() and Promise.race()\n\n## Core Concepts\n\n### Promise States\n```\n         ┌─── fulfilled (resolved) → .then()\nPending ─┤\n         └─── rejected              → .catch()\n```\n\n### Creating a Promise\n```javascript\nconst myPromise = new Promise((resolve, reject) => {\n  const success = true;\n\n  if (success) {\n    resolve({ data: "User data" });\n  } else {\n    reject(new Error("Failed to load"));\n  }\n});\n```\n\n### Consuming a Promise\n```javascript\nmyPromise\n  .then(data => {\n    console.log(data); // { data: "User data" }\n    return data.data.toUpperCase(); // Return for chaining\n  })\n  .then(upper => console.log(upper)) // "USER DATA"\n  .catch(error => console.error(error.message))\n  .finally(() => console.log("Done either way"));\n```\n\n### Promise.all — Run in Parallel\n```javascript\nconst p1 = fetch("/api/user");\nconst p2 = fetch("/api/orders");\nconst p3 = fetch("/api/settings");\n\n// Wait for ALL to complete\nPromise.all([p1, p2, p3])\n  .then(([user, orders, settings]) => {\n    console.log(user, orders, settings);\n  })\n  .catch(err => console.error("One failed:", err));\n```\n\n### Promise.allSettled — Don''t fail on error\n```javascript\nPromise.allSettled([p1, p2, p3])\n  .then(results => {\n    results.forEach(result => {\n      if (result.status === "fulfilled") {\n        console.log("Success:", result.value);\n      } else {\n        console.log("Failed:", result.reason);\n      }\n    });\n  });\n```\n\n## Best Practices\n- Always add `.catch()` to handle errors\n- Return values in `.then()` to enable chaining\n- Use `Promise.all()` for parallel independent requests\n- Don''t nest `.then()` — chain them instead\n\n## Common Mistakes\n- ❌ Forgetting to return in `.then()` (breaks chaining)\n- ❌ Not handling `.catch()`\n- ❌ Creating the Promise Constructor anti-pattern\n\n## Interview Questions\n1. What are the three states of a Promise?\n2. What is the difference between Promise.all and Promise.allSettled?\n3. How do Promises solve callback hell?\n\n## Assignment\nWrite a `getUserWithPosts(userId)` function using Promises that: fetches user by ID, then fetches their posts, then returns both. Handle errors gracefully. Use Promise.all where appropriate.', 25, 1),

('l31101', 'm311', 'Fetch API & HTTP Requests', E'# Fetch API & HTTP Requests\n\n## Why This Topic Matters\nFetch is how modern JavaScript apps communicate with APIs and servers. Understanding it is essential for building any dynamic web application.\n\n## Learning Objectives\n- Use fetch() to make HTTP requests\n- Handle JSON responses\n- Send POST, PUT, DELETE requests\n- Handle errors correctly\n- Use async/await with fetch\n\n## Core Concepts\n\n### Basic GET Request\n```javascript\n// fetch() returns a Promise\nfetch("https://jsonplaceholder.typicode.com/users/1")\n  .then(response => {\n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    return response.json(); // Parse JSON body\n  })\n  .then(user => console.log(user))\n  .catch(error => console.error("Fetch failed:", error));\n```\n\n### With async/await (cleaner)\n```javascript\nasync function getUser(id) {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n\n    if (!response.ok) {\n      throw new Error(`Error: ${response.status}`);\n    }\n\n    const user = await response.json();\n    return user;\n  } catch (error) {\n    console.error("Failed:", error);\n    throw error;\n  }\n}\n```\n\n### POST Request (sending data)\n```javascript\nasync function createUser(userData) {\n  const response = await fetch("/api/users", {\n    method: "POST",\n    headers: {\n      "Content-Type": "application/json",\n      "Authorization": `Bearer ${token}`,\n    },\n    body: JSON.stringify(userData),\n  });\n\n  const newUser = await response.json();\n  return newUser;\n}\n\n// Usage\ncreatUser({ name: "Alice", email: "alice@example.com" });\n```\n\n### DELETE Request\n```javascript\nasync function deleteUser(id) {\n  const response = await fetch(`/api/users/${id}`, {\n    method: "DELETE",\n  });\n\n  if (!response.ok) throw new Error("Delete failed");\n  return true;\n}\n```\n\n### Response Methods\n```javascript\nresponse.json()    // Parse JSON body\nresponse.text()    // Get body as text\nresponse.blob()    // Get binary data (images, files)\nresponse.ok        // true if status 200-299\nresponse.status    // Status code: 200, 404, etc.\nresponse.headers   // Response headers\n```\n\n## Best Practices\n- Always check `response.ok` before parsing\n- Always use try/catch with async/await\n- Set `Content-Type: application/json` when sending JSON\n- Create a reusable API utility function\n\n## Common Mistakes\n- ❌ Not checking `response.ok` (fetch doesn''t throw on 404/500)\n- ❌ Forgetting to `await response.json()`\n- ❌ Not setting Content-Type header for POST requests\n\n## Interview Questions\n1. Why does fetch() not throw on 404 errors?\n2. What is the difference between response.json() and JSON.parse()?\n3. How do you send authentication headers with fetch?\n\n## Assignment\nBuild a simple user dashboard that: fetches a list of users from `https://jsonplaceholder.typicode.com/users`, displays them in a table, and on clicking a user loads their todos from `/users/{id}/todos`.', 30, 1)

on conflict do nothing;

-- ============================================================
-- LESSONS — Track 4: TypeScript (Key lessons)
-- ============================================================

insert into public.lessons (id, module_id, title, content, duration_minutes, order_index) values

('l40101', 'm401', 'Why TypeScript?', E'# Why TypeScript?\n\n## Why This Topic Matters\nTypeScript catches bugs at compile time that JavaScript only catches at runtime — often in production. Major companies (Microsoft, Google, Airbnb) migrated to TypeScript because it dramatically improves code quality at scale.\n\n## Learning Objectives\n- Understand what TypeScript adds to JavaScript\n- Set up a TypeScript project\n- Understand the TypeScript compilation process\n- Know when to use TypeScript\n\n## Core Concepts\n\n### TypeScript = JavaScript + Types\n```typescript\n// JavaScript — no protection\nfunction add(a, b) {\n  return a + b;\n}\nadd("5", 3); // "53" — silent bug!\n\n// TypeScript — compile-time protection\nfunction add(a: number, b: number): number {\n  return a + b;\n}\nadd("5", 3); // Error: Argument of type string is not assignable to number\n```\n\n### Setting Up TypeScript\n```bash\n# Install\nnpm install -g typescript\n\n# Check version\ntsc --version\n\n# Initialize project\nnpm init -y\nnpm install -D typescript\nnpx tsc --init  # Creates tsconfig.json\n```\n\n### Compilation\n```bash\ntsc app.ts          # Compile single file\ntsc                 # Compile whole project (uses tsconfig.json)\ntsc --watch         # Watch mode (recompile on save)\n```\n\n### tsconfig.json Basics\n```json\n{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "commonjs",\n    "strict": true,\n    "outDir": "./dist",\n    "rootDir": "./src"\n  }\n}\n```\n\n## Benefits of TypeScript\n| Benefit | Description |\n|---|---|\n| Catch bugs early | Type errors at compile time, not runtime |\n| Better IDE support | Autocomplete, refactoring, navigation |\n| Self-documenting | Types serve as documentation |\n| Safer refactoring | Change one type, IDE shows all affected code |\n| Team scalability | Easier to understand others'' code |\n\n## Best Practices\n- Enable `"strict": true` in tsconfig for maximum safety\n- Don''t overuse `any` — it defeats the purpose\n- Gradually migrate JS projects (rename .js to .ts one at a time)\n\n## Common Mistakes\n- ❌ Avoiding types by using `any` everywhere\n- ❌ Not enabling strict mode\n- ❌ Thinking TS replaces JS (it compiles TO JS)\n\n## Interview Questions\n1. What is TypeScript and why was it created?\n2. What happens when you compile TypeScript?\n3. What is the difference between TypeScript and JavaScript?\n4. What does "strict mode" do in TypeScript?\n\n## Assignment\nCreate a TypeScript function `calculateArea(shape, dimensions)` that accepts "circle", "rectangle", or "triangle" and appropriate dimensions, returning the area. Add proper type annotations.', 20, 1),

('l40601', 'm406', 'Generics', E'# Generics\n\n## Why This Topic Matters\nGenerics allow you to write reusable code that works with any type while maintaining type safety. They are the backbone of TypeScript library code and are used extensively in React, utility libraries, and APIs.\n\n## Learning Objectives\n- Understand why generics exist\n- Write generic functions\n- Write generic interfaces and classes\n- Use generic constraints\n- Understand common generic patterns\n\n## Core Concepts\n\n### The Problem Generics Solve\n```typescript\n// Without generics: must write same function for each type\nfunction getFirstNumber(arr: number[]): number { return arr[0]; }\nfunction getFirstString(arr: string[]): string { return arr[0]; }\n\n// With any: loses type info\nfunction getFirst(arr: any[]): any { return arr[0]; }\nconst first = getFirst([1, 2, 3]);\n// first is type "any" — no autocomplete, no safety\n\n// ✅ With generics: reusable AND type-safe\nfunction getFirst<T>(arr: T[]): T {\n  return arr[0];\n}\nconst num = getFirst([1, 2, 3]);       // type: number\nconst str = getFirst(["a", "b"]);      // type: string\n```\n\n### Generic Functions\n```typescript\n// T is a type parameter (placeholder)\nfunction identity<T>(value: T): T {\n  return value;\n}\n\n// Multiple type parameters\nfunction pair<K, V>(key: K, value: V): [K, V] {\n  return [key, value];\n}\n\nconst p = pair("name", 25); // type: [string, number]\n```\n\n### Generic Interfaces\n```typescript\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n}\n\ninterface User {\n  id: number;\n  name: string;\n}\n\n// Specific response types\ntype UserResponse = ApiResponse<User>;\ntype UsersResponse = ApiResponse<User[]>;\n\nconst response: UserResponse = {\n  data: { id: 1, name: "Alice" },\n  status: 200,\n  message: "OK"\n};\n```\n\n### Generic Constraints\n```typescript\n// T must have a "length" property\nfunction logLength<T extends { length: number }>(item: T): void {\n  console.log(item.length);\n}\n\nlogLength("hello");    // ✅ string has length\nlogLength([1, 2, 3]);  // ✅ array has length\nlogLength(42);         // ❌ Error: number has no length\n\n// T must be a key of object U\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst user = { name: "Alice", age: 25 };\ngetProperty(user, "name");   // ✅ type: string\ngetProperty(user, "email");  // ❌ Error: not a key\n```\n\n## Best Practices\n- Use meaningful names: `T` for general, `K/V` for key/value, `E` for element\n- Add constraints (`extends`) when you need to access properties\n- Don''t overuse generics — if a function only works with one type, just use that type\n\n## Common Mistakes\n- ❌ Using `any` instead of generics\n- ❌ Forgetting to constrain T when accessing properties\n- ❌ Making everything generic (overengineering)\n\n## Interview Questions\n1. What is a generic and why do we use them?\n2. What is a generic constraint?\n3. What is the difference between `Array<T>` and `T[]`?\n4. How do you write a generic function that accepts any object and returns one of its values?\n\n## Assignment\nImplement a generic `Stack<T>` class with methods: push(item), pop(): T | undefined, peek(): T | undefined, isEmpty(): boolean, size(): number. Test it with numbers and strings.', 30, 1)

on conflict do nothing;

-- ============================================================
-- LESSONS — Track 5: React (Key lessons)
-- ============================================================

insert into public.lessons (id, module_id, title, content, duration_minutes, order_index) values

('l50101', 'm501', 'What is React & Why Use It?', E'# What is React & Why Use It?\n\n## Why This Topic Matters\nReact is the most widely-used frontend library. Understanding its core philosophy (component model, virtual DOM, unidirectional data flow) makes everything else easier to learn.\n\n## Learning Objectives\n- Understand what React is and the problem it solves\n- Know the virtual DOM concept\n- Set up a React project with Vite\n- Render your first React component\n\n## Core Concepts\n\n### The Problem React Solves\n```javascript\n// ❌ Vanilla JS — manually update DOM\nfunction updateUserUI(user) {\n  document.getElementById("name").textContent = user.name;\n  document.getElementById("email").textContent = user.email;\n  document.getElementById("avatar").src = user.avatar;\n  // Every state change = manual DOM update = bugs!\n}\n\n// ✅ React — describe what UI should look like\nfunction UserCard({ user }) {\n  return (\n    <div>\n      <h2>{user.name}</h2>\n      <p>{user.email}</p>\n      <img src={user.avatar} alt={user.name} />\n    </div>\n  );\n}\n// React automatically updates DOM when user changes\n```\n\n### Virtual DOM\n```\nYour React Code\n     ↓\nVirtual DOM (JS object in memory)\n     ↓\nDiff algorithm (find what changed)\n     ↓\nMinimal real DOM updates\n```\n\n### Create React App vs Vite\n```bash\n# Vite (recommended — much faster)\nnpm create vite@latest my-app -- --template react\ncd my-app\nnpm install\nnpm run dev\n\n# Runs at http://localhost:5173\n```\n\n### Project Structure\n```\nmy-app/\n├── src/\n│   ├── App.jsx       ← Main component\n│   ├── main.jsx      ← Entry point\n│   └── index.css\n├── index.html\n└── package.json\n```\n\n### Your First Component\n```jsx\n// src/App.jsx\nfunction App() {\n  return (\n    <div>\n      <h1>Hello, React!</h1>\n      <p>My first React app</p>\n    </div>\n  );\n}\n\nexport default App;\n```\n\n## React Key Concepts\n| Concept | Description |\n|---|---|\n| Component | Reusable UI piece |\n| Props | Data passed to component |\n| State | Data managed inside component |\n| JSX | HTML-like syntax in JavaScript |\n| Virtual DOM | Fast in-memory representation |\n\n## Best Practices\n- One component per file\n- Component names start with capital letter\n- Keep components small and focused\n\n## Common Mistakes\n- ❌ Modifying DOM directly (bypasses React)\n- ❌ Using lowercase component names\n- ❌ Returning multiple root elements (use Fragment)\n\n## Interview Questions\n1. What is the virtual DOM and why is it fast?\n2. What is the difference between React and a framework like Angular?\n3. Why does React use JSX?\n\n## Assignment\nCreate a React app with a `ProfileCard` component that displays a name, role, department, and XP points. Make it visually styled with CSS.', 20, 1),

('l50401', 'm504', 'useState Hook', E'# useState Hook\n\n## Why This Topic Matters\nuseState is the most fundamental React hook. Every interactive React application uses it. Understanding how state updates trigger re-renders is critical to building correct React UIs.\n\n## Learning Objectives\n- Use useState to add state to components\n- Understand how state updates trigger re-renders\n- Update state correctly (immutability)\n- Handle state for forms, toggles, counters, arrays, objects\n\n## Core Concepts\n\n### Basic useState\n```jsx\nimport { useState } from "react";\n\nfunction Counter() {\n  // [currentValue, updateFunction] = useState(initialValue)\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n      <button onClick={() => setCount(count - 1)}>-</button>\n      <button onClick={() => setCount(0)}>Reset</button>\n    </div>\n  );\n}\n```\n\n### Functional Update (when new state depends on old)\n```jsx\n// ❌ Can cause bugs in async scenarios\nsetCount(count + 1);\n\n// ✅ Safe — always gets latest state\nsetCount(prevCount => prevCount + 1);\n```\n\n### Object State\n```jsx\nfunction UserForm() {\n  const [user, setUser] = useState({\n    name: "",\n    email: "",\n    age: 0\n  });\n\n  function handleChange(field, value) {\n    // MUST spread to preserve other fields\n    setUser(prev => ({ ...prev, [field]: value }));\n  }\n\n  return (\n    <form>\n      <input\n        value={user.name}\n        onChange={e => handleChange("name", e.target.value)}\n      />\n      <input\n        value={user.email}\n        onChange={e => handleChange("email", e.target.value)}\n      />\n    </form>\n  );\n}\n```\n\n### Array State\n```jsx\nfunction TodoList() {\n  const [todos, setTodos] = useState([]);\n  const [input, setInput] = useState("");\n\n  function addTodo() {\n    // ✅ Create new array — never mutate state directly\n    setTodos(prev => [...prev, { id: Date.now(), text: input, done: false }]);\n    setInput("");\n  }\n\n  function removeTodo(id) {\n    setTodos(prev => prev.filter(todo => todo.id !== id));\n  }\n\n  function toggleTodo(id) {\n    setTodos(prev =>\n      prev.map(todo =>\n        todo.id === id ? { ...todo, done: !todo.done } : todo\n      )\n    );\n  }\n\n  return (\n    <div>\n      <input value={input} onChange={e => setInput(e.target.value)} />\n      <button onClick={addTodo}>Add</button>\n      <ul>\n        {todos.map(todo => (\n          <li key={todo.id}>\n            <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>\n              {todo.text}\n            </span>\n            <button onClick={() => toggleTodo(todo.id)}>✓</button>\n            <button onClick={() => removeTodo(todo.id)}>✕</button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n```\n\n## Best Practices\n- Never mutate state directly: `state.push(item)` ❌ → `setState([...state, item])` ✅\n- Use functional updates when new state depends on old\n- Keep state as flat as possible\n- Lift state up when multiple components need it\n\n## Common Mistakes\n- ❌ `state.push(item); setState(state)` — mutation doesn''t trigger re-render\n- ❌ Calling setState during render\n- ❌ Setting state in a loop unnecessarily\n\n## Interview Questions\n1. What is the difference between state and props?\n2. Why should you never mutate state directly?\n3. What is the functional update form of setState and when should you use it?\n4. What triggers a re-render in React?\n\n## Assignment\nBuild a Shopping Cart component: display a list of products, allow adding items to cart, removing items, and updating quantities. Show total price. Use useState throughout.', 35, 1)

on conflict do nothing;

-- ============================================================
-- CHALLENGES — 50 Coding Challenges
-- ============================================================

insert into public.challenges (id, title, description, difficulty, category, points, xp_reward, starter_code_js, starter_code_ts, starter_code_python, test_cases, solution) values

('ch001', 'Two Sum',
'Given an array of integers `nums` and an integer `target`, return indices of the two numbers that add up to target. You may assume exactly one solution exists.',
'Easy', 'Arrays', 10, 50,
E'function twoSum(nums, target) {\n  // Your code here\n}',
E'function twoSum(nums: number[], target: number): number[] {\n  // Your code here\n  return [];\n}',
E'def two_sum(nums: list[int], target: int) -> list[int]:\n    # Your code here\n    pass',
'[{"input":{"nums":[2,7,11,15],"target":9},"expected":[0,1]},{"input":{"nums":[3,2,4],"target":6},"expected":[1,2]},{"input":{"nums":[3,3],"target":6},"expected":[0,1]}]',
E'// O(n) using hash map\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}'),

('ch002', 'Reverse a String',
'Write a function that takes a string and returns it reversed. Do not use the built-in reverse() method.',
'Easy', 'Strings', 10, 50,
E'function reverseString(str) {\n  // Your code here\n}',
E'function reverseString(str: string): string {\n  // Your code here\n  return "";\n}',
E'def reverse_string(s: str) -> str:\n    # Your code here\n    pass',
'[{"input":"hello","expected":"olleh"},{"input":"JavaScript","expected":"tpircSavaJ"},{"input":"","expected":""}]',
E'function reverseString(str) {\n  return str.split("").reduce((acc, char) => char + acc, "");\n}'),

('ch003', 'FizzBuzz',
'Write a function that returns "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, and the number as string otherwise.',
'Easy', 'Loops', 10, 50,
E'function fizzBuzz(n) {\n  // Return array from 1 to n\n}',
E'function fizzBuzz(n: number): string[] {\n  // Return array from 1 to n\n  return [];\n}',
E'def fizz_buzz(n: int) -> list[str]:\n    # Return list from 1 to n\n    pass',
'[{"input":15,"expected":["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]}]',
E'function fizzBuzz(n) {\n  return Array.from({length: n}, (_, i) => {\n    const num = i + 1;\n    if (num % 15 === 0) return "FizzBuzz";\n    if (num % 3 === 0) return "Fizz";\n    if (num % 5 === 0) return "Buzz";\n    return String(num);\n  });\n}'),

('ch004', 'Palindrome Check',
'Write a function that checks if a string is a palindrome (reads the same forwards and backwards). Ignore case.',
'Easy', 'Strings', 10, 50,
E'function isPalindrome(str) {\n  // Your code here\n}',
E'function isPalindrome(str: string): boolean {\n  // Your code here\n  return false;\n}',
E'def is_palindrome(s: str) -> bool:\n    # Your code here\n    pass',
'[{"input":"racecar","expected":true},{"input":"hello","expected":false},{"input":"A man a plan a canal Panama","expected":true}]',
E'function isPalindrome(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}'),

('ch005', 'Find Maximum in Array',
'Write a function that finds and returns the maximum value in an array of numbers without using Math.max().',
'Easy', 'Arrays', 10, 50,
E'function findMax(nums) {\n  // Your code here\n}',
E'function findMax(nums: number[]): number {\n  // Your code here\n  return 0;\n}',
E'def find_max(nums: list[int]) -> int:\n    # Your code here\n    pass',
'[{"input":[3,1,4,1,5,9,2,6],"expected":9},{"input":[-5,-1,-10],"expected":-1},{"input":[42],"expected":42}]',
E'function findMax(nums) {\n  return nums.reduce((max, num) => num > max ? num : max, nums[0]);\n}'),

('ch006', 'Count Vowels',
'Write a function that counts the number of vowels (a, e, i, o, u) in a string. Case insensitive.',
'Easy', 'Strings', 10, 50,
E'function countVowels(str) {\n  // Your code here\n}',
E'function countVowels(str: string): number {\n  return 0;\n}',
E'def count_vowels(s: str) -> int:\n    pass',
'[{"input":"Hello World","expected":3},{"input":"rhythm","expected":0},{"input":"aeiou","expected":5}]',
E'function countVowels(str) {\n  return (str.match(/[aeiou]/gi) || []).length;\n}'),

('ch007', 'Remove Duplicates',
'Given an array, return a new array with all duplicates removed while preserving order.',
'Easy', 'Arrays', 10, 50,
E'function removeDuplicates(arr) {\n  // Your code here\n}',
E'function removeDuplicates<T>(arr: T[]): T[] {\n  return [];\n}',
E'def remove_duplicates(arr: list) -> list:\n    pass',
'[{"input":[1,2,2,3,3,4],"expected":[1,2,3,4]},{"input":["a","b","a","c"],"expected":["a","b","c"]}]',
E'function removeDuplicates(arr) {\n  return [...new Set(arr)];\n}'),

('ch008', 'Fibonacci Sequence',
'Write a function that returns the nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).',
'Easy', 'Recursion', 15, 75,
E'function fibonacci(n) {\n  // Your code here\n}',
E'function fibonacci(n: number): number {\n  return 0;\n}',
E'def fibonacci(n: int) -> int:\n    pass',
'[{"input":0,"expected":0},{"input":1,"expected":1},{"input":10,"expected":55},{"input":20,"expected":6765}]',
E'function fibonacci(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}'),

('ch009', 'Flatten Array',
'Write a function that flattens a nested array to any depth.',
'Medium', 'Arrays', 20, 100,
E'function flattenArray(arr) {\n  // Your code here\n}',
E'function flattenArray(arr: any[]): any[] {\n  return [];\n}',
E'def flatten_array(arr: list) -> list:\n    pass',
'[{"input":[1,[2,3],[4,[5,6]]],"expected":[1,2,3,4,5,6]},{"input":[[[1]],2],"expected":[1,2]}]',
E'function flattenArray(arr) {\n  return arr.reduce((flat, item) =>\n    flat.concat(Array.isArray(item) ? flattenArray(item) : item), []);\n}'),

('ch010', 'Valid Parentheses',
'Given a string containing only (){}[], determine if the input string is valid. Brackets must be closed in the correct order.',
'Medium', 'Stack', 20, 100,
E'function isValid(s) {\n  // Your code here\n}',
E'function isValid(s: string): boolean {\n  return false;\n}',
E'def is_valid(s: str) -> bool:\n    pass',
'[{"input":"()","expected":true},{"input":"()[]{}","expected":true},{"input":"(]","expected":false},{"input":"([)]","expected":false},{"input":"{[]}","expected":true}]',
E'function isValid(s) {\n  const stack = [];\n  const map = { ")": "(", "]": "[", "}": "{" };\n  for (const c of s) {\n    if ("([{".includes(c)) stack.push(c);\n    else if (stack.pop() !== map[c]) return false;\n  }\n  return stack.length === 0;\n}'),

('ch011', 'Group Anagrams',
'Given an array of strings, group the anagrams together. Return an array of groups.',
'Medium', 'Strings', 25, 125,
E'function groupAnagrams(strs) {\n  // Your code here\n}',
E'function groupAnagrams(strs: string[]): string[][] {\n  return [];\n}',
E'def group_anagrams(strs: list[str]) -> list[list[str]]:\n    pass',
'[{"input":["eat","tea","tan","ate","nat","bat"],"expected":[["eat","tea","ate"],["tan","nat"],["bat"]]}]',
E'function groupAnagrams(strs) {\n  const map = new Map();\n  for (const str of strs) {\n    const key = [...str].sort().join("");\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(str);\n  }\n  return [...map.values()];\n}'),

('ch012', 'Binary Search',
'Implement binary search on a sorted array. Return the index if found, -1 otherwise.',
'Medium', 'Searching', 20, 100,
E'function binarySearch(nums, target) {\n  // Your code here\n}',
E'function binarySearch(nums: number[], target: number): number {\n  return -1;\n}',
E'def binary_search(nums: list[int], target: int) -> int:\n    pass',
'[{"input":{"nums":[-1,0,3,5,9,12],"target":9},"expected":4},{"input":{"nums":[-1,0,3,5,9,12],"target":2},"expected":-1}]',
E'function binarySearch(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    else if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}'),

('ch013', 'Merge Two Sorted Arrays',
'Merge two sorted arrays into one sorted array.',
'Medium', 'Arrays', 20, 100,
E'function mergeSorted(a, b) {\n  // Your code here\n}',
E'function mergeSorted(a: number[], b: number[]): number[] {\n  return [];\n}',
E'def merge_sorted(a: list[int], b: list[int]) -> list[int]:\n    pass',
'[{"input":{"a":[1,3,5],"b":[2,4,6]},"expected":[1,2,3,4,5,6]},{"input":{"a":[],"b":[1]},"expected":[1]}]',
E'function mergeSorted(a, b) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < a.length && j < b.length) {\n    if (a[i] <= b[j]) result.push(a[i++]);\n    else result.push(b[j++]);\n  }\n  return [...result, ...a.slice(i), ...b.slice(j)];\n}'),

('ch014', 'Longest Common Prefix',
'Find the longest common prefix string amongst an array of strings.',
'Medium', 'Strings', 20, 100,
E'function longestCommonPrefix(strs) {\n  // Your code here\n}',
E'function longestCommonPrefix(strs: string[]): string {\n  return "";\n}',
E'def longest_common_prefix(strs: list[str]) -> str:\n    pass',
'[{"input":["flower","flow","flight"],"expected":"fl"},{"input":["dog","racecar","car"],"expected":""},{"input":["interview","interstellar","internal"],"expected":"inter"}]',
E'function longestCommonPrefix(strs) {\n  if (!strs.length) return "";\n  let prefix = strs[0];\n  for (let i = 1; i < strs.length; i++) {\n    while (!strs[i].startsWith(prefix)) {\n      prefix = prefix.slice(0, -1);\n      if (!prefix) return "";\n    }\n  }\n  return prefix;\n}'),

('ch015', 'Maximum Subarray (Kadane''s)',
'Find the contiguous subarray with the largest sum.',
'Medium', 'Arrays', 25, 125,
E'function maxSubArray(nums) {\n  // Your code here (Kadane\'s algorithm)\n}',
E'function maxSubArray(nums: number[]): number {\n  return 0;\n}',
E'def max_sub_array(nums: list[int]) -> int:\n    pass',
'[{"input":[-2,1,-3,4,-1,2,1,-5,4],"expected":6},{"input":[1],"expected":1},{"input":[-1,-2,-3],"expected":-1}]',
E'function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}'),

('ch016', 'Debounce Function',
'Implement a debounce function that delays the execution of a function until after a specified wait time has elapsed since the last call.',
'Medium', 'JavaScript', 25, 125,
E'function debounce(fn, delay) {\n  // Your code here\n}',
E'function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {\n  return () => {};\n}',
E'import time\ndef debounce(fn, delay):\n    # Your code here\n    pass',
'[{"input":"debounce should delay function calls","expected":"function"}]',
E'function debounce(fn, delay) {\n  let timeoutId;\n  return function(...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}'),

('ch017', 'Deep Clone Object',
'Write a function that creates a deep copy of an object (no shared references).',
'Medium', 'JavaScript', 25, 125,
E'function deepClone(obj) {\n  // Do not use JSON.parse/JSON.stringify\n}',
E'function deepClone<T>(obj: T): T {\n  return obj;\n}',
E'def deep_clone(obj):\n    pass',
'[{"input":{"a":1,"b":{"c":2}},"expected":{"a":1,"b":{"c":2}}}]',
E'function deepClone(obj) {\n  if (obj === null || typeof obj !== "object") return obj;\n  if (Array.isArray(obj)) return obj.map(deepClone);\n  return Object.fromEntries(\n    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])\n  );\n}'),

('ch018', 'Promise.all Implementation',
'Implement your own version of Promise.all without using the built-in one.',
'Hard', 'JavaScript', 30, 150,
E'function myPromiseAll(promises) {\n  // Your code here\n}',
E'function myPromiseAll<T>(promises: Promise<T>[]): Promise<T[]> {\n  return Promise.resolve([]);\n}',
E'# Python equivalent using asyncio\nasync def my_gather(*coros):\n    pass',
'[{"input":"array of promises","expected":"all resolved values"}]',
E'function myPromiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    const results = [];\n    let completed = 0;\n    if (promises.length === 0) return resolve([]);\n    promises.forEach((promise, i) => {\n      Promise.resolve(promise)\n        .then(value => {\n          results[i] = value;\n          if (++completed === promises.length) resolve(results);\n        })\n        .catch(reject);\n    });\n  });\n}'),

('ch019', 'LRU Cache',
'Design a Least Recently Used (LRU) cache that supports get and put operations in O(1) time.',
'Hard', 'Algorithms', 40, 200,
E'class LRUCache {\n  constructor(capacity) {\n    // Your code here\n  }\n  get(key) {}\n  put(key, value) {}\n}',
E'class LRUCache {\n  constructor(private capacity: number) {}\n  get(key: number): number { return -1; }\n  put(key: number, value: number): void {}\n}',
E'class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass',
'[{"operations":["LRUCache","put","put","get","put","get","put","get","get","get"],"args":[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]],"expected":[null,null,null,1,-1,null,null,-1,3,4]}]',
E'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const value = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, value);\n    return value;\n  }\n  put(key, value) {\n    this.cache.delete(key);\n    if (this.cache.size >= this.capacity) {\n      this.cache.delete(this.cache.keys().next().value);\n    }\n    this.cache.set(key, value);\n  }\n}'),

('ch020', 'Merge Sort Implementation',
'Implement the merge sort algorithm.',
'Hard', 'Sorting', 30, 150,
E'function mergeSort(arr) {\n  // Your code here\n}',
E'function mergeSort(arr: number[]): number[] {\n  return arr;\n}',
E'def merge_sort(arr: list[int]) -> list[int]:\n    pass',
'[{"input":[38,27,43,3,9,82,10],"expected":[3,9,10,27,38,43,82]}]',
E'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  const result = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) result.push(left[i++]);\n    else result.push(right[j++]);\n  }\n  return [...result, ...left.slice(i), ...right.slice(j)];\n}')

on conflict do nothing;

-- Add xp_reward column if it doesn't exist
alter table public.challenges add column if not exists xp_reward integer default 50;

-- ============================================================
-- QUIZZES — One per major course
-- ============================================================

insert into public.quizzes (id, title, description, category, difficulty, time_limit_minutes, pass_percentage) values
('q001', 'HTML5 Fundamentals Quiz', 'Test your knowledge of HTML5 elements, forms, and semantic markup', 'Frontend', 'Beginner', 20, 70),
('q002', 'CSS3 Mastery Quiz', 'Test your understanding of CSS selectors, box model, flexbox, and grid', 'Frontend', 'Beginner', 20, 70),
('q003', 'JavaScript ES6+ Quiz', 'Test your JavaScript knowledge including ES6+ features', 'Frontend', 'Intermediate', 25, 70),
('q004', 'TypeScript Quiz', 'Test your TypeScript types, generics, and advanced features', 'Frontend', 'Intermediate', 20, 70),
('q005', 'React JS Quiz', 'Test your React knowledge — hooks, components, state management', 'Frontend', 'Intermediate', 25, 70),
('q006', 'Node.js Quiz', 'Test your Node.js runtime, event loop, and async knowledge', 'Backend', 'Intermediate', 20, 70),
('q007', 'REST API Design Quiz', 'Test your API design, HTTP methods, and status codes knowledge', 'Backend', 'Intermediate', 20, 70),
('q008', 'Database SQL Quiz', 'Test your SQL, joins, indexes, and database design knowledge', 'Backend', 'Intermediate', 25, 70),
('q009', 'Git & GitHub Quiz', 'Test your version control and collaboration workflow knowledge', 'DevOps', 'Beginner', 15, 70),
('q010', 'System Design Quiz', 'Test your system design, scalability, and architecture knowledge', 'System Design', 'Advanced', 30, 70)
on conflict do nothing;

-- ============================================================
-- QUIZ QUESTIONS
-- ============================================================

insert into public.quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index) values

-- HTML5 Quiz Questions
('q001', 'Which HTML5 element is used for the main navigation of a website?',
'["<navigation>", "<nav>", "<menu>", "<navbar>"]', 1,
'<nav> is the semantic HTML5 element for navigation links.', 1),

('q001', 'What does the "!DOCTYPE html" declaration do?',
'["Adds a comment", "Tells the browser this is HTML5", "Links a CSS file", "Creates a header"]', 1,
'<!DOCTYPE html> tells the browser to render the page in HTML5 standards mode.', 2),

('q001', 'Which attribute makes a form input mandatory?',
'["mandatory", "compulsory", "required", "validate"]', 2,
'The "required" attribute prevents form submission if the field is empty.', 3),

('q001', 'What is the correct HTML element for the largest heading?',
'["<heading>", "<h6>", "<head>", "<h1>"]', 3,
'<h1> represents the largest and most important heading on the page.', 4),

('q001', 'Which input type opens a date picker in modern browsers?',
'["type=calendar", "type=date", "type=datetime", "type=picker"]', 1,
'<input type="date"> shows a native date picker in modern browsers.', 5),

('q001', 'What is the purpose of the alt attribute on an <img> tag?',
'["Sets image title", "Provides text if image fails to load", "Links to another image", "Sets image size"]', 1,
'alt text is displayed when the image cannot load and is read by screen readers for accessibility.', 6),

('q001', 'Which HTML5 element represents self-contained content like a blog post?',
'["<section>", "<div>", "<article>", "<content>"]', 2,
'<article> represents self-contained content that could stand alone, like a blog post or news article.', 7),

('q001', 'What is the difference between <section> and <div>?',
'["No difference", "<section> is semantic with meaning, <div> is generic", "<div> is newer", "<section> requires a heading attribute"]', 1,
'<section> has semantic meaning (a thematic grouping), while <div> is a generic container with no meaning.', 8),

-- JavaScript Quiz Questions
('q003', 'What is the output of: console.log(typeof null)?',
'["null", "undefined", "object", "string"]', 2,
'typeof null returns "object" — this is a well-known bug in JavaScript that was never fixed for backwards compatibility.', 1),

('q003', 'Which keyword creates a block-scoped variable that cannot be reassigned?',
'["var", "let", "const", "static"]', 2,
'const creates a block-scoped binding that cannot be reassigned.', 2),

('q003', 'What does the spread operator (...) do?',
'["Creates a new thread", "Spreads iterable elements into individual elements", "Declares rest parameters only", "Merges two functions"]', 1,
'The spread operator expands an iterable (array, string) into individual elements.', 3),

('q003', 'What is a closure in JavaScript?',
'["A way to close browser windows", "A function that has access to its outer scope even after the outer function has returned", "A method to end loops", "An error handling technique"]', 1,
'A closure is a function that retains access to variables from its outer lexical scope even after the outer function has finished executing.', 4),

('q003', 'What does Promise.all() do?',
'["Runs promises sequentially", "Returns first resolved promise", "Waits for all promises to resolve, rejects if any reject", "Ignores rejections"]', 2,
'Promise.all() takes an array of promises and returns a promise that resolves when ALL promises resolve, or rejects when ANY promise rejects.', 5),

('q003', 'What is the output of: [1,2,3].map(x => x * 2)?',
'["[1,2,3]", "[2,4,6]", "6", "undefined"]', 1,
'Array.map() creates a new array with each element transformed by the callback.', 6),

-- TypeScript Quiz Questions
('q004', 'What does the "any" type do in TypeScript?',
'["Makes variable immutable", "Disables type checking for that variable", "Converts to string", "Makes it optional"]', 1,
'The "any" type opts out of type checking — it accepts any value. Should be avoided as it defeats TypeScript''s purpose.', 1),

('q004', 'What is the difference between interface and type alias in TypeScript?',
'["No difference", "interface can be extended/merged, type alias cannot be re-opened", "type is for primitives only", "interface is deprecated"]', 1,
'Interfaces support declaration merging and are more extensible. Type aliases support unions and computed types.', 2),

('q004', 'What is a Generic in TypeScript?',
'["A base class", "A type that works with any data type while maintaining type safety", "A utility function", "A module pattern"]', 1,
'Generics allow you to write reusable code that works with different types while keeping type safety.', 3),

('q004', 'What does the "?" mean in: function greet(name?: string)?',
'["Required parameter", "Optional parameter", "Default parameter", "Rest parameter"]', 1,
'The ? after a parameter name makes it optional — it can be undefined.', 4),

-- React Quiz Questions
('q005', 'What is the Virtual DOM?',
'["A database for React", "An in-memory representation of the real DOM used for efficient updates", "A testing tool", "A CSS framework"]', 1,
'The Virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to calculate minimal DOM updates.', 1),

('q005', 'When does useEffect run with an empty dependency array []?',
'["On every render", "Only on mount (once)", "Never", "Only on unmount"]', 1,
'useEffect with [] runs only once after the initial render, similar to componentDidMount in class components.', 2),

('q005', 'What is the correct way to update an array in state?',
'["state.push(item)", "setState([...state, item])", "state[state.length] = item", "state.append(item)"]', 1,
'You must never mutate state directly. Create a new array with the spread operator to trigger a re-render.', 3),

('q005', 'What is prop drilling?',
'["Drilling holes in components", "Passing props through many intermediate components to reach a deeply nested component", "A React performance issue", "A testing pattern"]', 1,
'Prop drilling occurs when you pass props through multiple intermediate components that don''t need them, just to reach a deeply nested component.', 4),

('q005', 'What hook do you use for side effects in React?',
'["useState", "useEffect", "useContext", "useRef"]', 1,
'useEffect is used for side effects like data fetching, subscriptions, and DOM manipulation.', 5),

-- Database Quiz Questions
('q008', 'What does SQL stand for?',
'["Structured Query Language", "Simple Query Logic", "Standard Question Language", "Structured Question List"]', 0,
'SQL stands for Structured Query Language — the standard language for relational databases.', 1),

('q008', 'Which SQL clause filters rows AFTER grouping?',
'["WHERE", "HAVING", "FILTER", "GROUP BY"]', 1,
'HAVING filters rows after GROUP BY, whereas WHERE filters before grouping.', 2),

('q008', 'What type of JOIN returns only matching rows from both tables?',
'["LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "INNER JOIN"]', 3,
'INNER JOIN returns only rows where there is a match in BOTH tables.', 3),

('q008', 'What is an index in a database?',
'["A table of contents", "A data structure that speeds up data retrieval at the cost of storage", "A primary key", "A foreign key constraint"]', 1,
'An index is a data structure (usually a B-tree) that allows the database to find rows quickly without scanning the entire table.', 4),

('q008', 'What does ACID stand for in database transactions?',
'["Atomicity, Consistency, Isolation, Durability", "Accuracy, Completeness, Integrity, Data", "Async, Concurrent, Indexed, Dynamic", "Access, Control, Index, Delete"]', 0,
'ACID ensures reliable database transactions: Atomic (all or nothing), Consistent (valid state), Isolated (no interference), Durable (persisted).', 5),

-- Git Quiz Questions
('q009', 'What command creates a new branch and switches to it?',
'["git branch new-branch", "git checkout -b new-branch", "git create new-branch", "git switch new-branch"]', 1,
'git checkout -b creates a new branch AND switches to it in one command.', 1),

('q009', 'What does git rebase do?',
'["Merges two branches", "Moves or replays commits onto a different base commit", "Deletes a branch", "Creates a tag"]', 1,
'Rebase replays your commits on top of another branch, creating a linear history. Unlike merge, it rewrites commit history.', 2),

('q009', 'What is the purpose of .gitignore?',
'["Ignore git commands", "Specify files/folders that should not be tracked by git", "Speed up git", "Enable git"]', 1,
'.gitignore tells git which files to exclude from version control (e.g., node_modules, .env, build files).', 3),

('q009', 'What command shows the commit history?',
'["git status", "git history", "git log", "git show"]', 2,
'git log displays the commit history with commit hashes, authors, dates, and messages.', 4),

-- System Design Quiz
('q010', 'What does CAP theorem state?',
'["You can have all three: Consistency, Availability, Partition tolerance", "A distributed system can guarantee at most two of: Consistency, Availability, Partition tolerance", "CAP is for database design only", "CAP applies only to SQL databases"]', 1,
'CAP theorem (Brewer''s theorem) states that in a distributed system, you can only guarantee two out of three: Consistency, Availability, and Partition tolerance.', 1),

('q010', 'What is a load balancer?',
'["A tool to measure server load", "A system that distributes incoming requests across multiple servers", "A caching system", "A database replication tool"]', 1,
'A load balancer distributes incoming network traffic across multiple servers to ensure no single server bears too much demand.', 2),

('q010', 'What is horizontal scaling?',
'["Making a server more powerful (bigger CPU/RAM)", "Adding more servers to handle load", "Optimizing database queries", "Adding more RAM to one server"]', 1,
'Horizontal scaling (scale out) means adding more machines. Vertical scaling (scale up) means making existing machines more powerful.', 3),

('q010', 'What is the purpose of a CDN?',
'["Content Database Network — stores data", "Content Delivery Network — serves static assets from servers close to users", "Central DNS Node", "Continuous Deployment Network"]', 1,
'A CDN (Content Delivery Network) caches static assets (images, JS, CSS) at edge servers worldwide so users get content from a nearby server.', 4),

('q010', 'Which consistency model allows reading stale data in exchange for better availability?',
'["Strong consistency", "Eventual consistency", "Linearizability", "Serializability"]', 1,
'Eventual consistency means all nodes will eventually have the same data, but reads may temporarily return stale values. Used in systems like DNS and Cassandra.', 5)

on conflict do nothing;

-- ============================================================
-- CERTIFICATIONS
-- ============================================================

insert into public.certifications (id, title, description, course_id, requirements) values
('cert001', 'HTML5 Developer', 'Certified in semantic HTML5, forms, accessibility, and web standards', 'c1000000-0000-0000-0000-000000000001', '{"min_xp": 200, "quiz_score": 70, "lessons_completed": 10}'),
('cert002', 'CSS Professional', 'Certified in CSS3, Flexbox, Grid, animations, and Tailwind CSS', 'c1000000-0000-0000-0000-000000000002', '{"min_xp": 300, "quiz_score": 70, "lessons_completed": 15}'),
('cert003', 'JavaScript Developer', 'Certified in modern JavaScript ES6+, async programming, and DOM', 'c1000000-0000-0000-0000-000000000003', '{"min_xp": 400, "quiz_score": 75, "lessons_completed": 20}'),
('cert004', 'TypeScript Expert', 'Certified in TypeScript types, generics, and advanced patterns', 'c1000000-0000-0000-0000-000000000004', '{"min_xp": 350, "quiz_score": 75, "lessons_completed": 15}'),
('cert005', 'React JS Professional', 'Certified in React components, hooks, state management, and testing', 'c1000000-0000-0000-0000-000000000005', '{"min_xp": 500, "quiz_score": 75, "lessons_completed": 20}'),
('cert006', 'Node.js Backend Developer', 'Certified in Node.js, Express, REST APIs, and backend architecture', 'c1000000-0000-0000-0000-000000000007', '{"min_xp": 450, "quiz_score": 75, "lessons_completed": 18}'),
('cert007', 'Full Stack Developer', 'Certified full stack developer with frontend and backend expertise', null, '{"min_xp": 2000, "quiz_score": 80, "certifications_required": ["cert001","cert003","cert005","cert006"]}')
on conflict do nothing;
