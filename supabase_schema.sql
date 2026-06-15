-- ============================================================
-- R-Learn Platform - Full Database Schema + Seed
-- Run this in Supabase SQL Editor
-- ============================================================

-- PROFILES
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  department text default 'Engineering',
  role text default 'employee' check (role in ('employee','mentor','admin')),
  is_approved boolean default false,
  xp integer default 0,
  streak integer default 0,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Public read profiles" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Service insert profiles" on public.profiles for insert with check (true);

-- COURSES
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text default 'Frontend',
  difficulty text default 'Beginner',
  thumbnail_color text default 'from-blue-500 to-cyan-500',
  duration_hours integer default 10,
  is_published boolean default true,
  created_at timestamptz default now()
);
alter table public.courses enable row level security;
create policy "Anyone read courses" on public.courses for select using (true);
create policy "Admin manage courses" on public.courses for all using (true);

-- MODULES
create table if not exists public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  order_index integer default 0,
  created_at timestamptz default now()
);
alter table public.modules enable row level security;
create policy "Anyone read modules" on public.modules for select using (true);
create policy "Admin manage modules" on public.modules for all using (true);

-- LESSONS
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade,
  title text not null,
  content text default '',
  duration_minutes integer default 10,
  order_index integer default 0,
  created_at timestamptz default now()
);
alter table public.lessons enable row level security;
create policy "Anyone read lessons" on public.lessons for select using (true);
create policy "Admin manage lessons" on public.lessons for all using (true);

-- USER PROGRESS
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  completed_at timestamptz default now(),
  unique(user_id, lesson_id)
);
alter table public.user_progress enable row level security;
create policy "Users manage own progress" on public.user_progress for all using (auth.uid() = user_id);

-- CHALLENGES
create table if not exists public.challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  difficulty text default 'Easy',
  category text default 'Arrays',
  points integer default 10,
  starter_code_js text default '',
  starter_code_ts text default '',
  starter_code_python text default '',
  test_cases jsonb default '[]',
  solution text default '',
  is_published boolean default true,
  created_at timestamptz default now()
);
alter table public.challenges enable row level security;
create policy "Anyone read challenges" on public.challenges for select using (true);
create policy "Admin manage challenges" on public.challenges for all using (true);

-- CHALLENGE SUBMISSIONS
create table if not exists public.challenge_submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  challenge_id uuid references public.challenges(id) on delete cascade,
  code text,
  language text default 'javascript',
  passed boolean default false,
  submitted_at timestamptz default now()
);
alter table public.challenge_submissions enable row level security;
create policy "Users manage own submissions" on public.challenge_submissions for all using (auth.uid() = user_id);
create policy "Read all submissions" on public.challenge_submissions for select using (true);

-- QUIZZES
create table if not exists public.quizzes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text default 'Frontend',
  difficulty text default 'Beginner',
  time_limit_minutes integer default 15,
  pass_percentage integer default 70,
  is_published boolean default true,
  created_at timestamptz default now()
);
alter table public.quizzes enable row level security;
create policy "Anyone read quizzes" on public.quizzes for select using (true);
create policy "Admin manage quizzes" on public.quizzes for all using (true);

-- QUIZ QUESTIONS
create table if not exists public.quiz_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null default '[]',
  correct_answer integer not null,
  explanation text default '',
  order_index integer default 0
);
alter table public.quiz_questions enable row level security;
create policy "Anyone read questions" on public.quiz_questions for select using (true);
create policy "Admin manage questions" on public.quiz_questions for all using (true);

-- QUIZ ATTEMPTS
create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  quiz_id uuid references public.quizzes(id) on delete cascade,
  score integer default 0,
  answers jsonb default '{}',
  completed_at timestamptz default now()
);
alter table public.quiz_attempts enable row level security;
create policy "Users manage own attempts" on public.quiz_attempts for all using (auth.uid() = user_id);
create policy "Read all attempts" on public.quiz_attempts for select using (true);

-- CERTIFICATIONS
create table if not exists public.certifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  course_id uuid references public.courses(id),
  requirements jsonb default '{}',
  created_at timestamptz default now()
);
alter table public.certifications enable row level security;
create policy "Anyone read certs" on public.certifications for select using (true);
create policy "Admin manage certs" on public.certifications for all using (true);

-- USER CERTIFICATIONS
create table if not exists public.user_certifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  certification_id uuid references public.certifications(id) on delete cascade,
  verification_id text unique not null,
  issued_at timestamptz default now()
);
alter table public.user_certifications enable row level security;
create policy "Users read own certs" on public.user_certifications for select using (true);
create policy "Service insert certs" on public.user_certifications for insert with check (true);

