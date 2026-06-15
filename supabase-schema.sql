-- ============================================================
-- R-Learn Platform — Full Supabase Schema
-- Paste this entire file into Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default '',
  email text not null default '',
  role text not null default 'employee' check (role in ('employee', 'mentor', 'admin')),
  department text not null default 'Engineering',
  is_approved boolean not null default false,
  xp integer not null default 0,
  streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Courses
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  category text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  thumbnail_gradient text not null default 'from-blue-500 to-cyan-500',
  total_lessons integer not null default 0,
  estimated_hours integer not null default 1,
  skills text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- User course progress
create table if not exists public.user_course_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  last_accessed timestamptz not null default now(),
  unique(user_id, course_id)
);

-- Challenges
create table if not exists public.challenges (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  category text not null,
  tags text[] not null default '{}',
  starter_code_js text not null default '',
  starter_code_ts text not null default '',
  starter_code_py text not null default '',
  test_cases jsonb not null default '[]',
  xp_reward integer not null default 50,
  hints text[] not null default '{}',
  editorial text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Challenge submissions
create table if not exists public.challenge_submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  challenge_id uuid references public.challenges on delete cascade not null,
  language text not null,
  code text not null,
  passed boolean not null default false,
  test_results jsonb not null default '[]',
  submitted_at timestamptz not null default now(),
  xp_earned integer not null default 0
);

-- Quizzes
create table if not exists public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  category text not null,
  time_limit integer not null default 15,
  xp_reward integer not null default 100,
  pass_threshold integer not null default 70,
  total_questions integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Quiz questions
create table if not exists public.quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes on delete cascade not null,
  question text not null,
  type text not null check (type in ('mcq', 'true_false', 'code_output')),
  options jsonb not null default '[]',
  correct_answer text not null,
  explanation text,
  order_index integer not null default 0
);

-- Quiz attempts
create table if not exists public.quiz_attempts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  quiz_id uuid references public.quizzes on delete cascade not null,
  score integer not null default 0,
  passed boolean not null default false,
  answers jsonb not null default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  xp_earned integer not null default 0
);

-- Certifications
create table if not exists public.certifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  skills text[] not null default '{}',
  required_challenge_count integer not null default 0,
  required_quiz_pass_score integer not null default 70,
  order_index integer not null default 0,
  unlock_requirement text,
  created_at timestamptz not null default now()
);

-- User certifications (earned)
create table if not exists public.user_certifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  cert_id uuid references public.certifications on delete cascade not null,
  issued_date timestamptz not null default now(),
  verification_id text unique not null,
  unique(user_id, cert_id)
);

-- XP transactions
create table if not exists public.xp_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  amount integer not null,
  type text not null check (type in ('challenge', 'quiz', 'course', 'streak', 'login', 'certification')),
  reference_id uuid,
  description text not null,
  created_at timestamptz not null default now()
);

