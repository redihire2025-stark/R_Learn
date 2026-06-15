-- ============================================================
-- R-Learn: Full Stack Development Learning Path — Seed Data
-- Paste into Supabase Dashboard > SQL Editor and run
-- This adds 33 courses, 24 challenges, 15 quizzes, 12 certs
-- (does NOT duplicate the 8 existing courses)
-- ============================================================

-- ============================================================
-- COURSES — Frontend Development
-- ============================================================

insert into public.courses (title, description, category, difficulty, thumbnail_gradient, total_lessons, estimated_hours, skills, xp_reward) values

-- Frontend (new courses only — existing: HTML5, CSS3 & Tailwind, JS ES6+, TS, React)
('Responsive Design & Media Queries',
 'Master responsive web design with mobile-first methodology, media queries, viewport units, fluid typography, and cross-device testing strategies.',
 'Frontend', 'beginner', 'from-pink-400 to-rose-500', 18, 8,
 ARRAY['Responsive Design','Media Queries','Mobile-First','Viewport Units','Fluid Typography'], 180),

('Flexbox & CSS Grid Mastery',
 'Deep dive into modern CSS layout systems — Flexbox for 1D layouts and CSS Grid for complex 2D layouts, with real-world project patterns.',
 'Frontend', 'beginner', 'from-violet-400 to-purple-600', 22, 10,
 ARRAY['Flexbox','CSS Grid','Layout Patterns','CSS Architecture'], 220),

('Next.js Full Stack Framework',
 'Build production-grade applications with Next.js — App Router, Server Components, SSR, SSG, ISR, API routes, middleware, and deployment.',
 'Frontend', 'advanced', 'from-slate-700 to-slate-900', 48, 30,
 ARRAY['Next.js','SSR','SSG','App Router','Server Components','API Routes'], 600),

('Redux & State Management',
 'Master global state management with Redux Toolkit, RTK Query, middleware, Zustand, Jotai, and state machine patterns with XState.',
 'Frontend', 'intermediate', 'from-purple-500 to-indigo-600', 32, 16,
 ARRAY['Redux','Redux Toolkit','RTK Query','Zustand','State Machines'], 350),

('Tailwind CSS Utility-First Design',
 'Build stunning UIs rapidly with Tailwind CSS — utility classes, custom themes, plugins, responsive design, dark mode, and component patterns.',
 'Frontend', 'beginner', 'from-teal-400 to-cyan-500', 20, 8,
 ARRAY['Tailwind CSS','Utility-First CSS','Custom Themes','Dark Mode','Responsive Design'], 200),

('Material UI & Component Libraries',
 'Build professional interfaces with Material UI v5+ — theming, custom components, data grids, date pickers, and design system integration.',
 'Frontend', 'intermediate', 'from-blue-500 to-blue-700', 28, 14,
 ARRAY['Material UI','MUI','Theming','Component Libraries','Design Systems'], 300),

('Frontend Performance Optimization',
 'Optimize web performance — code splitting, lazy loading, bundle analysis, Core Web Vitals, image optimization, caching strategies, and profiling.',
 'Frontend', 'advanced', 'from-amber-500 to-orange-600', 24, 14,
 ARRAY['Performance','Code Splitting','Lazy Loading','Core Web Vitals','Bundle Optimization'], 450),

-- ============================================================
-- COURSES — Backend Development
-- ============================================================

-- (existing: Node.js Backend Development)
('Express.js Deep Dive',
 'Advanced Express.js — middleware chains, error handling, security (Helmet, CORS, rate limiting), file uploads, templating, and production best practices.',
 'Backend', 'intermediate', 'from-gray-500 to-gray-700', 30, 16,
 ARRAY['Express.js','Middleware','Security','Error Handling','File Uploads'], 320),

('REST API Design & Best Practices',
 'Design robust REST APIs — resource modeling, versioning, pagination, filtering, HATEOAS, documentation with Swagger/OpenAPI, and API testing.',
 'Backend', 'intermediate', 'from-emerald-400 to-green-600', 26, 14,
 ARRAY['REST APIs','API Design','Swagger','OpenAPI','Pagination','Versioning'], 300),

('GraphQL API Development',
 'Build flexible APIs with GraphQL — schemas, resolvers, mutations, subscriptions, Apollo Server, DataLoader, federation, and performance tuning.',
 'Backend', 'intermediate', 'from-pink-500 to-rose-600', 34, 18,
 ARRAY['GraphQL','Apollo Server','Schemas','Resolvers','Subscriptions','DataLoader'], 380),

('Authentication & Authorization',
 'Implement secure auth — JWT tokens, refresh tokens, OAuth 2.0, OpenID Connect, RBAC, session management, Passport.js, and security best practices.',
 'Backend', 'intermediate', 'from-red-500 to-red-700', 28, 16,
 ARRAY['JWT','OAuth 2.0','RBAC','Passport.js','Session Management','Security'], 350),

('WebSockets & Real-time Applications',
 'Build real-time features with WebSockets, Socket.io, Server-Sent Events — chat apps, live notifications, collaborative editing, and scaling strategies.',
 'Backend', 'advanced', 'from-indigo-500 to-purple-700', 22, 12,
 ARRAY['WebSockets','Socket.io','SSE','Real-time','Event-Driven'], 400),

('Microservices Architecture',
 'Design and build microservices — service decomposition, inter-service communication, API gateways, event-driven architecture, and containerization.',
 'Backend', 'advanced', 'from-cyan-600 to-blue-800', 36, 24,
 ARRAY['Microservices','API Gateway','Event-Driven','Service Mesh','gRPC'], 550),

-- ============================================================
-- COURSES — Databases
-- ============================================================

-- (existing: Databases & SQL)
('SQL Fundamentals',
 'Learn SQL from scratch — SELECT, JOINs, aggregations, subqueries, window functions, CTEs, indexing strategies, and query optimization.',
 'Database', 'beginner', 'from-blue-400 to-indigo-500', 24, 12,
 ARRAY['SQL','JOINs','Aggregations','Window Functions','CTEs','Indexing'], 250),

('PostgreSQL Advanced',
 'Master PostgreSQL — JSONB, full-text search, stored procedures, triggers, partitioning, replication, extensions (PostGIS, pgvector), and performance tuning.',
 'Database', 'intermediate', 'from-blue-600 to-indigo-800', 30, 18,
 ARRAY['PostgreSQL','JSONB','Full-Text Search','Stored Procedures','Partitioning','Replication'], 380),

('MongoDB & NoSQL',
 'Build with MongoDB — document modeling, aggregation pipeline, indexing, transactions, Atlas, Mongoose ODM, and when to choose NoSQL vs SQL.',
 'Database', 'intermediate', 'from-green-500 to-green-700', 28, 16,
 ARRAY['MongoDB','NoSQL','Mongoose','Aggregation Pipeline','Atlas','Document Modeling'], 320),

('Redis & In-Memory Data Stores',
 'Master Redis — data structures, caching patterns (cache-aside, write-through), pub/sub, Lua scripting, Redis Streams, and session management.',
 'Database', 'intermediate', 'from-red-500 to-rose-700', 20, 10,
 ARRAY['Redis','Caching','Pub/Sub','Data Structures','Session Management'], 280),

('Database Design & Modeling',
 'Design optimal databases — ER diagrams, normalization (1NF–BCNF), denormalization strategies, schema migration, and multi-tenant architectures.',
 'Database', 'intermediate', 'from-amber-500 to-yellow-600', 22, 12,
 ARRAY['Database Design','ER Diagrams','Normalization','Schema Migration','Data Modeling'], 300),

('ORM with Prisma & Sequelize',
 'Master Object-Relational Mapping — Prisma schema design, migrations, relations, raw queries, Sequelize models, and choosing the right ORM.',
 'Database', 'intermediate', 'from-violet-500 to-purple-700', 24, 12,
 ARRAY['Prisma','Sequelize','ORM','Migrations','Schema Design'], 280),

-- ============================================================
-- COURSES — DevOps & Deployment
-- ============================================================