-- ACTIVITY LOGS
create table if not exists public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  action text not null,
  item_name text not null,
  item_type text default 'general',
  xp_earned integer default 0,
  created_at timestamptz default now()
);
alter table public.activity_logs enable row level security;
create policy "Users manage own logs" on public.activity_logs for all using (auth.uid() = user_id);
create policy "Read all logs" on public.activity_logs for select using (true);

-- ===========================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ===========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, department, role, is_approved)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'department', 'Engineering'),
    coalesce(new.raw_user_meta_data->>'role', 'employee'),
    false
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===========================================
-- SEED: COURSES (all 14 topics)
-- ===========================================
insert into public.courses (id, title, description, category, difficulty, thumbnail_color, duration_hours) values
  ('c1000000-0000-0000-0000-000000000001', 'HTML5 Fundamentals', 'Master semantic HTML5 elements, forms, media, and Web APIs for modern web development.', 'Frontend', 'Beginner', 'from-orange-500 to-red-500', 12),
  ('c1000000-0000-0000-0000-000000000002', 'CSS3 & Tailwind CSS', 'Learn CSS3, Flexbox, Grid, animations, and the Tailwind utility-first framework from scratch.', 'Frontend', 'Beginner', 'from-blue-500 to-cyan-500', 16),
  ('c1000000-0000-0000-0000-000000000003', 'JavaScript ES6+', 'Deep dive into modern JS: closures, promises, async/await, modules, and best practices.', 'Frontend', 'Intermediate', 'from-yellow-400 to-yellow-600', 20),
  ('c1000000-0000-0000-0000-000000000004', 'TypeScript Complete Guide', 'Type-safe JavaScript with TypeScript — types, interfaces, generics, decorators, and advanced patterns.', 'Frontend', 'Intermediate', 'from-blue-600 to-blue-800', 18),
  ('c1000000-0000-0000-0000-000000000005', 'React JS Mastery', 'Build modern SPAs with React: hooks, context, patterns, performance optimization, and testing.', 'Frontend', 'Intermediate', 'from-cyan-400 to-blue-500', 25),
  ('c1000000-0000-0000-0000-000000000006', 'Tailwind CSS Deep Dive', 'Advanced Tailwind: custom themes, plugins, responsive design, dark mode, and component patterns.', 'Frontend', 'Intermediate', 'from-teal-400 to-emerald-500', 10),
  ('c1000000-0000-0000-0000-000000000007', 'Node.js Backend Development', 'Server-side JavaScript with Node.js: event loop, streams, file system, and async patterns.', 'Backend', 'Intermediate', 'from-green-500 to-emerald-600', 22),
  ('c1000000-0000-0000-0000-000000000008', 'Express.js Framework', 'Build production REST APIs with Express: routing, middleware, error handling, and security.', 'Backend', 'Intermediate', 'from-gray-600 to-gray-800', 16),
  ('c1000000-0000-0000-0000-000000000009', 'REST API Design', 'Design scalable RESTful APIs: conventions, versioning, authentication, rate limiting, and docs.', 'Backend', 'Advanced', 'from-purple-500 to-indigo-600', 14),
  ('c1000000-0000-0000-0000-000000000010', 'Authentication & Security', 'JWT, OAuth2, sessions, bcrypt, HTTPS, CORS, and secure coding practices for web apps.', 'Backend', 'Advanced', 'from-red-500 to-rose-700', 15),
  ('c1000000-0000-0000-0000-000000000011', 'Database Fundamentals', 'SQL, NoSQL, schema design, indexing, joins, transactions, and performance optimization.', 'Backend', 'Intermediate', 'from-teal-500 to-cyan-600', 20),
  ('c1000000-0000-0000-0000-000000000012', 'Git & GitHub Mastery', 'Version control, branching strategies, PRs, CI/CD integration, and team collaboration workflows.', 'DevOps', 'Beginner', 'from-gray-700 to-gray-900', 10),
  ('c1000000-0000-0000-0000-000000000013', 'Backend Architecture', 'Monoliths vs microservices, API gateways, message queues, caching, and cloud deployment patterns.', 'Backend', 'Advanced', 'from-violet-500 to-purple-700', 20),
  ('c1000000-0000-0000-0000-000000000014', 'System Design Basics', 'Design scalable systems: load balancing, CAP theorem, databases, caching, and real-world case studies.', 'System Design', 'Advanced', 'from-rose-500 to-pink-600', 18)