-- User activity feed
create table if not exists public.user_activity (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  action text not null,
  item text not null,
  type text not null,
  xp_earned integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.user_course_progress enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_submissions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.certifications enable row level security;
alter table public.user_certifications enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.user_activity enable row level security;

-- Profiles: all authenticated can read (leaderboard), own insert/update, admin can update all
create policy "profiles_read" on public.profiles for select to authenticated using (true);
create policy "profiles_insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_admin_update" on public.profiles for update to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Courses: all authenticated can read
create policy "courses_read" on public.courses for select to authenticated using (is_published = true);

-- User course progress: own only
create policy "progress_read" on public.user_course_progress for select to authenticated using (auth.uid() = user_id);
create policy "progress_insert" on public.user_course_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "progress_update" on public.user_course_progress for update to authenticated using (auth.uid() = user_id);

-- Challenges: all authenticated can read
create policy "challenges_read" on public.challenges for select to authenticated using (is_published = true);

-- Challenge submissions: own only
create policy "submissions_read" on public.challenge_submissions for select to authenticated using (auth.uid() = user_id);
create policy "submissions_insert" on public.challenge_submissions for insert to authenticated with check (auth.uid() = user_id);

-- Quizzes: all authenticated can read
create policy "quizzes_read" on public.quizzes for select to authenticated using (is_published = true);
create policy "questions_read" on public.quiz_questions for select to authenticated using (true);

-- Quiz attempts: own only
create policy "attempts_read" on public.quiz_attempts for select to authenticated using (auth.uid() = user_id);
create policy "attempts_insert" on public.quiz_attempts for insert to authenticated with check (auth.uid() = user_id);
create policy "attempts_update" on public.quiz_attempts for update to authenticated using (auth.uid() = user_id);

-- Certifications: all authenticated can read
create policy "certs_read" on public.certifications for select to authenticated using (true);

-- User certifications: own only
create policy "user_certs_read" on public.user_certifications for select to authenticated using (auth.uid() = user_id);
create policy "user_certs_insert" on public.user_certifications for insert to authenticated with check (auth.uid() = user_id);

-- XP transactions: own only
create policy "xp_read" on public.xp_transactions for select to authenticated using (auth.uid() = user_id);
create policy "xp_insert" on public.xp_transactions for insert to authenticated with check (auth.uid() = user_id);

-- Activity: own only
create policy "activity_read" on public.user_activity for select to authenticated using (auth.uid() = user_id);
create policy "activity_insert" on public.user_activity for insert to authenticated with check (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, department)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'employee',
    coalesce(new.raw_user_meta_data->>'department', 'Engineering')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add XP (called as authenticated user — only adds to self)
create or replace function public.add_xp(
  p_amount integer,
  p_type text,
  p_description text,
  p_reference_id uuid default null
)
returns void as $$
begin
  update public.profiles
  set xp = xp + p_amount, updated_at = now()
  where id = auth.uid();

  insert into public.xp_transactions (user_id, amount, type, description, reference_id)
  values (auth.uid(), p_amount, p_type, p_description, p_reference_id);
end;
$$ language plpgsql security definer;

-- Update streak (called on login)
create or replace function public.update_streak()
returns void as $$
declare
  v_last_activity date;
  v_current_streak integer;
  v_longest_streak integer;
begin
  select last_activity_date, streak, longest_streak
  into v_last_activity, v_current_streak, v_longest_streak
  from public.profiles
  where id = auth.uid();

  -- Already updated today — skip
  if v_last_activity = current_date then
    return;
  end if;

  if v_last_activity is null then
    v_current_streak := 1;
  elsif v_last_activity = current_date - interval '1 day' then
    v_current_streak := coalesce(v_current_streak, 0) + 1;
  else
    -- Gap of more than 1 day — reset
    v_current_streak := 1;
  end if;

  if v_current_streak > coalesce(v_longest_streak, 0) then
    v_longest_streak := v_current_streak;
  end if;

  update public.profiles
  set
    streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_activity_date = current_date,
    updated_at = now()
  where id = auth.uid();
end;
$$ language plpgsql security definer;

-- Log activity
create or replace function public.log_activity(
  p_action text,
  p_item text,
  p_type text,
  p_xp_earned integer default 0
)
returns void as $$
begin
  insert into public.user_activity (user_id, action, item, type, xp_earned)
  values (auth.uid(), p_action, p_item, p_type, p_xp_earned);
end;
$$ language plpgsql security definer;

-- ============================================================
-- SEED DATA — COURSES
-- ============================================================

insert into public.courses (title, description, category, difficulty, thumbnail_gradient, total_lessons, estimated_hours, skills) values
('HTML5 Fundamentals', 'Master the building blocks of the web with semantic HTML and modern APIs.', 'Frontend', 'beginner', 'from-orange-500 to-red-500', 24, 8, ARRAY['HTML5', 'Semantic HTML', 'Web APIs', 'Forms']),
('CSS3 & Tailwind CSS Master', 'From flexbox to grid, animations, and the Tailwind CSS utility-first approach.', 'Frontend', 'beginner', 'from-blue-400 to-cyan-500', 30, 12, ARRAY['CSS3', 'Flexbox', 'CSS Grid', 'Tailwind CSS', 'Animations']),
('JavaScript ES6+ Developer', 'Deep dive into modern JavaScript with ES6+, async patterns, and functional programming.', 'Frontend', 'intermediate', 'from-yellow-400 to-orange-500', 40, 20, ARRAY['JavaScript', 'ES6+', 'Promises', 'Async/Await', 'Closures']),
('TypeScript Deep Dive', 'Build type-safe applications with generics, utility types, and advanced patterns.', 'Frontend', 'intermediate', 'from-blue-600 to-blue-800', 35, 18, ARRAY['TypeScript', 'Generics', 'Type Guards', 'Decorators']),
('React JS Mastery', 'Master React from hooks to advanced patterns, performance optimization, and state management.', 'Frontend', 'intermediate', 'from-cyan-400 to-blue-500', 45, 25, ARRAY['React', 'Hooks', 'Context', 'Performance']),
('Node.js Backend Development', 'Build scalable server-side applications with Node.js, Express, and REST APIs.', 'Backend', 'intermediate', 'from-green-500 to-emerald-600', 38, 22, ARRAY['Node.js', 'Express', 'REST APIs', 'Middleware']),
('Databases & SQL', 'Master relational databases, SQL queries, and PostgreSQL for production apps.', 'Backend', 'intermediate', 'from-purple-500 to-violet-600', 28, 16, ARRAY['SQL', 'PostgreSQL', 'Database Design', 'Indexing']),
('Git & GitHub Mastery', 'Professional version control, branching strategies, and collaborative development.', 'DevOps', 'beginner', 'from-gray-600 to-gray-800', 20, 8, ARRAY['Git', 'GitHub', 'Branching', 'Pull Requests']);

-- ============================================================
-- SEED DATA — CHALLENGES
-- ============================================================

insert into public.challenges (title, description, difficulty, category, tags, starter_code_js, starter_code_ts, starter_code_py, test_cases, xp_reward, hints) values
(
  'Two Sum',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  'Easy', 'Arrays', ARRAY['arrays', 'hash-map'],
  'function twoSum(nums, target) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(twoSum([2,7,11,15], 9));' || E'\n' || 'console.log(twoSum([3,2,4], 6));',
  'function twoSum(nums: number[], target: number): number[] {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(twoSum([2,7,11,15], 9));' || E'\n' || 'console.log(twoSum([3,2,4], 6));',
  'def two_sum(nums, target):' || E'\n' || '    # Your code here' || E'\n' || '    pass' || E'\n\n' || 'print(two_sum([2,7,11,15], 9))' || E'\n' || 'print(two_sum([3,2,4], 6))',
  '[{"id":1,"input":"[2,7,11,15], 9","expected":"[0,1]"},{"id":2,"input":"[3,2,4], 6","expected":"[1,2]"},{"id":3,"input":"[3,3], 6","expected":"[0,1]"}]',
  50,
  ARRAY['Try using a hash map to store numbers you''ve seen', 'For each number, check if target minus number exists', 'This can be solved in O(n) time']
),
(
  'Reverse String',
  'Write a function that reverses a string given as an array of characters. Do it in-place.',
  'Easy', 'Strings', ARRAY['strings', 'two-pointers'],
  'function reverseString(s) {' || E'\n' || '  // Your code here' || E'\n' || '  return s;' || E'\n' || '}' || E'\n\n' || 'console.log(reverseString(["h","e","l","l","o"]));',
  'function reverseString(s: string[]): void {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(reverseString(["h","e","l","l","o"]));',
  'def reverse_string(s):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
  '[{"id":1,"input":"[\"h\",\"e\",\"l\",\"l\",\"o\"]","expected":"[\"o\",\"l\",\"l\",\"e\",\"h\"]"},{"id":2,"input":"[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]","expected":"[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]"}]',
  40,
  ARRAY['Use two pointers — one at start, one at end', 'Swap characters and move pointers inward']
),
(
  'FizzBuzz',
  'Return an array of strings 1 to n. For multiples of 3 use "Fizz", multiples of 5 use "Buzz", both use "FizzBuzz".',
  'Easy', 'Logic', ARRAY['arrays', 'math'],
  'function fizzBuzz(n) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(fizzBuzz(15));',
  'function fizzBuzz(n: number): string[] {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(fizzBuzz(15));',
  'def fizz_buzz(n):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
  '[{"id":1,"input":"15","expected":"[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]"}]',
  30,
  ARRAY['Use the modulo operator %', 'Check for divisibility by 15 before 3 or 5']
),
(
  'Valid Parentheses',
  'Given a string containing (, ), {, }, [ and ], determine if the input string is valid.',
  'Easy', 'Stacks', ARRAY['stacks', 'strings'],
  'function isValid(s) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(isValid("()"));' || E'\n' || 'console.log(isValid("()[]{}"));' || E'\n' || 'console.log(isValid("(]"));',
  'function isValid(s: string): boolean {' || E'\n' || '  // Your code here' || E'\n' || '}',
  'def is_valid(s):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
  '[{"id":1,"input":"()","expected":"true"},{"id":2,"input":"()[]{}","expected":"true"},{"id":3,"input":"(]","expected":"false"},{"id":4,"input":"([)]","expected":"false"}]',
  60,
  ARRAY['Use a stack data structure', 'Push opening brackets, pop and compare for closing ones']
),
(
  'Maximum Subarray',
  'Find the contiguous subarray (containing at least one number) which has the largest sum.',
  'Medium', 'Dynamic Programming', ARRAY['dp', 'arrays'],
  'function maxSubArray(nums) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));',
  'function maxSubArray(nums: number[]): number {' || E'\n' || '  // Your code here' || E'\n' || '}',
  'def max_sub_array(nums):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
  '[{"id":1,"input":"[-2,1,-3,4,-1,2,1,-5,4]","expected":"6"},{"id":2,"input":"[1]","expected":"1"},{"id":3,"input":"[5,4,-1,7,8]","expected":"23"}]',
  100,
  ARRAY['Look up Kadane''s algorithm', 'Track the current sum and the maximum found so far', 'Reset current sum to 0 when it goes negative']
),
(
  'Merge Sorted Arrays',
  'Merge two sorted integer arrays nums1 and nums2 into one sorted array in-place.',
  'Medium', 'Arrays', ARRAY['arrays', 'two-pointers'],
  'function merge(nums1, m, nums2, n) {' || E'\n' || '  // Your code here' || E'\n' || '}',
  'function merge(nums1: number[], m: number, nums2: number[], n: number): void {' || E'\n' || '  // Your code here' || E'\n' || '}',
  'def merge(nums1, m, nums2, n):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
  '[{"id":1,"input":"[1,2,3,0,0,0], 3, [2,5,6], 3","expected":"[1,2,2,3,5,6]"},{"id":2,"input":"[1], 1, [], 0","expected":"[1]"}]',
  100,
  ARRAY['Work backwards from the end of nums1', 'Use three pointers: end of nums1, end of nums2, and end of the merged section']
),
(
  'Binary Search',
  'Given a sorted array of integers and a target, return its index. Return -1 if not found.',
  'Easy', 'Search', ARRAY['search', 'divide-and-conquer'],
  'function search(nums, target) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(search([-1,0,3,5,9,12], 9));',
  'function search(nums: number[], target: number): number {' || E'\n' || '  // Your code here' || E'\n' || '}',
  'def search(nums, target):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
  '[{"id":1,"input":"[-1,0,3,5,9,12], 9","expected":"4"},{"id":2,"input":"[-1,0,3,5,9,12], 2","expected":"-1"}]',
  50,
  ARRAY['Use left and right pointers', 'Calculate mid = (left + right) / 2', 'Narrow the search range based on comparison']
),
(
  'Longest Common Prefix',
  'Write a function to find the longest common prefix string amongst an array of strings.',
  'Easy', 'Strings', ARRAY['strings'],
  'function longestCommonPrefix(strs) {' || E'\n' || '  // Your code here' || E'\n' || '}' || E'\n\n' || 'console.log(longestCommonPrefix(["flower","flow","flight"]));',
  'function longestCommonPrefix(strs: string[]): string {' || E'\n' || '  // Your code here' || E'\n' || '}',
  'def longest_common_prefix(strs):' || E'\n' || '    # Your code here' || E'\n' || '    pass',
  '[{"id":1,"input":"[\"flower\",\"flow\",\"flight\"]","expected":"\"fl\""},{"id":2,"input":"[\"dog\",\"racecar\",\"car\"]","expected":"\"\""}]',
  40,
  ARRAY['Compare characters column by column', 'Stop at the shortest string or first mismatch']
);

-- ============================================================
-- SEED DATA — QUIZZES
-- ============================================================

insert into public.quizzes (title, description, difficulty, category, time_limit, xp_reward, pass_threshold, total_questions) values
('HTML5 Basics', 'Test your knowledge of HTML5 semantic elements and web APIs', 'beginner', 'Frontend', 10, 80, 70, 5),
('JavaScript Fundamentals', 'Core JavaScript: closures, prototypes, and the event loop', 'intermediate', 'Frontend', 15, 120, 70, 5),
('React Hooks Deep Dive', 'useState, useEffect, useCallback, useMemo, and custom hooks', 'intermediate', 'Frontend', 20, 150, 75, 5),
('TypeScript Types', 'Generics, utility types, conditional types, and type narrowing', 'intermediate', 'Frontend', 15, 130, 70, 5),
('Node.js Fundamentals', 'Event loop, streams, modules, and async operations', 'intermediate', 'Backend', 15, 120, 70, 5);

-- Quiz questions for HTML5 Basics
do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'HTML5 Basics';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'Which HTML5 element is used to define navigation links?', 'mcq', '["<nav>","<menu>","<links>","<navigation>"]', '<nav>', 'The <nav> element defines a set of navigation links.', 0),
  (v_quiz_id, 'What does the <article> element represent?', 'mcq', '["Any content","Self-contained content","Navigation","Header"]', 'Self-contained content', 'The <article> element represents self-contained content that could be independently distributed.', 1),
  (v_quiz_id, 'The <canvas> element requires JavaScript to draw graphics.', 'true_false', '["True","False"]', 'True', 'The canvas element only provides a drawing surface; JavaScript is required to render graphics onto it.', 2),
  (v_quiz_id, 'Which attribute makes an input field mandatory?', 'mcq', '["mandatory","required","must","validate"]', 'required', 'The required attribute specifies that an input field must be filled out before submitting.', 3),
  (v_quiz_id, 'Which HTML5 API stores data in the browser between sessions?', 'mcq', '["sessionStorage","cookies","localStorage","indexedDB"]', 'localStorage', 'localStorage persists data even after the browser window is closed, unlike sessionStorage.', 4);