-- (existing: Git & GitHub Mastery)
('Linux Command Line',
 'Master the Linux terminal — file system navigation, permissions, shell scripting (bash), process management, networking commands, and SSH.',
 'DevOps', 'beginner', 'from-slate-500 to-slate-700', 22, 10,
 ARRAY['Linux','Bash','Shell Scripting','SSH','File Permissions','Networking'], 200),

('Docker Containerization',
 'Containerize applications with Docker — Dockerfiles, images, volumes, networks, multi-stage builds, Docker Compose, and container best practices.',
 'DevOps', 'intermediate', 'from-blue-500 to-cyan-600', 28, 16,
 ARRAY['Docker','Containers','Docker Compose','Multi-Stage Builds','Volumes'], 350),

('Kubernetes Fundamentals',
 'Orchestrate containers with Kubernetes — pods, deployments, services, ingress, ConfigMaps, Secrets, Helm charts, and cluster management.',
 'DevOps', 'advanced', 'from-blue-600 to-blue-900', 36, 24,
 ARRAY['Kubernetes','Pods','Deployments','Services','Helm','Container Orchestration'], 500),

('CI/CD Pipelines',
 'Automate development workflows — GitHub Actions, GitLab CI, Jenkins, automated testing, deployment pipelines, and infrastructure as code basics.',
 'DevOps', 'intermediate', 'from-green-500 to-teal-600', 24, 14,
 ARRAY['CI/CD','GitHub Actions','Jenkins','Automated Testing','Deployment Pipelines'], 320),

('Nginx & Web Servers',
 'Configure production web servers — Nginx reverse proxy, load balancing, SSL/TLS, HTTP/2, caching headers, gzip compression, and security hardening.',
 'DevOps', 'intermediate', 'from-green-600 to-emerald-800', 18, 10,
 ARRAY['Nginx','Reverse Proxy','Load Balancing','SSL/TLS','HTTP/2','Caching'], 280),

('AWS Cloud Essentials',
 'Get started with AWS — EC2, S3, RDS, Lambda, CloudFront, IAM, VPC, Route 53, and building a production deployment architecture.',
 'DevOps', 'intermediate', 'from-orange-400 to-amber-600', 32, 20,
 ARRAY['AWS','EC2','S3','Lambda','RDS','CloudFront','IAM'], 400),

('Vercel & Netlify Deployment',
 'Deploy modern web apps — Vercel for Next.js, Netlify for static sites, serverless functions, edge functions, environment variables, and custom domains.',
 'DevOps', 'beginner', 'from-slate-800 to-gray-900', 14, 6,
 ARRAY['Vercel','Netlify','Deployment','Serverless Functions','Edge Functions'], 150),

-- ============================================================
-- COURSES — Testing
-- ============================================================

('Unit Testing with Jest',
 'Write reliable unit tests with Jest — matchers, mocks, spies, async testing, snapshot testing, code coverage, and test-driven development (TDD).',
 'Testing', 'intermediate', 'from-green-400 to-emerald-600', 24, 12,
 ARRAY['Jest','Unit Testing','TDD','Mocks','Code Coverage','Snapshot Testing'], 280),

('React Testing Library',
 'Test React components effectively — render, screen queries, user events, async testing, custom render wrappers, and testing hooks.',
 'Testing', 'intermediate', 'from-cyan-500 to-blue-600', 20, 10,
 ARRAY['React Testing Library','Component Testing','User Events','Accessibility Testing'], 260),

('Cypress End-to-End Testing',
 'Build robust E2E tests with Cypress — page interactions, network stubbing, visual regression, CI integration, and testing best practices.',
 'Testing', 'intermediate', 'from-emerald-500 to-green-700', 22, 12,
 ARRAY['Cypress','E2E Testing','Visual Regression','Network Stubbing','CI Integration'], 300),

('API Testing Strategies',
 'Test APIs thoroughly — Postman/Insomnia, automated API tests, contract testing, load testing with k6, and monitoring with health checks.',
 'Testing', 'intermediate', 'from-orange-500 to-red-600', 18, 10,
 ARRAY['API Testing','Postman','Contract Testing','Load Testing','k6'], 240),

-- ============================================================
-- COURSES — System Design
-- ============================================================

('System Design Fundamentals',
 'Design scalable systems — client-server architecture, horizontal vs vertical scaling, CAP theorem, database sharding, and system design interviews.',
 'System Design', 'advanced', 'from-indigo-600 to-violet-800', 30, 20,
 ARRAY['System Design','Scalability','CAP Theorem','Sharding','Architecture'], 500),

('Caching & Performance at Scale',
 'Master caching strategies — CDN, browser caching, application-level caching, cache invalidation, Redis patterns, and performance monitoring.',
 'System Design', 'advanced', 'from-red-600 to-orange-700', 22, 14,
 ARRAY['Caching','CDN','Cache Invalidation','Redis','Performance Monitoring'], 420),

('Distributed Systems Basics',
 'Understand distributed computing — consensus algorithms, message queues (RabbitMQ, Kafka), load balancers, event sourcing, CQRS, and fault tolerance.',
 'System Design', 'advanced', 'from-purple-700 to-indigo-900', 28, 20,
 ARRAY['Distributed Systems','Message Queues','Kafka','Load Balancing','Event Sourcing','CQRS'], 500);


-- ============================================================
-- CHALLENGES — Frontend
-- ============================================================

insert into public.challenges (title, description, difficulty, category, tags, starter_code_js, starter_code_ts, starter_code_py, test_cases, xp_reward, hints) values