on conflict (id) do nothing;

-- ===========================================
-- SEED: MODULES for each course
-- ===========================================
insert into public.modules (id, course_id, title, order_index) values
  -- HTML5 (c1)
  ('m1000001','c1000000-0000-0000-0000-000000000001','Introduction to HTML5',1),
  ('m1000002','c1000000-0000-0000-0000-000000000001','Semantic Elements',2),
  ('m1000003','c1000000-0000-0000-0000-000000000001','Forms & Validation',3),
  ('m1000004','c1000000-0000-0000-0000-000000000001','Media & APIs',4),
  -- JavaScript (c3)
  ('m3000001','c1000000-0000-0000-0000-000000000003','ES6 Core Features',1),
  ('m3000002','c1000000-0000-0000-0000-000000000003','Asynchronous JS',2),
  ('m3000003','c1000000-0000-0000-0000-000000000003','Modules & Tooling',3),
  -- React (c5)
  ('m5000001','c1000000-0000-0000-0000-000000000005','React Foundations',1),
  ('m5000002','c1000000-0000-0000-0000-000000000005','Hooks Deep Dive',2),
  ('m5000003','c1000000-0000-0000-0000-000000000005','State Management',3),
  ('m5000004','c1000000-0000-0000-0000-000000000005','Advanced Patterns',4),
  -- TypeScript (c4)
  ('m4000001','c1000000-0000-0000-0000-000000000004','TypeScript Basics',1),
  ('m4000002','c1000000-0000-0000-0000-000000000004','Interfaces & Types',2),
  ('m4000003','c1000000-0000-0000-0000-000000000004','Generics & Decorators',3)
on conflict (id) do nothing;

-- ===========================================
-- SEED: LESSONS
-- ===========================================
insert into public.lessons (id, module_id, title, content, duration_minutes, order_index) values
  ('l1000001','m1000001','What is HTML5?','# What is HTML5?\n\nHTML5 is the latest version of the HyperText Markup Language...\n\n```html\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>\n```\n\n## Key Features\n- Semantic elements\n- Canvas and SVG\n- Local Storage\n- Audio/Video support',5,1),
  ('l1000002','m1000001','Document Structure','# Document Structure\n\nEvery HTML document follows a standard structure...\n\n## The DOCTYPE\nThe `<!DOCTYPE html>` declaration tells browsers this is an HTML5 document.\n\n## The Head\nContains metadata, links, and scripts not visible to users.\n\n## The Body\nContains all visible page content.',8,2),
  ('l1000003','m3000001','let, const & Arrow Functions','# let, const & Arrow Functions\n\n## Variable Declarations\n\n```javascript\n// var - function scoped (avoid)\nvar old = "legacy";\n\n// let - block scoped\nlet count = 0;\n\n// const - block scoped, cannot reassign\nconst MAX = 100;\n```\n\n## Arrow Functions\n\n```javascript\n// Traditional\nfunction add(a, b) { return a + b; }\n\n// Arrow\nconst add = (a, b) => a + b;\n\n// With body\nconst multiply = (a, b) => {\n  const result = a * b;\n  return result;\n};\n```',15,1),
  ('l1000004','m3000002','Promises & Async/Await','# Promises & Async/Await\n\n## Promises\n\n```javascript\nconst fetchData = () => new Promise((resolve, reject) => {\n  setTimeout(() => resolve({ data: "Hello" }), 1000);\n});\n\nfetchData()\n  .then(result => console.log(result.data))\n  .catch(err => console.error(err));\n```\n\n## Async/Await\n\n```javascript\nasync function getData() {\n  try {\n    const result = await fetchData();\n    console.log(result.data);\n  } catch (err) {\n    console.error(err);\n  }\n}\n```\n\n## Key Points\n- async functions always return Promises\n- await pauses execution inside async functions\n- Always wrap await in try/catch',20,1),
  ('l1000005','m5000001','What is React?','# What is React?\n\nReact is a JavaScript library for building user interfaces, developed by Meta.\n\n## Core Concepts\n\n### Components\nComponents are the building blocks of React apps:\n\n```jsx\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```\n\n### JSX\nJSX is syntactic sugar for `React.createElement()`:\n\n```jsx\n// JSX\nconst element = <h1 className="title">Hello</h1>;\n\n// Compiled\nconst element = React.createElement("h1", { className: "title" }, "Hello");\n```\n\n### Virtual DOM\nReact maintains a virtual DOM and only updates the real DOM where changes occur — making updates fast.',10,1),
  ('l1000006','m5000002','useState Hook','# useState Hook\n\nThe `useState` hook adds state to functional components.\n\n## Basic Syntax\n\n```javascript\nconst [state, setState] = useState(initialValue);\n```\n\n## Counter Example\n\n```jsx\nimport { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>+</button>\n      <button onClick={() => setCount(c => c - 1)}>-</button>\n    </div>\n  );\n}\n```\n\n## Key Rules\n- Never mutate state directly\n- Use functional updates when new state depends on old state\n- State updates trigger re-renders',20,1),
  ('l1000007','m5000002','useEffect Hook','# useEffect Hook\n\nuseEffect handles side effects in React components.\n\n## Syntax\n\n```javascript\nuseEffect(() => {\n  // effect code\n  return () => {\n    // cleanup\n  };\n}, [dependencies]);\n```\n\n## Examples\n\n```jsx\n// Run on every render\nuseEffect(() => { console.log("rendered"); });\n\n// Run once on mount\nuseEffect(() => { fetchData(); }, []);\n\n// Run when dep changes\nuseEffect(() => { document.title = title; }, [title]);\n\n// With cleanup\nuseEffect(() => {\n  const sub = subscribe(id);\n  return () => sub.unsubscribe();\n}, [id]);\n```',20,2),
  ('l1000008','m4000001','TypeScript Basics','# TypeScript Basics\n\nTypeScript is a superset of JavaScript that adds static types.\n\n## Basic Types\n\n```typescript\nlet name: string = "Alice";\nlet age: number = 30;\nlet isActive: boolean = true;\nlet tags: string[] = ["react", "ts"];\nlet tuple: [string, number] = ["hello", 42];\n```\n\n## Type Inference\n\n```typescript\n// TypeScript infers the type\nlet message = "Hello"; // string\nlet count = 42;        // number\n```\n\n## Functions\n\n```typescript\nfunction greet(name: string): string {\n  return `Hello, ${name}`;\n}\n\nconst add = (a: number, b: number): number => a + b;\n```',15,1)