end $$;

-- Quiz questions for JavaScript Fundamentals
do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'JavaScript Fundamentals';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What is a closure in JavaScript?', 'mcq', '["A loop construct","A function with access to its outer scope","An error handler","A module pattern"]', 'A function with access to its outer scope', 'A closure is a function that retains access to its enclosing scope even after the outer function has returned.', 0),
  (v_quiz_id, 'JavaScript is single-threaded.', 'true_false', '["True","False"]', 'True', 'JavaScript runs on a single thread, using the event loop to handle asynchronous operations.', 1),
  (v_quiz_id, 'What does typeof null return?', 'mcq', '["null","undefined","object","string"]', 'object', 'This is a well-known JavaScript bug — typeof null returns "object" due to how null was originally implemented.', 2),
  (v_quiz_id, 'Which method creates a new array without modifying the original?', 'mcq', '["push()","pop()","map()","splice()"]', 'map()', 'map() returns a new array with the results of calling a function on each element.', 3),
  (v_quiz_id, 'async/await is syntactic sugar over Promises.', 'true_false', '["True","False"]', 'True', 'async/await was introduced to simplify working with Promises, making async code look synchronous.', 4);
end $$;

-- Quiz questions for React Hooks
do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'React Hooks Deep Dive';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'Which hook runs after every render by default?', 'mcq', '["useState","useCallback","useEffect","useRef"]', 'useEffect', 'useEffect with no dependency array runs after every render.', 0),
  (v_quiz_id, 'Can you call hooks inside loops or conditions?', 'true_false', '["True","False"]', 'False', 'Hooks must be called at the top level, never inside loops, conditions, or nested functions.', 1),
  (v_quiz_id, 'What does useCallback return?', 'mcq', '["A memoized value","A memoized function","A ref object","A state tuple"]', 'A memoized function', 'useCallback returns a memoized version of the callback function that only changes if dependencies change.', 2),
  (v_quiz_id, 'What is the purpose of the dependency array in useEffect?', 'mcq', '["Set initial state","Control when effect runs","Create a ref","Memoize a value"]', 'Control when effect runs', 'The dependency array tells React when to re-run the effect — only when listed values change.', 3),
  (v_quiz_id, 'useMemo is used to memoize computed values.', 'true_false', '["True","False"]', 'True', 'useMemo memoizes the result of an expensive calculation, recomputing only when dependencies change.', 4);