('Debounce Function',
 'Implement a debounce function that delays invoking a callback until after a specified wait time has elapsed since the last invocation.',
 'Medium', 'JavaScript', ARRAY['closures','timers','functions'],
 'function debounce(fn, delay) {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'function debounce(fn: (...args: any[]) => void, delay: number): (...args: any[]) => void {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'def debounce(fn, delay):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
 '[{"id":1,"input":"call 3 times within 100ms, delay=200ms","expected":"function called once"},{"id":2,"input":"call once, delay=100ms, wait 150ms","expected":"function called once"}]',
 80,
 ARRAY['Use setTimeout and clearTimeout','Store the timer ID in a closure','Return a new function that resets the timer on each call']),

('Deep Clone Object',
 'Implement a function that creates a deep clone of a JavaScript object, handling nested objects, arrays, dates, and null values.',
 'Medium', 'JavaScript', ARRAY['objects','recursion','deep-copy'],
 'function deepClone(obj) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'const original = { a: 1, b: { c: 2, d: [3, 4] } };' || E'\n' || 'console.log(deepClone(original));',
 'function deepClone<T>(obj: T): T {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'def deep_clone(obj):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
 '[{"id":1,"input":"{\"a\":1,\"b\":{\"c\":2}}","expected":"{\"a\":1,\"b\":{\"c\":2}} (different reference)"},{"id":2,"input":"{\"arr\":[1,[2,3]]}","expected":"{\"arr\":[1,[2,3]]} (different reference)"}]',
 100,
 ARRAY['Check if the value is null or not an object for the base case','Handle arrays separately using Array.isArray()','Recursively clone each property']),

('Flatten Nested Array',
 'Write a function that flattens a deeply nested array into a single-level array. Do not use Array.prototype.flat().',
 'Easy', 'Arrays', ARRAY['arrays','recursion','iteration'],
 'function flatten(arr) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(flatten([1, [2, [3, [4]], 5]]));',
 'function flatten(arr: any[]): any[] {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'def flatten(arr):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
 '[{"id":1,"input":"[1,[2,[3,[4]],5]]","expected":"[1,2,3,4,5]"},{"id":2,"input":"[[1,2],[3,[4,[5]]]]","expected":"[1,2,3,4,5]"},{"id":3,"input":"[1,2,3]","expected":"[1,2,3]"}]',
 50,
 ARRAY['Use recursion — check if each element is an array','Alternatively use a stack-based iterative approach','concat or spread to combine results']),

('Promise.all Implementation',
 'Implement your own version of Promise.all that takes an array of promises and resolves when all complete or rejects on the first failure.',
 'Hard', 'JavaScript', ARRAY['promises','async','higher-order-functions'],
 'function promiseAll(promises) {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'function promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'async def promise_all(coroutines):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
 '[{"id":1,"input":"[resolve(1), resolve(2), resolve(3)]","expected":"[1,2,3]"},{"id":2,"input":"[resolve(1), reject(\"err\"), resolve(3)]","expected":"reject: err"},{"id":3,"input":"[]","expected":"[]"}]',
 120,
 ARRAY['Return a new Promise','Track resolved count and results array','Resolve when count equals the input length, reject immediately on any rejection']),

('Event Emitter',
 'Implement an EventEmitter class with on(event, callback), emit(event, ...args), and off(event, callback) methods.',
 'Medium', 'JavaScript', ARRAY['classes','design-patterns','events'],
 'class EventEmitter {' || E'\n' || '  constructor() {' || E'\n' || '    // Your code here' || E'\n' || '  }' || E'\n' || '  on(event, cb) {}' || E'\n' || '  emit(event, ...args) {}' || E'\n' || '  off(event, cb) {}' || E'\n' || '}',
 'class EventEmitter {' || E'\n' || '  on(event: string, cb: Function): void {}' || E'\n' || '  emit(event: string, ...args: any[]): void {}' || E'\n' || '  off(event: string, cb: Function): void {}' || E'\n' || '}',
 'class EventEmitter:' || E'\n' || '    def __init__(self):' || E'\n' || '        pass' || E'\n' || '    def on(self, event, cb):' || E'\n' || '        pass' || E'\n' || '    def emit(self, event, *args):' || E'\n' || '        pass' || E'\n' || '    def off(self, event, cb):' || E'\n' || '        pass',
 '[{"id":1,"input":"on(\"greet\", fn), emit(\"greet\", \"Hello\")","expected":"fn called with Hello"},{"id":2,"input":"on, off, emit","expected":"fn not called after off"}]',
 100,
 ARRAY['Use a Map or object to store event name -> array of callbacks','emit should iterate and call all registered callbacks','off should remove the specific callback from the array']),

-- ============================================================
-- CHALLENGES — Backend
-- ============================================================

('Build a Rate Limiter',
 'Implement a rate limiter using the sliding window algorithm. It should allow a maximum of N requests within a time window T.',
 'Hard', 'Backend', ARRAY['algorithms','system-design','middleware'],
 'class RateLimiter {' || E'\n' || '  constructor(maxRequests, windowMs) {' || E'\n' || '    // Your code here' || E'\n' || '  }' || E'\n' || '  isAllowed(clientId) {' || E'\n' || '    // return true/false' || E'\n' || '  }' || E'\n' || '}',
 'class RateLimiter {' || E'\n' || '  constructor(private maxRequests: number, private windowMs: number) {}' || E'\n' || '  isAllowed(clientId: string): boolean {' || E'\n' || '    // Your code here' || E'\n' || '    return false;' || E'\n' || '  }' || E'\n' || '}',
 'class RateLimiter:' || E'\n' || '    def __init__(self, max_requests, window_ms):' || E'\n' || '        pass' || E'\n' || '    def is_allowed(self, client_id):' || E'\n' || '        pass',
 '[{"id":1,"input":"max=3, window=1000ms, 3 requests","expected":"all allowed"},{"id":2,"input":"max=3, window=1000ms, 4 requests","expected":"4th rejected"},{"id":3,"input":"max=2, window=500ms, wait 600ms, request again","expected":"allowed after window"}]',
 150,
 ARRAY['Store timestamps of requests per client','Remove timestamps outside the current window','Compare count against maxRequests']),

('JWT Token Parser',
 'Write a function that decodes a JWT token (without verifying the signature) and returns the header and payload as objects.',
 'Easy', 'Backend', ARRAY['jwt','auth','encoding'],
 'function decodeJWT(token) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(decodeJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"));',
 'function decodeJWT(token: string): { header: object; payload: object } {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'def decode_jwt(token):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
 '[{"id":1,"input":"valid JWT","expected":"{header: {alg: \"HS256\", typ: \"JWT\"}, payload: {sub: \"1234567890\"}}"}]',
 60,
 ARRAY['A JWT has three parts separated by dots','Use atob() or Buffer.from() to decode Base64','Parse the decoded strings as JSON']),

('URL Shortener Logic',
 'Design a URL shortener: implement encode(longUrl) -> shortUrl and decode(shortUrl) -> longUrl using a hash map.',
 'Medium', 'Backend', ARRAY['hash-map','design','encoding'],
 'class URLShortener {' || E'\n' || '  constructor() {' || E'\n' || '    this.urlMap = new Map();' || E'\n' || '    this.counter = 0;' || E'\n' || '  }' || E'\n' || '  encode(longUrl) {}' || E'\n' || '  decode(shortUrl) {}' || E'\n' || '}',
 'class URLShortener {' || E'\n' || '  private urlMap = new Map<string, string>();' || E'\n' || '  private counter = 0;' || E'\n' || '  encode(longUrl: string): string {}' || E'\n' || '  decode(shortUrl: string): string {}' || E'\n' || '}',
 'class URLShortener:' || E'\n' || '    def __init__(self):' || E'\n' || '        self.url_map = {}' || E'\n' || '        self.counter = 0' || E'\n' || '    def encode(self, long_url):' || E'\n' || '        pass' || E'\n' || '    def decode(self, short_url):' || E'\n' || '        pass',
 '[{"id":1,"input":"encode(\"https://example.com/very/long/url\")","expected":"short string returned"},{"id":2,"input":"decode(encode(url))","expected":"original url"}]',
 80,
 ARRAY['Generate a unique short key using a counter or hash','Store both directions: short->long and long->short','Use base62 encoding for shorter URLs']),

('Middleware Chain',
 'Implement a middleware pipeline (like Express.js) where each middleware calls next() to pass control to the next function in the chain.',
 'Medium', 'Backend', ARRAY['middleware','design-patterns','functions'],
 'function createApp() {' || E'\n' || '  const middlewares = [];' || E'\n' || '  return {' || E'\n' || '    use(fn) { /* add middleware */ },' || E'\n' || '    run(req) { /* execute chain */ }' || E'\n' || '  };' || E'\n' || '}',
 'function createApp() {' || E'\n' || '  const middlewares: Array<(req: any, next: () => void) => void> = [];' || E'\n' || '  return {' || E'\n' || '    use(fn: (req: any, next: () => void) => void) {},' || E'\n' || '    run(req: any) {}' || E'\n' || '  };' || E'\n' || '}',
 'def create_app():' || E'\n' || '    middlewares = []' || E'\n' || '    def use(fn):' || E'\n' || '        pass' || E'\n' || '    def run(req):' || E'\n' || '        pass' || E'\n' || '    return {"use": use, "run": run}',
 '[{"id":1,"input":"3 middlewares modifying req","expected":"all 3 execute in order"},{"id":2,"input":"middleware without calling next()","expected":"chain stops"}]',
 100,
 ARRAY['Store middleware functions in an array','Create a next() function that advances to the next middleware','Use an index to track the current position']),

-- ============================================================
-- CHALLENGES — Database / SQL
-- ============================================================

('Implement LRU Cache',
 'Design and implement a Least Recently Used (LRU) cache with get(key) and put(key, value) operations, both in O(1) time.',
 'Hard', 'Data Structures', ARRAY['hash-map','linked-list','cache'],
 'class LRUCache {' || E'\n' || '  constructor(capacity) {' || E'\n' || '    // Your code here' || E'\n' || '  }' || E'\n' || '  get(key) {}' || E'\n' || '  put(key, value) {}' || E'\n' || '}',
 'class LRUCache {' || E'\n' || '  constructor(private capacity: number) {}' || E'\n' || '  get(key: number): number {}' || E'\n' || '  put(key: number, value: number): void {}' || E'\n' || '}',
 'class LRUCache:' || E'\n' || '    def __init__(self, capacity):' || E'\n' || '        pass' || E'\n' || '    def get(self, key):' || E'\n' || '        pass' || E'\n' || '    def put(self, key, value):' || E'\n' || '        pass',
 '[{"id":1,"input":"cap=2, put(1,1), put(2,2), get(1), put(3,3), get(2)","expected":"get(1)=1, get(2)=-1"},{"id":2,"input":"cap=1, put(1,1), put(2,2), get(1)","expected":"get(1)=-1"}]',
 150,
 ARRAY['Use a Map (ordered in JS) or HashMap + Doubly Linked List','On get: move the accessed key to the most recent position','On put: evict the least recently used if at capacity']),

('Group Anagrams',
 'Given an array of strings, group the anagrams together. An anagram is a word formed by rearranging the letters of another.',
 'Medium', 'Strings', ARRAY['strings','hash-map','sorting'],
 'function groupAnagrams(strs) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));',
 'function groupAnagrams(strs: string[]): string[][] {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'def group_anagrams(strs):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
 '[{"id":1,"input":"[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]","expected":"[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]"},{"id":2,"input":"[\"\"]","expected":"[[\"\"]]"},{"id":3,"input":"[\"a\"]","expected":"[[\"a\"]]"}]',
 80,
 ARRAY['Sort each string alphabetically to create a key','Use a hash map to group strings by their sorted key','Return the values of the hash map']),

-- ============================================================
-- CHALLENGES — DevOps / System Design
-- ============================================================

('Parse .env File',
 'Write a function that parses a .env file string into a key-value object. Handle comments (#), empty lines, quotes, and multi-word values.',
 'Easy', 'DevOps', ARRAY['parsing','strings','config'],
 'function parseEnv(envString) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(parseEnv("DB_HOST=localhost\\nDB_PORT=5432\\n# comment\\nAPP_NAME=\"My App\""));',
 'function parseEnv(envString: string): Record<string, string> {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'def parse_env(env_string):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
 '[{"id":1,"input":"DB_HOST=localhost\\nDB_PORT=5432","expected":"{\"DB_HOST\":\"localhost\",\"DB_PORT\":\"5432\"}"},{"id":2,"input":"# comment\\nKEY=\"value with spaces\"","expected":"{\"KEY\":\"value with spaces\"}"}]',
 40,
 ARRAY['Split by newlines and iterate','Skip lines starting with # or empty lines','Split each line on the first = sign, trim quotes from values']),

('Validate Cron Expression',
 'Write a function that validates a cron expression string (5 fields: minute, hour, day of month, month, day of week).',
 'Medium', 'DevOps', ARRAY['regex','validation','parsing'],
 'function isValidCron(expr) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(isValidCron("*/5 * * * *"));' || E'\n' || 'console.log(isValidCron("0 12 * * MON-FRI"));',
 'function isValidCron(expr: string): boolean {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'def is_valid_cron(expr):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
 '[{"id":1,"input":"*/5 * * * *","expected":"true"},{"id":2,"input":"0 12 * * MON-FRI","expected":"true"},{"id":3,"input":"60 * * * *","expected":"false"},{"id":4,"input":"* * *","expected":"false"}]',
 90,
 ARRAY['A cron has exactly 5 space-separated fields','Each field has valid ranges: minute(0-59), hour(0-23), day(1-31), month(1-12), weekday(0-6)','Handle special chars: *, /, -, and comma']),

-- ============================================================
-- CHALLENGES — Testing
-- ============================================================

('Implement Array.prototype.map',
 'Implement your own version of Array.prototype.map without using the built-in map method.',
 'Easy', 'JavaScript', ARRAY['arrays','higher-order-functions','prototypes'],
 'Array.prototype.myMap = function(callback) {' || E'\n' || '  // Your code here' || E'\n' || '};' || E'\n\n' || 'console.log([1,2,3].myMap(x => x * 2));',
 'declare global { interface Array<T> { myMap<U>(callback: (value: T, index: number, array: T[]) => U): U[]; } }' || E'\n' || 'Array.prototype.myMap = function(callback) {' || E'\n' || '  // Your code here' || E'\n' || '};',
 '# Python equivalent' || E'\n' || 'def my_map(arr, callback):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
 '[{"id":1,"input":"[1,2,3].myMap(x => x * 2)","expected":"[2,4,6]"},{"id":2,"input":"[\"a\",\"b\"].myMap((v,i) => v+i)","expected":"[\"a0\",\"b1\"]"}]',
 40,
 ARRAY['Create a new empty array for results','Iterate using a for loop with this.length','Call callback with (element, index, this) and push the result']),

('Memoize Function',
 'Implement a memoize function that caches the results of expensive function calls and returns the cached result for repeated inputs.',
 'Medium', 'JavaScript', ARRAY['closures','caching','optimization'],
 'function memoize(fn) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'const expensiveAdd = memoize((a, b) => a + b);' || E'\n' || 'console.log(expensiveAdd(1, 2));' || E'\n' || 'console.log(expensiveAdd(1, 2)); // cached',
 'function memoize<T extends (...args: any[]) => any>(fn: T): T {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'def memoize(fn):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
 '[{"id":1,"input":"memoize(add)(1,2) called twice","expected":"3 (second call uses cache)"},{"id":2,"input":"memoize(add)(1,2) then (2,3)","expected":"3 then 5"}]',
 80,
 ARRAY['Use a Map or object as a cache','Create a cache key from the arguments (JSON.stringify works)','Check the cache before calling the original function']),

('Throttle Function',
 'Implement a throttle function that ensures a callback is called at most once within a specified time interval.',
 'Medium', 'JavaScript', ARRAY['closures','timers','performance'],
 'function throttle(fn, interval) {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'function throttle(fn: (...args: any[]) => void, interval: number): (...args: any[]) => void {' || E'\n' || '  // Your code here' || E'\n' || '}',
 'def throttle(fn, interval):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
 '[{"id":1,"input":"call 5 times in 100ms, interval=200ms","expected":"called only once"},{"id":2,"input":"call, wait interval, call again","expected":"called twice"}]',
 80,
 ARRAY['Track the last time the function was called','Compare current time with lastCall + interval','Only execute if enough time has passed']),

-- ============================================================
-- CHALLENGES — System Design
-- ============================================================

('Implement a Pub/Sub System',
 'Build a simple publish-subscribe messaging system with subscribe(topic, callback), publish(topic, data), and unsubscribe(topic, callback).',
 'Medium', 'System Design', ARRAY['design-patterns','events','messaging'],
 'class PubSub {' || E'\n' || '  constructor() {' || E'\n' || '    this.subscribers = {};' || E'\n' || '  }' || E'\n' || '  subscribe(topic, cb) {}' || E'\n' || '  publish(topic, data) {}' || E'\n' || '  unsubscribe(topic, cb) {}' || E'\n' || '}',
 'class PubSub {' || E'\n' || '  private subscribers: Map<string, Function[]> = new Map();' || E'\n' || '  subscribe(topic: string, cb: Function): void {}' || E'\n' || '  publish(topic: string, data: any): void {}' || E'\n' || '  unsubscribe(topic: string, cb: Function): void {}' || E'\n' || '}',
 'class PubSub:' || E'\n' || '    def __init__(self):' || E'\n' || '        self.subscribers = {}' || E'\n' || '    def subscribe(self, topic, cb):' || E'\n' || '        pass' || E'\n' || '    def publish(self, topic, data):' || E'\n' || '        pass' || E'\n' || '    def unsubscribe(self, topic, cb):' || E'\n' || '        pass',
 '[{"id":1,"input":"subscribe, publish data","expected":"callback called with data"},{"id":2,"input":"subscribe, unsubscribe, publish","expected":"callback not called"}]',
 100,
 ARRAY['Use an object/Map to store topic -> array of callbacks','publish iterates all subscribers for that topic','unsubscribe filters out the specific callback']),

('Task Scheduler',
 'Implement a task scheduler that executes tasks with priorities. Higher priority tasks execute first. Support add(task, priority) and run().',
 'Hard', 'System Design', ARRAY['heap','priority-queue','scheduling'],
 'class TaskScheduler {' || E'\n' || '  constructor() {' || E'\n' || '    this.tasks = [];' || E'\n' || '  }' || E'\n' || '  add(task, priority) {}' || E'\n' || '  run() {}' || E'\n' || '}',
 'class TaskScheduler {' || E'\n' || '  private tasks: Array<{task: () => void, priority: number}> = [];' || E'\n' || '  add(task: () => void, priority: number): void {}' || E'\n' || '  run(): void {}' || E'\n' || '}',
 'class TaskScheduler:' || E'\n' || '    def __init__(self):' || E'\n' || '        self.tasks = []' || E'\n' || '    def add(self, task, priority):' || E'\n' || '        pass' || E'\n' || '    def run(self):' || E'\n' || '        pass',
 '[{"id":1,"input":"add(A,1), add(B,3), add(C,2), run()","expected":"B, C, A execution order"},{"id":2,"input":"no tasks, run()","expected":"no-op"}]',
 120,
 ARRAY['Store tasks as {task, priority} objects','Sort by priority (descending) before running','Consider using a binary heap for O(log n) insertion']),

('Consistent Hashing',
 'Implement a simplified consistent hashing ring for distributing keys across a dynamic set of server nodes.',
 'Hard', 'System Design', ARRAY['hashing','distributed-systems','load-balancing'],
 'class ConsistentHash {' || E'\n' || '  constructor(replicas = 3) {' || E'\n' || '    this.replicas = replicas;' || E'\n' || '    this.ring = new Map();' || E'\n' || '    this.sortedKeys = [];' || E'\n' || '  }' || E'\n' || '  addNode(node) {}' || E'\n' || '  removeNode(node) {}' || E'\n' || '  getNode(key) {}' || E'\n' || '}',
 'class ConsistentHash {' || E'\n' || '  constructor(private replicas = 3) {}' || E'\n' || '  addNode(node: string): void {}' || E'\n' || '  removeNode(node: string): void {}' || E'\n' || '  getNode(key: string): string {}' || E'\n' || '}',
 'class ConsistentHash:' || E'\n' || '    def __init__(self, replicas=3):' || E'\n' || '        pass' || E'\n' || '    def add_node(self, node):' || E'\n' || '        pass' || E'\n' || '    def remove_node(self, node):' || E'\n' || '        pass' || E'\n' || '    def get_node(self, key):' || E'\n' || '        pass',
 '[{"id":1,"input":"addNode(A), addNode(B), getNode(key1)","expected":"consistent node returned"},{"id":2,"input":"addNode(A), addNode(B), removeNode(A), getNode(key1)","expected":"B returned"}]',
 150,
 ARRAY['Hash each node with multiple virtual nodes (replicas)','Place hashes on a sorted ring','For a key, find the first node hash >= key hash (clockwise)']),

('Simple Load Balancer',
 'Implement a load balancer supporting Round Robin and Least Connections strategies for distributing requests across servers.',
 'Medium', 'System Design', ARRAY['load-balancing','design-patterns','algorithms'],
 'class LoadBalancer {' || E'\n' || '  constructor(servers, strategy = "round-robin") {' || E'\n' || '    // Your code here' || E'\n' || '  }' || E'\n' || '  getServer() {' || E'\n' || '    // Return next server' || E'\n' || '  }' || E'\n' || '  releaseServer(server) {}' || E'\n' || '}',
 'class LoadBalancer {' || E'\n' || '  constructor(private servers: string[], private strategy = "round-robin") {}' || E'\n' || '  getServer(): string {}' || E'\n' || '  releaseServer(server: string): void {}' || E'\n' || '}',
 'class LoadBalancer:' || E'\n' || '    def __init__(self, servers, strategy="round-robin"):' || E'\n' || '        pass' || E'\n' || '    def get_server(self):' || E'\n' || '        pass' || E'\n' || '    def release_server(self, server):' || E'\n' || '        pass',
 '[{"id":1,"input":"[A,B,C] round-robin, 4 requests","expected":"A,B,C,A"},{"id":2,"input":"[A,B] least-conn, A has 2, B has 0","expected":"B"}]',
 100,
 ARRAY['Round Robin: use a counter modulo server count','Least Connections: track active connections per server','releaseServer decrements the connection count']);


-- ============================================================
-- QUIZZES + QUESTIONS — Frontend
-- ============================================================

-- Quiz: Responsive Design
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('Responsive Design Essentials', 'Test your knowledge of responsive design, media queries, and mobile-first development.', 'beginner', 'Frontend', 10, 80, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'Responsive Design Essentials';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What does "mobile-first" design mean?', 'mcq', '["Design for mobile screens first, then enhance for larger screens","Design for desktop first then shrink","Only design for mobile devices","Design mobile and desktop simultaneously"]', 'Design for mobile screens first, then enhance for larger screens', 'Mobile-first means starting with the smallest screen and using min-width media queries to progressively enhance for larger screens.', 0),
  (v_quiz_id, 'Which CSS unit is relative to the viewport width?', 'mcq', '["px","em","vw","rem"]', 'vw', '1vw equals 1% of the viewport width, making it useful for fluid sizing.', 1),
  (v_quiz_id, 'The meta viewport tag is required for responsive design on mobile browsers.', 'true_false', '["True","False"]', 'True', 'Without <meta name="viewport" content="width=device-width, initial-scale=1">, mobile browsers render pages at desktop widths.', 2),
  (v_quiz_id, 'Which media query targets screens 768px and wider?', 'mcq', '["@media (max-width: 768px)","@media (min-width: 768px)","@media (width: 768px)","@media (screen: 768px)"]', '@media (min-width: 768px)', 'min-width targets screens at or above the specified width, commonly used in mobile-first approaches.', 3),
  (v_quiz_id, 'What does the CSS clamp() function do?', 'mcq', '["Limits a value between a minimum and maximum","Creates an animation","Defines a breakpoint","Sets viewport size"]', 'Limits a value between a minimum and maximum', 'clamp(min, preferred, max) sets a value that scales between a minimum and maximum, perfect for fluid typography.', 4);
end $$;

-- Quiz: Flexbox & Grid
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('Flexbox & CSS Grid', 'Master modern CSS layout systems — Flexbox and CSS Grid properties and use cases.', 'beginner', 'Frontend', 12, 90, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'Flexbox & CSS Grid';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'Which property defines the main axis direction in Flexbox?', 'mcq', '["align-items","justify-content","flex-direction","flex-wrap"]', 'flex-direction', 'flex-direction sets the main axis: row (default), row-reverse, column, or column-reverse.', 0),
  (v_quiz_id, 'CSS Grid is better suited for two-dimensional layouts than Flexbox.', 'true_false', '["True","False"]', 'True', 'Grid excels at 2D layouts (rows AND columns), while Flexbox is designed for 1D layouts (row OR column).', 1),
  (v_quiz_id, 'What does "grid-template-columns: repeat(3, 1fr)" create?', 'mcq', '["3 equal-width columns","3 fixed-width columns","3 rows","A 3x3 grid"]', '3 equal-width columns', 'repeat(3, 1fr) creates 3 columns that each take 1 fraction of the available space.', 2),
  (v_quiz_id, 'Which Flexbox property aligns items on the cross axis?', 'mcq', '["justify-content","flex-grow","align-items","flex-basis"]', 'align-items', 'align-items aligns flex items along the cross axis (perpendicular to the main axis).', 3),
  (v_quiz_id, 'The gap property works in both Flexbox and CSS Grid.', 'true_false', '["True","False"]', 'True', 'The gap property (formerly grid-gap) is now supported in both Flexbox and Grid layouts across modern browsers.', 4);
end $$;

-- Quiz: Next.js
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('Next.js Framework', 'Test your knowledge of Next.js App Router, SSR, SSG, and server components.', 'advanced', 'Frontend', 15, 150, 75, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'Next.js Framework';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'In Next.js App Router, components are Server Components by default.', 'true_false', '["True","False"]', 'True', 'All components in the App Router are React Server Components by default. Add "use client" directive to make them Client Components.', 0),
  (v_quiz_id, 'Which directive marks a component as a Client Component in Next.js?', 'mcq', '["\"use server\"","\"use client\"","\"client-only\"","export const dynamic"]', '"use client"', 'The "use client" directive at the top of a file marks it and its imports as Client Components.', 1),
  (v_quiz_id, 'What is ISR in Next.js?', 'mcq', '["Internal Server Routing","Incremental Static Regeneration","Isolated Server Rendering","Inline Style Resolution"]', 'Incremental Static Regeneration', 'ISR allows you to update static pages after build time by revalidating at a specified interval.', 2),
  (v_quiz_id, 'Which file defines a route layout in the App Router?', 'mcq', '["page.tsx","layout.tsx","route.tsx","template.tsx"]', 'layout.tsx', 'layout.tsx defines a shared layout that wraps page.tsx and nested routes, preserving state on navigation.', 3),
  (v_quiz_id, 'Server Actions in Next.js can mutate data directly from the server.', 'true_false', '["True","False"]', 'True', 'Server Actions allow you to define server-side functions that can be called directly from Client Components for data mutations.', 4);
end $$;

-- Quiz: Redux & State Management
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('Redux & State Management', 'Test your understanding of Redux Toolkit, Zustand, and state management patterns.', 'intermediate', 'Frontend', 15, 120, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'Redux & State Management';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What is the purpose of a Redux reducer?', 'mcq', '["To fetch data from an API","To specify how state changes in response to actions","To render UI components","To create side effects"]', 'To specify how state changes in response to actions', 'Reducers are pure functions that take the current state and an action, and return the new state.', 0),
  (v_quiz_id, 'Redux Toolkit''s createSlice automatically generates action creators.', 'true_false', '["True","False"]', 'True', 'createSlice generates action creators and action types based on the reducer functions you provide.', 1),
  (v_quiz_id, 'Which hook is used to dispatch actions in React-Redux?', 'mcq', '["useState","useDispatch","useReducer","useAction"]', 'useDispatch', 'useDispatch returns the store''s dispatch function, allowing you to dispatch actions.', 2),
  (v_quiz_id, 'What does RTK Query handle?', 'mcq', '["CSS styling","Data fetching and caching","Route management","Form validation"]', 'Data fetching and caching', 'RTK Query is a powerful data fetching and caching tool built into Redux Toolkit.', 3),
  (v_quiz_id, 'Zustand requires wrapping your app in a Provider component.', 'true_false', '["True","False"]', 'False', 'Zustand is hook-based and does NOT require a Provider wrapper, unlike Redux which needs a <Provider store={store}>.', 4);
end $$;

-- ============================================================
-- QUIZZES + QUESTIONS — Backend
-- ============================================================

-- Quiz: Express.js
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('Express.js Essentials', 'Middleware, routing, error handling, and security in Express.js.', 'intermediate', 'Backend', 15, 120, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'Express.js Essentials';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What is the correct order of parameters in Express middleware?', 'mcq', '["(res, req, next)","(req, res, next)","(next, req, res)","(req, next, res)"]', '(req, res, next)', 'Express middleware functions receive the request, response, and next function in that specific order.', 0),
  (v_quiz_id, 'Express error-handling middleware has 4 parameters: (err, req, res, next).', 'true_false', '["True","False"]', 'True', 'Error-handling middleware is identified by having exactly 4 parameters, starting with the error object.', 1),
  (v_quiz_id, 'Which middleware is used to parse JSON request bodies?', 'mcq', '["express.json()","express.urlencoded()","body-parser","express.raw()"]', 'express.json()', 'express.json() is a built-in middleware that parses incoming JSON payloads in request bodies.', 2),
  (v_quiz_id, 'What does app.use() do in Express?', 'mcq', '["Defines a route","Mounts middleware at a path","Starts the server","Sends a response"]', 'Mounts middleware at a path', 'app.use() mounts middleware functions that execute for every request to the specified path (or all paths if none specified).', 3),
  (v_quiz_id, 'The Helmet middleware helps secure Express apps by setting HTTP headers.', 'true_false', '["True","False"]', 'True', 'Helmet sets various HTTP headers like Content-Security-Policy, X-Frame-Options, etc., to protect against common vulnerabilities.', 4);
end $$;

-- Quiz: GraphQL
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('GraphQL Fundamentals', 'Schemas, queries, mutations, resolvers, and GraphQL best practices.', 'intermediate', 'Backend', 15, 130, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'GraphQL Fundamentals';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What problem does GraphQL primarily solve compared to REST?', 'mcq', '["Faster database queries","Over-fetching and under-fetching of data","Better security","Simpler server code"]', 'Over-fetching and under-fetching of data', 'GraphQL lets clients request exactly the data they need, avoiding the over-fetching and under-fetching common with REST endpoints.', 0),
  (v_quiz_id, 'In GraphQL, mutations are used for read operations.', 'true_false', '["True","False"]', 'False', 'Queries are for read operations. Mutations are for write operations (create, update, delete).', 1),
  (v_quiz_id, 'What is a GraphQL resolver?', 'mcq', '["A type definition","A function that returns data for a field","A query parser","A caching layer"]', 'A function that returns data for a field', 'Resolvers are functions that resolve the value for a type or field in a schema, connecting the schema to your data sources.', 2),
  (v_quiz_id, 'What does the ! symbol mean in a GraphQL schema type?', 'mcq', '["Optional field","Non-nullable (required)","Array type","Deprecated"]', 'Non-nullable (required)', 'The ! mark means the field will always return a value (non-null). e.g., String! means a non-nullable string.', 3),
  (v_quiz_id, 'GraphQL subscriptions enable real-time data through WebSockets.', 'true_false', '["True","False"]', 'True', 'Subscriptions allow clients to receive real-time updates when data changes, typically implemented over WebSockets.', 4);
end $$;

-- Quiz: Auth & Security
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('Authentication & Security', 'JWT, OAuth 2.0, session management, and web security fundamentals.', 'intermediate', 'Backend', 15, 130, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'Authentication & Security';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What are the three parts of a JWT token?', 'mcq', '["Username, Password, Token","Header, Payload, Signature","Key, Value, Hash","Auth, Data, Verify"]', 'Header, Payload, Signature', 'A JWT consists of three Base64-encoded parts separated by dots: header (algorithm & type), payload (claims), and signature.', 0),
  (v_quiz_id, 'Access tokens should have a short expiration time.', 'true_false', '["True","False"]', 'True', 'Short-lived access tokens (e.g., 15 minutes) minimize damage if compromised. Refresh tokens handle renewal.', 1),
  (v_quiz_id, 'What is the purpose of a refresh token?', 'mcq', '["To encrypt data","To obtain new access tokens without re-login","To store user preferences","To hash passwords"]', 'To obtain new access tokens without re-login', 'Refresh tokens are long-lived tokens used to obtain new access tokens when the current one expires.', 2),
  (v_quiz_id, 'What does RBAC stand for?', 'mcq', '["Remote Backend Access Control","Role-Based Access Control","Request Body Authentication Check","Redirect-Based Auth Configuration"]', 'Role-Based Access Control', 'RBAC restricts system access based on user roles (e.g., admin, editor, viewer) rather than individual permissions.', 3),
  (v_quiz_id, 'Storing JWTs in localStorage is safer than httpOnly cookies.', 'true_false', '["True","False"]', 'False', 'httpOnly cookies are safer because they are not accessible via JavaScript, protecting against XSS attacks. localStorage is vulnerable to XSS.', 4);
end $$;

-- ============================================================
-- QUIZZES + QUESTIONS — Database
-- ============================================================

-- Quiz: MongoDB
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('MongoDB & NoSQL', 'Document modeling, aggregation pipeline, and NoSQL concepts.', 'intermediate', 'Database', 15, 120, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'MongoDB & NoSQL';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What is the primary data format MongoDB uses to store documents?', 'mcq', '["XML","JSON","BSON","CSV"]', 'BSON', 'MongoDB stores data in BSON (Binary JSON), which extends JSON with additional data types like Date and Binary.', 0),
  (v_quiz_id, 'MongoDB supports ACID transactions across multiple documents.', 'true_false', '["True","False"]', 'True', 'Since MongoDB 4.0, multi-document ACID transactions are supported for replica sets, and since 4.2 for sharded clusters.', 1),
  (v_quiz_id, 'What is the aggregation pipeline used for?', 'mcq', '["User authentication","Data transformation and analysis in stages","Creating indexes","Schema validation"]', 'Data transformation and analysis in stages', 'The aggregation pipeline processes documents through sequential stages ($match, $group, $sort, $project, etc.) for complex data analysis.', 2),
  (v_quiz_id, 'Which is NOT a valid reason to choose NoSQL over SQL?', 'mcq', '["Flexible schema requirements","Horizontal scalability needs","Need for complex JOINs across many tables","Rapidly changing data models"]', 'Need for complex JOINs across many tables', 'Complex JOINs are a strength of SQL databases. NoSQL databases typically denormalize data to avoid JOINs.', 3),
  (v_quiz_id, 'Mongoose is an ODM (Object Document Mapper) for MongoDB.', 'true_false', '["True","False"]', 'True', 'Mongoose provides schema validation, type casting, query building, and middleware for MongoDB in Node.js.', 4);
end $$;

-- Quiz: Redis
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('Redis & Caching', 'Redis data structures, caching patterns, and in-memory data store concepts.', 'intermediate', 'Database', 12, 110, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'Redis & Caching';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What is Redis primarily used for?', 'mcq', '["File storage","In-memory data caching and storage","Image processing","Code compilation"]', 'In-memory data caching and storage', 'Redis is an in-memory data structure store used as a cache, message broker, and database with sub-millisecond latency.', 0),
  (v_quiz_id, 'Redis only supports string data types.', 'true_false', '["True","False"]', 'False', 'Redis supports strings, lists, sets, sorted sets, hashes, bitmaps, HyperLogLogs, and streams.', 1),
  (v_quiz_id, 'What is the cache-aside (lazy loading) pattern?', 'mcq', '["Write to cache and database simultaneously","Load data into cache only when requested","Pre-load all data into cache","Use cache as the primary database"]', 'Load data into cache only when requested', 'Cache-aside: app checks cache first, on miss fetches from DB and stores in cache. Data is loaded lazily on demand.', 2),
  (v_quiz_id, 'What does TTL mean in the context of Redis?', 'mcq', '["Total Transfer Length","Time To Live","Type To Load","Token Time Limit"]', 'Time To Live', 'TTL (Time To Live) is the duration a key remains in Redis before it automatically expires and is deleted.', 3),
  (v_quiz_id, 'Redis Pub/Sub can be used for real-time messaging between services.', 'true_false', '["True","False"]', 'True', 'Redis Pub/Sub allows publishers to send messages to channels, which are instantly delivered to all subscribed clients.', 4);
end $$;

-- ============================================================
-- QUIZZES + QUESTIONS — DevOps
-- ============================================================

-- Quiz: Docker
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('Docker Essentials', 'Containers, Dockerfiles, images, volumes, and Docker Compose fundamentals.', 'intermediate', 'DevOps', 15, 130, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'Docker Essentials';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What is the difference between a Docker image and a container?', 'mcq', '["They are the same thing","An image is a running instance of a container","A container is a running instance of an image","Images run on the cloud, containers run locally"]', 'A container is a running instance of an image', 'An image is a read-only template with instructions. A container is a runnable instance of that image with its own writable layer.', 0),
  (v_quiz_id, 'Which Dockerfile instruction sets the command to run when the container starts?', 'mcq', '["RUN","COPY","CMD","EXPOSE"]', 'CMD', 'CMD specifies the default command to execute when a container starts. RUN executes commands during the image build.', 1),
  (v_quiz_id, 'Docker volumes persist data even after a container is deleted.', 'true_false', '["True","False"]', 'True', 'Volumes are stored outside the container filesystem, so data persists when containers are removed or recreated.', 2),
  (v_quiz_id, 'What does Docker Compose do?', 'mcq', '["Builds Docker images","Orchestrates multi-container applications","Monitors container logs","Deploys to production"]', 'Orchestrates multi-container applications', 'Docker Compose defines and runs multi-container apps using a YAML file, managing services, networks, and volumes together.', 3),
  (v_quiz_id, 'Multi-stage builds help reduce the final Docker image size.', 'true_false', '["True","False"]', 'True', 'Multi-stage builds use multiple FROM instructions, allowing you to copy only necessary artifacts to the final image, excluding build tools and dependencies.', 4);
end $$;

-- Quiz: CI/CD
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('CI/CD Pipelines', 'Continuous integration, continuous delivery, GitHub Actions, and deployment automation.', 'intermediate', 'DevOps', 12, 120, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'CI/CD Pipelines';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What does CI stand for in CI/CD?', 'mcq', '["Code Integration","Continuous Integration","Container Installation","Central Infrastructure"]', 'Continuous Integration', 'CI (Continuous Integration) is the practice of frequently merging code changes with automated builds and tests.', 0),
  (v_quiz_id, 'In GitHub Actions, a workflow is defined in a YAML file.', 'true_false', '["True","False"]', 'True', 'GitHub Actions workflows are defined in .yml/.yaml files under the .github/workflows/ directory.', 1),
  (v_quiz_id, 'What triggers a CI pipeline to run?', 'mcq', '["Only manual trigger","Code push, pull request, or scheduled events","Only on merge to main","Only on release"]', 'Code push, pull request, or scheduled events', 'CI pipelines can be triggered by various events: pushes, PRs, schedules (cron), manual dispatch, and more.', 2),
  (v_quiz_id, 'What is the difference between Continuous Delivery and Continuous Deployment?', 'mcq', '["They are the same","Delivery auto-deploys, Deployment needs approval","Delivery requires manual approval to deploy, Deployment auto-deploys","Delivery is for testing, Deployment is for production"]', 'Delivery requires manual approval to deploy, Deployment auto-deploys', 'Continuous Delivery automates up to a release-ready state requiring manual approval. Continuous Deployment fully automates deployment to production.', 3),
  (v_quiz_id, 'Automated tests should run before deployment in a CI/CD pipeline.', 'true_false', '["True","False"]', 'True', 'Running tests before deployment catches bugs early and ensures only verified code reaches production.', 4);
end $$;

-- Quiz: AWS
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('AWS Cloud Basics', 'Core AWS services: EC2, S3, Lambda, RDS, and cloud architecture fundamentals.', 'intermediate', 'DevOps', 15, 130, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'AWS Cloud Basics';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What is AWS EC2?', 'mcq', '["A database service","Virtual servers in the cloud","A storage service","A DNS service"]', 'Virtual servers in the cloud', 'EC2 (Elastic Compute Cloud) provides resizable virtual server instances in the cloud.', 0),
  (v_quiz_id, 'S3 stands for Simple Storage Service.', 'true_false', '["True","False"]', 'True', 'Amazon S3 (Simple Storage Service) is an object storage service offering scalability, data availability, and security.', 1),
  (v_quiz_id, 'What is AWS Lambda?', 'mcq', '["A virtual machine service","A serverless compute service","A database engine","A load balancer"]', 'A serverless compute service', 'Lambda lets you run code without provisioning servers. You pay only for the compute time consumed.', 2),
  (v_quiz_id, 'Which AWS service is a managed relational database?', 'mcq', '["DynamoDB","ElastiCache","RDS","S3"]', 'RDS', 'RDS (Relational Database Service) manages databases like PostgreSQL, MySQL, MariaDB, Oracle, and SQL Server.', 3),
  (v_quiz_id, 'IAM in AWS controls who can access which resources.', 'true_false', '["True","False"]', 'True', 'IAM (Identity and Access Management) manages users, groups, roles, and their permissions to AWS services and resources.', 4);
end $$;

-- ============================================================
-- QUIZZES + QUESTIONS — Testing
-- ============================================================

-- Quiz: Jest & Testing
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('Jest & Unit Testing', 'Jest matchers, mocking, async testing, and test-driven development.', 'intermediate', 'Testing', 15, 120, 70, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'Jest & Unit Testing';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What does the describe() function do in Jest?', 'mcq', '["Runs a test","Groups related tests together","Mocks a function","Asserts a value"]', 'Groups related tests together', 'describe() creates a block that groups several related test cases together for better organization.', 0),
  (v_quiz_id, 'jest.fn() creates a mock function.', 'true_false', '["True","False"]', 'True', 'jest.fn() creates a mock function that tracks calls, arguments, and return values.', 1),
  (v_quiz_id, 'Which matcher checks for strict equality in Jest?', 'mcq', '["toEqual","toBe","toMatch","toContain"]', 'toBe', 'toBe uses Object.is for strict equality (same reference). toEqual recursively checks equality of object contents.', 2),
  (v_quiz_id, 'How do you test an async function in Jest?', 'mcq', '["Use a callback","Use async/await with expect","Wrap in setTimeout","Use Promise.resolve"]', 'Use async/await with expect', 'Mark the test function as async and use await. Jest waits for the promise to resolve before checking assertions.', 3),
  (v_quiz_id, 'Code coverage reports show which lines of code are tested.', 'true_false', '["True","False"]', 'True', 'Coverage reports (--coverage flag) show percentages of statements, branches, functions, and lines exercised by tests.', 4);
end $$;

-- ============================================================
-- QUIZZES + QUESTIONS — System Design
-- ============================================================

-- Quiz: System Design
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('System Design Concepts', 'Scalability, load balancing, caching, databases, and distributed system fundamentals.', 'advanced', 'System Design', 20, 160, 75, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'System Design Concepts';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What is horizontal scaling?', 'mcq', '["Adding more RAM to a server","Adding more servers to handle load","Increasing CPU speed","Upgrading the database"]', 'Adding more servers to handle load', 'Horizontal scaling (scaling out) adds more machines to distribute load, unlike vertical scaling (scaling up) which adds resources to one machine.', 0),
  (v_quiz_id, 'The CAP theorem states a distributed system can have all three: Consistency, Availability, and Partition tolerance.', 'true_false', '["True","False"]', 'False', 'The CAP theorem states you can only guarantee two of three properties simultaneously during a network partition.', 1),
  (v_quiz_id, 'What does a load balancer do?', 'mcq', '["Stores data","Distributes incoming traffic across multiple servers","Compresses files","Authenticates users"]', 'Distributes incoming traffic across multiple servers', 'A load balancer distributes network traffic across multiple servers to ensure no single server is overwhelmed.', 2),
  (v_quiz_id, 'What is database sharding?', 'mcq', '["Backing up a database","Splitting data across multiple database instances","Indexing tables","Encrypting data"]', 'Splitting data across multiple database instances', 'Sharding horizontally partitions data across multiple database instances, each holding a subset of the data.', 3),
  (v_quiz_id, 'Message queues help decouple services in a distributed system.', 'true_false', '["True","False"]', 'True', 'Message queues (RabbitMQ, Kafka) allow services to communicate asynchronously, improving reliability and scalability.', 4);
end $$;

-- Quiz: Distributed Systems
insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('Distributed Systems', 'Consensus, message queues, event sourcing, and fault tolerance in distributed architectures.', 'advanced', 'System Design', 20, 160, 75, 5);

do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'Distributed Systems';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What is event sourcing?', 'mcq', '["Logging errors","Storing state changes as a sequence of events","Streaming UI events","Source code versioning"]', 'Storing state changes as a sequence of events', 'Event sourcing persists the state of an entity as a sequence of immutable events, enabling full audit trails and state reconstruction.', 0),
  (v_quiz_id, 'Apache Kafka is a distributed event streaming platform.', 'true_false', '["True","False"]', 'True', 'Kafka is used for building real-time data pipelines and streaming applications, handling trillions of events per day.', 1),
  (v_quiz_id, 'What does CQRS stand for?', 'mcq', '["Command Query Responsibility Segregation","Central Queue Routing System","Concurrent Query Resolution Service","Cache Query Read Store"]', 'Command Query Responsibility Segregation', 'CQRS separates read and write operations into different models, optimizing each side independently.', 2),
  (v_quiz_id, 'What is the purpose of a circuit breaker pattern?', 'mcq', '["To encrypt connections","To prevent cascading failures by stopping calls to failing services","To load balance requests","To compress data"]', 'To prevent cascading failures by stopping calls to failing services', 'The circuit breaker detects failures and prevents repeated calls to a failing service, allowing it time to recover.', 3),
  (v_quiz_id, 'Idempotency means performing the same operation multiple times produces the same result.', 'true_false', '["True","False"]', 'True', 'Idempotent operations (like PUT, DELETE) produce the same result regardless of how many times they are executed, crucial in distributed systems with retries.', 4);
end $$;


-- ============================================================
-- CERTIFICATIONS — Full Stack Learning Path
-- ============================================================

insert into public.certifications (title, description, skills, required_challenge_count, required_quiz_pass_score, order_index, unlock_requirement) values

('Responsive Web Design',
 'Demonstrate mastery of responsive design, Flexbox, CSS Grid, and mobile-first development.',
 ARRAY['Responsive Design','Flexbox','CSS Grid','Media Queries'], 2, 70, 8, null),

('Next.js Developer',
 'Build production-grade apps with Next.js — SSR, SSG, App Router, and Server Components.',
 ARRAY['Next.js','SSR','SSG','Server Components','API Routes'], 3, 75, 9, 'Complete React JS Professional first'),

('State Management Expert',
 'Master global state management with Redux Toolkit, Zustand, and modern state patterns.',
 ARRAY['Redux','Zustand','State Management','RTK Query'], 3, 70, 10, null),

('API Developer',
 'Design and build robust REST and GraphQL APIs with authentication and best practices.',
 ARRAY['REST APIs','GraphQL','Express.js','API Design','Authentication'], 5, 75, 11, null),

('Real-time Systems',
 'Build real-time applications with WebSockets, event-driven architecture, and pub/sub patterns.',
 ARRAY['WebSockets','Socket.io','Pub/Sub','Real-time','Event-Driven'], 4, 75, 12, 'Complete API Developer first'),

('Database Engineer',
 'Master SQL, NoSQL, caching, and ORM for production database architectures.',
 ARRAY['PostgreSQL','MongoDB','Redis','Prisma','Database Design'], 5, 75, 13, null),

('DevOps Practitioner',
 'Containerize, deploy, and automate with Docker, CI/CD, and cloud platforms.',
 ARRAY['Docker','CI/CD','Linux','Nginx','AWS','Vercel'], 4, 70, 14, null),

('Kubernetes Specialist',
 'Orchestrate containerized applications at scale with Kubernetes.',
 ARRAY['Kubernetes','Docker','Container Orchestration','Helm'], 3, 80, 15, 'Complete DevOps Practitioner first'),

('Testing Champion',
 'Write reliable tests — unit, integration, E2E — using Jest, RTL, and Cypress.',
 ARRAY['Jest','React Testing Library','Cypress','TDD','API Testing'], 4, 75, 16, null),

('System Design Architect',
 'Design scalable, distributed systems with proper caching, load balancing, and messaging.',
 ARRAY['System Design','Caching','Load Balancing','Message Queues','Distributed Systems'], 5, 80, 17, 'Earn 6 individual certifications first'),

('Cloud Native Developer',
 'Full expertise in cloud-native development — containers, serverless, CI/CD, and cloud services.',
 ARRAY['Docker','Kubernetes','AWS','Serverless','CI/CD','Cloud Architecture'], 6, 80, 18, 'Complete DevOps Practitioner and Kubernetes Specialist'),

('Full Stack Architect',
 'Ultimate full-stack mastery — frontend, backend, databases, DevOps, testing, and system design.',
 ARRAY['React','Next.js','Node.js','TypeScript','PostgreSQL','MongoDB','Docker','AWS','System Design'], 10, 85, 19, 'Earn 8 individual certifications first');


-- ============================================================
-- DONE! Summary:
-- • 33 new courses (7 Frontend, 6 Backend, 6 Database, 7 DevOps, 4 Testing, 3 System Design)
-- • 24 new challenges (5 Frontend/JS, 4 Backend, 2 Data Structures, 2 DevOps, 4 JS Patterns, 4 System Design, 3 Testing/JS)
-- • 15 new quizzes with 5 questions each = 75 new questions
-- • 12 new certifications completing the learning path
-- ============================================================