on conflict (id) do nothing;

-- ===========================================
-- SEED: CHALLENGES (all topics covered)
-- ===========================================
insert into public.challenges (id, title, description, difficulty, category, points, starter_code_js, starter_code_ts, starter_code_python, test_cases) values
  ('ch000001', 'Two Sum', 'Given an array of integers and a target, return indices of two numbers that add up to target.', 'Easy', 'Arrays', 10,
   'function twoSum(nums, target) {\n  // Your code here\n}\n\nconsole.log(twoSum([2,7,11,15], 9)); // [0,1]\nconsole.log(twoSum([3,2,4], 6));     // [1,2]',
   'function twoSum(nums: number[], target: number): number[] {\n  // Your code here\n  return [];\n}',
   'def two_sum(nums, target):\n    # Your code here\n    pass',
   '[{"input":[2,7,11,15],"target":9,"expected":[0,1]},{"input":[3,2,4],"target":6,"expected":[1,2]}]'),
  ('ch000002', 'Reverse String', 'Reverse a string without using built-in reverse methods.', 'Easy', 'Strings', 10,
   'function reverseString(s) {\n  // Your code here\n}',
   'function reverseString(s: string): string {\n  return "";\n}',
   'def reverse_string(s):\n    pass',
   '[{"input":"hello","expected":"olleh"},{"input":"racecar","expected":"racecar"}]'),
  ('ch000003', 'Valid Parentheses', 'Given a string of brackets, determine if it is valid and balanced.', 'Medium', 'Stack', 20,
   'function isValid(s) {\n  // Your code here\n}',
   'function isValid(s: string): boolean {\n  return false;\n}',
   'def is_valid(s):\n    pass',
   '[{"input":"()[]{}","expected":true},{"input":"(]","expected":false},{"input":"{[]}","expected":true}]'),
  ('ch000004', 'FizzBuzz', 'Print numbers 1-n, replacing multiples of 3 with Fizz, 5 with Buzz, both with FizzBuzz.', 'Easy', 'Loops', 10,
   'function fizzBuzz(n) {\n  // Return array of results\n}',
   'function fizzBuzz(n: number): string[] {\n  return [];\n}',
   'def fizz_buzz(n):\n    pass',
   '[{"input":15,"expected":["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]}]'),
  ('ch000005', 'Fibonacci Sequence', 'Return the nth Fibonacci number using an efficient approach.', 'Easy', 'Recursion', 10,
   'function fibonacci(n) {\n  // Your code here\n}',
   'function fibonacci(n: number): number {\n  return 0;\n}',
   'def fibonacci(n):\n    pass',
   '[{"input":6,"expected":8},{"input":10,"expected":55}]'),
  ('ch000006', 'Binary Search', 'Implement binary search on a sorted array. Return index or -1 if not found.', 'Easy', 'Algorithms', 10,
   'function binarySearch(arr, target) {\n  // Your code here\n}',
   'function binarySearch(arr: number[], target: number): number {\n  return -1;\n}',
   'def binary_search(arr, target):\n    pass',
   '[{"input":[1,3,5,7,9],"target":5,"expected":2},{"input":[1,3,5],"target":4,"expected":-1}]'),
  ('ch000007', 'Flatten Array', 'Flatten a nested array to any depth without using Array.flat().', 'Medium', 'Arrays', 20,
   'function flattenArray(arr) {\n  // Your code here\n}',
   'function flattenArray(arr: unknown[]): unknown[] {\n  return [];\n}',
   'def flatten_array(arr):\n    pass',
   '[{"input":[1,[2,[3,[4]]],5],"expected":[1,2,3,4,5]}]'),
  ('ch000008', 'Debounce Function', 'Implement a debounce utility that delays invoking fn until after wait ms.', 'Medium', 'JavaScript', 20,
   'function debounce(fn, wait) {\n  // Your code here\n}',
   'function debounce<T extends (...args: unknown[]) => void>(fn: T, wait: number): (...args: Parameters<T>) => void {\n  return fn;\n}',
   'def debounce(fn, wait):\n    pass',
   '[]'),
  ('ch000009', 'Deep Clone Object', 'Implement a deep clone function without using JSON.parse/stringify.', 'Hard', 'JavaScript', 30,
   'function deepClone(obj) {\n  // Your code here\n}',
   'function deepClone<T>(obj: T): T {\n  return obj;\n}',
   'def deep_clone(obj):\n    pass',
   '[]'),
  ('ch000010', 'LRU Cache', 'Design and implement an LRU (Least Recently Used) Cache with get and put operations.', 'Hard', 'Design', 30,
   'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) { }\n  put(key, value) { }\n}',
   'class LRUCache {\n  constructor(private capacity: number) {}\n  get(key: number): number { return -1; }\n  put(key: number, value: number): void {}\n}',
   'class LRUCache:\n    def __init__(self, capacity): pass\n    def get(self, key): pass\n    def put(self, key, value): pass',
   '[]'),
  ('ch000011', 'Promise All Implementation', 'Implement your own version of Promise.all from scratch.', 'Hard', 'Async', 30,
   'function promiseAll(promises) {\n  // Implement Promise.all\n}',
   'function promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {\n  return Promise.resolve([]);\n}',
   'async def promise_all(promises):\n    pass',
   '[]'),
  ('ch000012', 'CSS Specificity Calculator', 'Given a CSS selector string, calculate its specificity score as [a,b,c].', 'Medium', 'CSS', 20,
   'function calculateSpecificity(selector) {\n  // Return [a, b, c]\n}',
   'function calculateSpecificity(selector: string): [number, number, number] {\n  return [0, 0, 0];\n}',
   'def calculate_specificity(selector):\n    return [0, 0, 0]',
   '[{"input":"#id .class p","expected":[1,1,1]}]'),
  ('ch000013', 'SQL Query Optimizer', 'Given a slow query, identify missing indexes and rewrite it for performance.', 'Hard', 'Databases', 30,
   '// Analyze: SELECT * FROM orders JOIN users ON orders.user_id = users.id WHERE orders.status = "pending"\n// Write optimized version and explain indexes needed\nfunction analyzeQuery(query) {\n  return { optimized: "", indexes: [] };\n}',
   'function analyzeQuery(query: string): { optimized: string; indexes: string[] } {\n  return { optimized: "", indexes: [] };\n}',
   'def analyze_query(query):\n    return {"optimized": "", "indexes": []}',
   '[]'),
  ('ch000014', 'Event Emitter', 'Implement a basic EventEmitter class with on, off, and emit methods.', 'Medium', 'Node.js', 20,
   'class EventEmitter {\n  constructor() {\n    this.listeners = {};\n  }\n  on(event, fn) { }\n  off(event, fn) { }\n  emit(event, ...args) { }\n}',
   'type Listener = (...args: unknown[]) => void;\nclass EventEmitter {\n  on(event: string, fn: Listener): void {}\n  off(event: string, fn: Listener): void {}\n  emit(event: string, ...args: unknown[]): void {}\n}',
   'class EventEmitter:\n    def on(self, event, fn): pass\n    def off(self, event, fn): pass\n    def emit(self, event, *args): pass',
   '[]'),
  ('ch000015', 'JWT Token Decoder', 'Decode a JWT token payload without a library. Do not verify the signature.', 'Easy', 'Authentication', 10,
   'function decodeJWT(token) {\n  // Decode payload (no verification needed)\n}',
   'function decodeJWT(token: string): Record<string, unknown> {\n  return {};\n}',
   'import base64, json\ndef decode_jwt(token):\n    pass',
   '[]')