end $$;

-- Quiz questions for TypeScript Types
do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'TypeScript Types';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What is the correct syntax for a generic function?', 'mcq', '["function id(x): T","function id<T>(x: T): T","function id[T](x: T)","function<T> id(x: T)"]', 'function id<T>(x: T): T', 'Generics use angle brackets <T> to declare a type parameter before the function parameters.', 0),
  (v_quiz_id, 'TypeScript is a superset of JavaScript.', 'true_false', '["True","False"]', 'True', 'TypeScript adds static typing and other features on top of JavaScript and compiles to plain JavaScript.', 1),
  (v_quiz_id, 'Which utility type makes all properties optional?', 'mcq', '["Required<T>","Partial<T>","Readonly<T>","Pick<T,K>"]', 'Partial<T>', 'Partial<T> constructs a type with all properties of T set to optional.', 2),
  (v_quiz_id, 'What is a union type?', 'mcq', '["Type that extends another","Type combining two shapes","Type that can be one of several types","A generic constraint"]', 'Type that can be one of several types', 'A union type (A | B) means a value can be of type A or type B.', 3),
  (v_quiz_id, 'The never type represents values that never occur.', 'true_false', '["True","False"]', 'True', 'never is used for functions that always throw or have unreachable endpoints, or for exhaustive checks.', 4);