on conflict (id) do nothing;

-- ===========================================
-- SEED: QUIZZES (one per major topic)
-- ===========================================
insert into public.quizzes (id, title, description, category, difficulty, time_limit_minutes, pass_percentage) values
  ('q0000001', 'HTML5 Fundamentals', 'Test your knowledge of HTML5 elements, attributes, and APIs', 'Frontend', 'Beginner', 15, 70),
  ('q0000002', 'CSS3 & Layout', 'Flexbox, Grid, selectors, specificity, and responsive design', 'Frontend', 'Beginner', 20, 70),
  ('q0000003', 'JavaScript Core', 'Scope, closures, prototypes, event loop, and ES6 features', 'Frontend', 'Intermediate', 25, 70),
  ('q0000004', 'TypeScript Essentials', 'Types, interfaces, generics, and type narrowing', 'Frontend', 'Intermediate', 20, 75),
  ('q0000005', 'React JS Hooks', 'useState, useEffect, useContext, useReducer, and custom hooks', 'Frontend', 'Intermediate', 25, 75),
  ('q0000006', 'Node.js & Express', 'Event loop, modules, middleware, routing, and async patterns', 'Backend', 'Intermediate', 20, 70),
  ('q0000007', 'REST API Design', 'HTTP methods, status codes, authentication, and best practices', 'Backend', 'Advanced', 15, 75),
  ('q0000008', 'Database Design', 'SQL, normalization, indexes, joins, and NoSQL basics', 'Backend', 'Intermediate', 20, 70),
  ('q0000009', 'Git & Version Control', 'Branching, merging, rebasing, and collaboration workflows', 'DevOps', 'Beginner', 15, 70),
  ('q0000010', 'System Design', 'Scalability, load balancing, caching, CAP theorem, and databases', 'System Design', 'Advanced', 30, 80)
on conflict (id) do nothing;

-- ===========================================
-- SEED: QUIZ QUESTIONS
-- ===========================================
insert into public.quiz_questions (id, quiz_id, question, options, correct_answer, explanation, order_index) values
  -- HTML5 Quiz
  ('qq000001','q0000001','Which HTML5 element is used for navigation links?','["<nav>","<menu>","<links>","<navigation>"]',0,'The <nav> element represents a section of navigation links.',1),
  ('qq000002','q0000001','What attribute makes an input field required?','["mandatory","required","validate","must"]',1,'The required attribute prevents form submission if the field is empty.',2),
  ('qq000003','q0000001','Which element stores key-value pairs locally in the browser?','["<storage>","<cookie>","<data>","localStorage API"]',3,'localStorage is a Web Storage API, not an HTML element.',3),
  ('qq000004','q0000001','What does the <article> element represent?','["A news article only","Any independent, self-contained content","A paragraph","A section"]',1,'<article> is for any self-contained, independently distributable content.',4),
  ('qq000005','q0000001','Which input type shows a date picker?','["text","datetime","date","calendar"]',2,'<input type="date"> renders a native date picker in supported browsers.',5),

  -- JavaScript Quiz
  ('qq000010','q0000003','What does typeof null return?','["null","undefined","object","boolean"]',2,'This is a historical JavaScript bug — typeof null incorrectly returns "object".',1),
  ('qq000011','q0000003','Which method returns a new array without modifying the original?','["push","map","splice","sort"]',1,'map() returns a new array. push/splice modify in place. sort modifies in place too.',2),
  ('qq000012','q0000003','What is a closure in JavaScript?','["A function with no return value","A function that retains access to its outer scope","A blocked scope variable","An IIFE"]',1,'A closure is a function that has access to variables from its outer (enclosing) scope even after the outer function returns.',3),
  ('qq000013','q0000003','What does the event loop do?','["Runs JavaScript in parallel","Manages async task queue and call stack","Handles CSS rendering","Compiles JavaScript"]',1,'The event loop monitors the call stack and task queues, pushing callbacks to the stack when it is empty.',4),
  ('qq000014','q0000003','What does Promise.all() do when one promise rejects?','["Waits for all","Rejects immediately","Returns undefined","Ignores it"]',1,'Promise.all() short-circuits and rejects as soon as any one promise in the array rejects.',5),

  -- React Quiz
  ('qq000020','q0000005','What does useState return?','["The state value only","A setter function only","An array with state value and setter","An object with state methods"]',2,'useState returns a two-element array: [currentState, setterFunction].',1),
  ('qq000021','q0000005','When does useEffect with an empty [] run?','["On every render","Never","Once after mount","On every state change"]',2,'An empty dependency array means the effect runs exactly once after the initial render.',2),
  ('qq000022','q0000005','Which hook is best for complex state logic?','["useState","useEffect","useReducer","useRef"]',2,'useReducer is ideal for complex state transitions, similar to Redux patterns.',3),
  ('qq000023','q0000005','What is the purpose of the key prop in lists?','["Styling","Performance and reconciliation","Event handling","Required by React"]',1,'Keys help React identify which list items changed, were added, or removed during reconciliation.',4),
  ('qq000024','q0000005','How do you prevent unnecessary re-renders?','["useState","useMemo / memo","useEffect","useCallback only"]',1,'useMemo and React.memo memoize values and components respectively to avoid expensive recalculations.',5),

  -- TypeScript Quiz
  ('qq000030','q0000004','What is the difference between interface and type?','["No difference","interface can be extended, type cannot","interface is for objects only","type cannot be used with generics"]',1,'Both are similar but interface is more extendable via declaration merging. type is more flexible for unions/intersections.',1),
  ('qq000031','q0000004','What does the unknown type mean?','["Same as any","A type-safe version of any","A nullable type","A void type"]',1,'unknown is like any but requires type checking before use — it is the safer alternative.',2),
  ('qq000032','q0000004','What does the ? operator mean in T?','["T is optional","T is nullable","T is readonly","T is generic"]',0,'The ? after a property or parameter name makes it optional.',3),
  ('qq000033','q0000004','What is a Generic in TypeScript?','["A variable type","A reusable type parameter","An any alias","A utility type"]',1,'Generics create reusable components that work with different types while maintaining type safety.',4),
  ('qq000034','q0000004','Which utility type makes all properties optional?','["Required<T>","Readonly<T>","Partial<T>","Pick<T,K>"]',2,'Partial<T> constructs a type with all properties of T set to optional.',5),

  -- Node.js Quiz
  ('qq000040','q0000006','What is the Node.js event loop?','["A CSS loop","Mechanism handling async I/O without blocking","A for loop","Thread pool manager"]',1,'The event loop allows Node.js to perform non-blocking I/O operations.',1),
  ('qq000041','q0000006','Which method reads a file asynchronously?','["fs.readFile","fs.read","fs.open","fs.load"]',0,'fs.readFile() reads a file asynchronously and calls a callback when done.',2),
  ('qq000042','q0000006','What is middleware in Express?','["A database layer","A function that processes requests before routes","A caching layer","An ORM"]',1,'Middleware are functions that have access to req, res, and the next function in the stack.',3),
  ('qq000043','q0000006','What does require() return?','["A string","The module.exports object","A Promise","A function"]',1,'require() returns whatever was set on module.exports in the required module.',4),
  ('qq000044','q0000006','Which HTTP method should be used to partially update a resource?','["PUT","POST","PATCH","DELETE"]',2,'PATCH is for partial updates. PUT replaces the entire resource.',5),

  -- REST API Quiz
  ('qq000050','q0000007','What HTTP status code means "resource created"?','["200","201","204","301"]',1,'201 Created is the correct status code when a new resource is successfully created.',1),
  ('qq000051','q0000007','What does idempotent mean for HTTP methods?','["Returns same result","Multiple identical requests have the same effect as one","Cannot be cached","Requires authentication"]',1,'GET, PUT, DELETE are idempotent. POST is not.',2),
  ('qq000052','q0000007','Which authentication scheme uses Bearer tokens?','["Basic Auth","OAuth 2.0 / JWT","API Keys only","Digest Auth"]',1,'Bearer token authentication (used with JWT/OAuth2) uses "Authorization: Bearer <token>" header.',3),
  ('qq000053','q0000007','What is HATEOAS?','["An HTTP method","Hypermedia as the Engine of Application State","A caching strategy","A REST violation"]',1,'HATEOAS is a REST constraint where responses include links to related actions.',4),

  -- Database Quiz
  ('qq000060','q0000008','What does ACID stand for?','["Atomic, Consistent, Isolated, Durable","Async, Cached, Indexed, Distributed","All, Common, Important, Data","Automatic, Correct, Independent, Dynamic"]',0,'ACID guarantees reliable database transactions: Atomic, Consistent, Isolated, Durable.',1),
  ('qq000061','q0000008','Which SQL clause filters grouped rows?','["WHERE","HAVING","FILTER","GROUP BY"]',1,'HAVING filters after GROUP BY. WHERE filters before grouping.',2),
  ('qq000062','q0000008','What is a database index?','["A table row count","A data structure that speeds up queries","A primary key","A foreign key constraint"]',1,'Indexes improve query performance but add storage overhead and slow down writes.',3),
  ('qq000063','q0000008','What is the N+1 query problem?','["Too many tables","Fetching N related records with N separate queries","Using no indexes","Null pointer errors"]',1,'N+1 occurs when fetching a list of N items triggers N additional queries for each item.',4),

  -- System Design Quiz  
  ('qq000070','q0000010','What does CAP theorem state?','["Consistency, Availability, Partition tolerance — only 2 can be guaranteed","CAP is a database term only","Caching improves all three","No trade-offs exist"]',0,'CAP theorem says distributed systems can only guarantee 2 of 3: Consistency, Availability, Partition Tolerance.',1),
  ('qq000071','q0000010','What is horizontal scaling?','["Adding more RAM","Adding more machines","Upgrading CPU","Faster storage"]',1,'Horizontal scaling (scaling out) adds more servers. Vertical scaling (scaling up) upgrades existing hardware.',2),
  ('qq000072','q0000010','What is the purpose of a CDN?','["Database replication","Serving static assets from edge locations","Load balancing","Session management"]',1,'CDNs cache and serve static content from geographically distributed edge nodes close to users.',3),
  ('qq000073','q0000010','Which caching strategy writes to cache and DB simultaneously?','["Cache aside","Write-through","Write-back","Read-through"]',1,'Write-through writes to both cache and database simultaneously, keeping them in sync.',4)