end $$;

-- Quiz questions for Node.js Fundamentals
do $$
declare v_quiz_id uuid;
begin
  select id into v_quiz_id from public.quizzes where title = 'Node.js Fundamentals';
  insert into public.quiz_questions (quiz_id, question, type, options, correct_answer, explanation, order_index) values
  (v_quiz_id, 'What is the event loop in Node.js?', 'mcq', '["A for loop","Mechanism handling async callbacks","A DOM event","A module system"]', 'Mechanism handling async callbacks', 'The event loop allows Node.js to perform non-blocking I/O operations by offloading operations to the OS.', 0),
  (v_quiz_id, 'Node.js can handle multiple requests concurrently despite being single-threaded.', 'true_false', '["True","False"]', 'True', 'Node.js uses an event-driven, non-blocking I/O model making it efficient for concurrent requests.', 1),
  (v_quiz_id, 'Which module is used to create HTTP servers in Node.js?', 'mcq', '["fs","path","http","url"]', 'http', 'The built-in http module provides utilities for creating HTTP servers and making HTTP requests.', 2),
  (v_quiz_id, 'What does require() do in Node.js?', 'mcq', '["Define a function","Throw an error","Import a module","Export a value"]', 'Import a module', 'require() is the CommonJS module system function for importing modules in Node.js.', 3),
  (v_quiz_id, 'Streams in Node.js can only be used for file reading.', 'true_false', '["True","False"]', 'False', 'Streams can be used for reading/writing files, HTTP requests/responses, TCP connections, and more.', 4);
end $$;

-- ============================================================
-- SEED DATA — CERTIFICATIONS
-- ============================================================

insert into public.certifications (title, description, skills, required_challenge_count, required_quiz_pass_score, order_index, unlock_requirement) values
('HTML5 Fundamentals', 'Demonstrate mastery of HTML5 semantic elements and web APIs.', ARRAY['HTML5', 'Semantic HTML', 'Web APIs'], 2, 70, 1, null),
('CSS3 & Tailwind Master', 'Expert-level CSS3, flexbox, grid, and Tailwind CSS skills.', ARRAY['CSS3', 'Tailwind', 'Flexbox', 'CSS Grid'], 2, 70, 2, null),
('JavaScript ES6+ Developer', 'Advanced JavaScript including ES6+, async/await, and functional programming.', ARRAY['JavaScript', 'ES6+', 'Async/Await', 'Promises'], 4, 70, 3, null),
('React JS Professional', 'Complete React development including hooks and performance optimization.', ARRAY['React', 'Hooks', 'Performance'], 5, 75, 4, 'Complete JavaScript ES6+ first'),
('TypeScript Expert', 'Type-safe programming with generics and advanced TypeScript patterns.', ARRAY['TypeScript', 'Generics', 'Type Guards'], 4, 75, 5, null),
('Node.js Backend Developer', 'Build scalable APIs and backend services with Node.js.', ARRAY['Node.js', 'Express', 'REST APIs'], 6, 80, 6, 'Complete React JS Professional first'),
('Full Stack Developer', 'Complete full-stack mastery across frontend and backend technologies.', ARRAY['React', 'Node.js', 'TypeScript', 'Databases', 'System Design'], 8, 85, 7, 'Earn 4 individual certifications first');