on conflict (id) do nothing;

-- ===========================================
-- SEED: CERTIFICATIONS
-- ===========================================
insert into public.certifications (id, title, description, course_id, requirements) values
  ('cert0001', 'HTML5 Developer', 'Demonstrates mastery of HTML5 fundamentals and semantic markup.', 'c1000000-0000-0000-0000-000000000001', '{"course":"Complete HTML5 Fundamentals","quiz":"Pass HTML5 quiz (70%+)","challenges":3}'),
  ('cert0002', 'CSS3 Professional', 'Expert knowledge of CSS3, Flexbox, Grid, and modern styling.', 'c1000000-0000-0000-0000-000000000002', '{"course":"Complete CSS3 & Tailwind","quiz":"Pass CSS quiz (70%+)","challenges":3}'),
  ('cert0003', 'JavaScript Developer', 'Certified JavaScript developer with ES6+ proficiency.', 'c1000000-0000-0000-0000-000000000003', '{"course":"Complete JavaScript ES6+","quiz":"Pass JS quiz (70%+)","challenges":5}'),
  ('cert0004', 'TypeScript Expert', 'Advanced TypeScript skills including generics, decorators, and patterns.', 'c1000000-0000-0000-0000-000000000004', '{"course":"Complete TypeScript Guide","quiz":"Pass TS quiz (75%+)","challenges":5}'),
  ('cert0005', 'React JS Professional', 'Production-level React development with hooks and advanced patterns.', 'c1000000-0000-0000-0000-000000000005', '{"course":"Complete React Mastery","quiz":"Pass React quiz (75%+)","challenges":8}'),
  ('cert0006', 'Node.js Backend Developer', 'Certified Node.js and Express backend developer.', 'c1000000-0000-0000-0000-000000000007', '{"course":"Complete Node.js","quiz":"Pass Node quiz (70%+)","challenges":5}'),
  ('cert0007', 'Full Stack Developer', 'Complete full-stack developer: frontend + backend + databases.', null, '{"courses":["HTML5","CSS3","JavaScript","React","Node.js"],"certifications":5,"challenges":30}')
on conflict (id) do nothing;