-- ============================================================
-- AFTER RUNNING THIS SCRIPT:
-- 1. Go to Authentication > Settings and enable "Email OTP" (disable magic link)
-- 2. Go to Table Editor > profiles and manually set your first admin user:
--    role = 'admin', is_approved = true
-- ============================================================

-- ============================================================
-- MIGRATION PATCH — run separately if you already applied the script above
-- ============================================================

-- Add xp_reward to courses
alter table public.courses add column if not exists xp_reward integer not null default 100;

-- Update existing seed courses with XP values
update public.courses set xp_reward = 200 where title = 'HTML5 Fundamentals';
update public.courses set xp_reward = 250 where title = 'CSS3 & Tailwind CSS Master';
update public.courses set xp_reward = 400 where title = 'JavaScript ES6+ Developer';
update public.courses set xp_reward = 350 where title = 'TypeScript Deep Dive';
update public.courses set xp_reward = 500 where title = 'React JS Mastery';
update public.courses set xp_reward = 450 where title = 'Node.js Backend Development';
update public.courses set xp_reward = 350 where title = 'Databases & SQL';
update public.courses set xp_reward = 200 where title = 'Git & GitHub Mastery';

-- Allow admins to read all user activity (for admin dashboard feed)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'activity_admin_read' and tablename = 'user_activity'
  ) then
    execute $policy$
      create policy "activity_admin_read" on public.user_activity
        for select to authenticated
        using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
    $policy$;
  end if;
end $$;
