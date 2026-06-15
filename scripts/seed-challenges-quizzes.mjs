import dotenv from "dotenv";
dotenv.config();

const BASE = "https://rdnhbreuusnfvwmrecor.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbmhicmV1dXNuZnZ3bXJlY29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTg1ODIsImV4cCI6MjA5NTM3NDU4Mn0.eVSHIHpyNUhfYOlBdoDRGTXefkRPm_YCUsmRjz4sl_o";
const H = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal" };

async function upsert(table, rows) {
  const r = await fetch(`${BASE}/rest/v1/${table}`, { method: "POST", headers: H, body: JSON.stringify(rows) });
  if (!r.ok) console.error(`${table} error:`, (await r.text()).slice(0, 300));
  else console.log(`✓ ${table}: ${rows.length} rows`);
}

// ═══════════════════════════════════════════════════════════════
// CHALLENGES
// ═══════════════════════════════════════════════════════════════
await upsert("challenges", [
  { id:"ch001", title:"Two Sum", description:"Given an array of integers and a target, return indices of the two numbers that add up to target.", difficulty:"Easy", category:"Arrays", points:10, xp_reward:50,
    starter_code_js:"function twoSum(nums, target) {\n  // Your code here\n}",
    starter_code_ts:"function twoSum(nums: number[], target: number): number[] {\n  return [];\n}",
    starter_code_python:"def two_sum(nums: list[int], target: int) -> list[int]:\n    pass",
    test_cases:JSON.stringify([{input:{nums:[2,7,11,15],target:9},expected:[0,1]},{input:{nums:[3,2,4],target:6},expected:[1,2]}]),
    solution:"function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const c = target - nums[i];\n    if (map.has(c)) return [map.get(c), i];\n    map.set(nums[i], i);\n  }\n}" },

  { id:"ch002", title:"Reverse a String", description:"Write a function that reverses a string without using the built-in reverse() method.", difficulty:"Easy", category:"Strings", points:10, xp_reward:50,
    starter_code_js:"function reverseString(str) {\n  // Your code here\n}",
    starter_code_ts:"function reverseString(str: string): string {\n  return '';\n}",
    starter_code_python:"def reverse_string(s: str) -> str:\n    pass",
    test_cases:JSON.stringify([{input:"hello",expected:"olleh"},{input:"JavaScript",expected:"tpircSavaJ"}]),
    solution:"function reverseString(str) {\n  return str.split('').reduce((acc, c) => c + acc, '');\n}" },

  { id:"ch003", title:"FizzBuzz", description:"Return an array from 1 to n: 'Fizz' for multiples of 3, 'Buzz' for 5, 'FizzBuzz' for both, otherwise the number as string.", difficulty:"Easy", category:"Loops", points:10, xp_reward:50,
    starter_code_js:"function fizzBuzz(n) {\n  // Return array\n}",
    starter_code_ts:"function fizzBuzz(n: number): string[] {\n  return [];\n}",
    starter_code_python:"def fizz_buzz(n: int) -> list[str]:\n    pass",
    test_cases:JSON.stringify([{input:15,expected:["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]}]),
    solution:"function fizzBuzz(n) {\n  return Array.from({length:n},(_,i)=>{\n    const x=i+1;\n    if(x%15===0)return'FizzBuzz';\n    if(x%3===0)return'Fizz';\n    if(x%5===0)return'Buzz';\n    return String(x);\n  });\n}" },

  { id:"ch004", title:"Palindrome Check", description:"Check if a string reads the same forwards and backwards. Ignore case and non-alphanumeric characters.", difficulty:"Easy", category:"Strings", points:10, xp_reward:50,
    starter_code_js:"function isPalindrome(str) {\n  // Your code here\n}",
    starter_code_ts:"function isPalindrome(str: string): boolean {\n  return false;\n}",
    starter_code_python:"def is_palindrome(s: str) -> bool:\n    pass",
    test_cases:JSON.stringify([{input:"racecar",expected:true},{input:"hello",expected:false},{input:"A man a plan a canal Panama",expected:true}]),
    solution:"function isPalindrome(str) {\n  const c = str.toLowerCase().replace(/[^a-z0-9]/g,'');\n  return c === c.split('').reverse().join('');\n}" },

  { id:"ch005", title:"Maximum in Array", description:"Find the maximum value in an array without using Math.max().", difficulty:"Easy", category:"Arrays", points:10, xp_reward:50,
    starter_code_js:"function findMax(nums) {\n  // Your code here\n}",
    starter_code_ts:"function findMax(nums: number[]): number {\n  return 0;\n}",
    starter_code_python:"def find_max(nums: list[int]) -> int:\n    pass",
    test_cases:JSON.stringify([{input:[3,1,4,1,5,9,2,6],expected:9},{input:[-5,-1,-10],expected:-1}]),
    solution:"function findMax(nums) {\n  return nums.reduce((m,n)=>n>m?n:m,nums[0]);\n}" },

  { id:"ch006", title:"Count Vowels", description:"Count the number of vowels (a,e,i,o,u) in a string. Case insensitive.", difficulty:"Easy", category:"Strings", points:10, xp_reward:50,
    starter_code_js:"function countVowels(str) {\n  // Your code here\n}",
    starter_code_ts:"function countVowels(str: string): number {\n  return 0;\n}",
    starter_code_python:"def count_vowels(s: str) -> int:\n    pass",
    test_cases:JSON.stringify([{input:"Hello World",expected:3},{input:"rhythm",expected:0},{input:"aeiou",expected:5}]),
    solution:"function countVowels(str) {\n  return (str.match(/[aeiou]/gi)||[]).length;\n}" },

  { id:"ch007", title:"Remove Duplicates", description:"Return a new array with all duplicates removed, preserving order.", difficulty:"Easy", category:"Arrays", points:10, xp_reward:50,
    starter_code_js:"function removeDuplicates(arr) {\n  // Your code here\n}",
    starter_code_ts:"function removeDuplicates<T>(arr: T[]): T[] {\n  return [];\n}",
    starter_code_python:"def remove_duplicates(arr: list) -> list:\n    pass",
    test_cases:JSON.stringify([{input:[1,2,2,3,3,4],expected:[1,2,3,4]},{input:["a","b","a","c"],expected:["a","b","c"]}]),
    solution:"function removeDuplicates(arr) {\n  return [...new Set(arr)];\n}" },

  { id:"ch008", title:"Fibonacci Number", description:"Return the nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).", difficulty:"Easy", category:"Recursion", points:15, xp_reward:75,
    starter_code_js:"function fibonacci(n) {\n  // Your code here\n}",
    starter_code_ts:"function fibonacci(n: number): number {\n  return 0;\n}",
    starter_code_python:"def fibonacci(n: int) -> int:\n    pass",
    test_cases:JSON.stringify([{input:0,expected:0},{input:1,expected:1},{input:10,expected:55},{input:20,expected:6765}]),
    solution:"function fibonacci(n) {\n  if(n<=1)return n;\n  let a=0,b=1;\n  for(let i=2;i<=n;i++)[a,b]=[b,a+b];\n  return b;\n}" },

  { id:"ch009", title:"Flatten Array", description:"Flatten a nested array to any depth.", difficulty:"Medium", category:"Arrays", points:20, xp_reward:100,
    starter_code_js:"function flattenArray(arr) {\n  // Your code here\n}",
    starter_code_ts:"function flattenArray(arr: any[]): any[] {\n  return [];\n}",
    starter_code_python:"def flatten_array(arr: list) -> list:\n    pass",
    test_cases:JSON.stringify([{input:[1,[2,3],[4,[5,6]]],expected:[1,2,3,4,5,6]}]),
    solution:"function flattenArray(arr) {\n  return arr.reduce((f,i)=>f.concat(Array.isArray(i)?flattenArray(i):i),[]);\n}" },

  { id:"ch010", title:"Valid Parentheses", description:"Given a string of brackets (){}[], determine if it's valid. Each open bracket must be closed in the correct order.", difficulty:"Medium", category:"Stack", points:20, xp_reward:100,
    starter_code_js:"function isValid(s) {\n  // Your code here\n}",
    starter_code_ts:"function isValid(s: string): boolean {\n  return false;\n}",
    starter_code_python:"def is_valid(s: str) -> bool:\n    pass",
    test_cases:JSON.stringify([{input:"()",expected:true},{input:"()[]{}", expected:true},{input:"(]",expected:false},{input:"{[]}",expected:true}]),
    solution:"function isValid(s) {\n  const stack=[];\n  const map={')':`(`,'}':`{`,']':'['};\n  for(const c of s){\n    if('([{'.includes(c))stack.push(c);\n    else if(stack.pop()!==map[c])return false;\n  }\n  return stack.length===0;\n}" },

  { id:"ch011", title:"Group Anagrams", description:"Group strings that are anagrams of each other.", difficulty:"Medium", category:"Strings", points:25, xp_reward:125,
    starter_code_js:"function groupAnagrams(strs) {\n  // Your code here\n}",
    starter_code_ts:"function groupAnagrams(strs: string[]): string[][] {\n  return [];\n}",
    starter_code_python:"def group_anagrams(strs: list[str]) -> list[list[str]]:\n    pass",
    test_cases:JSON.stringify([{input:["eat","tea","tan","ate","nat","bat"],expected:[["eat","tea","ate"],["tan","nat"],["bat"]]}]),
    solution:"function groupAnagrams(strs) {\n  const m=new Map();\n  for(const s of strs){\n    const k=[...s].sort().join('');\n    if(!m.has(k))m.set(k,[]);\n    m.get(k).push(s);\n  }\n  return[...m.values()];\n}" },

  { id:"ch012", title:"Binary Search", description:"Implement binary search. Return the index if found, -1 if not.", difficulty:"Medium", category:"Searching", points:20, xp_reward:100,
    starter_code_js:"function binarySearch(nums, target) {\n  // Your code here\n}",
    starter_code_ts:"function binarySearch(nums: number[], target: number): number {\n  return -1;\n}",
    starter_code_python:"def binary_search(nums: list[int], target: int) -> int:\n    pass",
    test_cases:JSON.stringify([{input:{nums:[-1,0,3,5,9,12],target:9},expected:4},{input:{nums:[-1,0,3,5,9,12],target:2},expected:-1}]),
    solution:"function binarySearch(nums,target){\n  let l=0,r=nums.length-1;\n  while(l<=r){\n    const m=Math.floor((l+r)/2);\n    if(nums[m]===target)return m;\n    else if(nums[m]<target)l=m+1;\n    else r=m-1;\n  }\n  return -1;\n}" },

  { id:"ch013", title:"Merge Sorted Arrays", description:"Merge two sorted arrays into one sorted array.", difficulty:"Medium", category:"Arrays", points:20, xp_reward:100,
    starter_code_js:"function mergeSorted(a, b) {\n  // Your code here\n}",
    starter_code_ts:"function mergeSorted(a: number[], b: number[]): number[] {\n  return [];\n}",
    starter_code_python:"def merge_sorted(a: list[int], b: list[int]) -> list[int]:\n    pass",
    test_cases:JSON.stringify([{input:{a:[1,3,5],b:[2,4,6]},expected:[1,2,3,4,5,6]},{input:{a:[],b:[1]},expected:[1]}]),
    solution:"function mergeSorted(a,b){\n  const r=[];\n  let i=0,j=0;\n  while(i<a.length&&j<b.length){\n    if(a[i]<=b[j])r.push(a[i++]);\n    else r.push(b[j++]);\n  }\n  return[...r,...a.slice(i),...b.slice(j)];\n}" },

  { id:"ch014", title:"Maximum Subarray", description:"Find the contiguous subarray with the largest sum (Kadane's algorithm).", difficulty:"Medium", category:"Arrays", points:25, xp_reward:125,
    starter_code_js:"function maxSubArray(nums) {\n  // Kadane's algorithm\n}",
    starter_code_ts:"function maxSubArray(nums: number[]): number {\n  return 0;\n}",
    starter_code_python:"def max_sub_array(nums: list[int]) -> int:\n    pass",
    test_cases:JSON.stringify([{input:[-2,1,-3,4,-1,2,1,-5,4],expected:6},{input:[1],expected:1},{input:[-1,-2,-3],expected:-1}]),
    solution:"function maxSubArray(nums){\n  let max=nums[0],cur=nums[0];\n  for(let i=1;i<nums.length;i++){\n    cur=Math.max(nums[i],cur+nums[i]);\n    max=Math.max(max,cur);\n  }\n  return max;\n}" },

  { id:"ch015", title:"Debounce Function", description:"Implement a debounce function that delays execution until after 'delay' ms have passed since the last call.", difficulty:"Medium", category:"JavaScript", points:25, xp_reward:125,
    starter_code_js:"function debounce(fn, delay) {\n  // Your code here\n}",
    starter_code_ts:"function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {\n  return (...args: Parameters<T>) => {};\n}",
    starter_code_python:"def debounce(fn, delay):\n    pass",
    test_cases:JSON.stringify([{input:"debounce should return a function",expected:"function"}]),
    solution:"function debounce(fn,delay){\n  let t;\n  return function(...args){\n    clearTimeout(t);\n    t=setTimeout(()=>fn.apply(this,args),delay);\n  };\n}" },

  { id:"ch016", title:"Deep Clone Object", description:"Create a deep copy of an object without using JSON.parse/stringify.", difficulty:"Medium", category:"JavaScript", points:25, xp_reward:125,
    starter_code_js:"function deepClone(obj) {\n  // Don't use JSON.parse/stringify\n}",
    starter_code_ts:"function deepClone<T>(obj: T): T {\n  return obj;\n}",
    starter_code_python:"def deep_clone(obj):\n    pass",
    test_cases:JSON.stringify([{input:{a:1,b:{c:2}},expected:{a:1,b:{c:2}}}]),
    solution:"function deepClone(obj){\n  if(obj===null||typeof obj!=='object')return obj;\n  if(Array.isArray(obj))return obj.map(deepClone);\n  return Object.fromEntries(Object.entries(obj).map(([k,v])=>[k,deepClone(v)]));\n}" },

  { id:"ch017", title:"Longest Common Prefix", description:"Find the longest common prefix string among an array of strings.", difficulty:"Medium", category:"Strings", points:20, xp_reward:100,
    starter_code_js:"function longestCommonPrefix(strs) {\n  // Your code here\n}",
    starter_code_ts:"function longestCommonPrefix(strs: string[]): string {\n  return '';\n}",
    starter_code_python:"def longest_common_prefix(strs: list[str]) -> str:\n    pass",
    test_cases:JSON.stringify([{input:["flower","flow","flight"],expected:"fl"},{input:["dog","racecar","car"],expected:""},{input:["interview","internal","inter"],expected:"inter"}]),
    solution:"function longestCommonPrefix(strs){\n  if(!strs.length)return'';\n  let p=strs[0];\n  for(let i=1;i<strs.length;i++){\n    while(!strs[i].startsWith(p)){\n      p=p.slice(0,-1);\n      if(!p)return'';\n    }\n  }\n  return p;\n}" },

  { id:"ch018", title:"Implement Promise.all", description:"Implement your own version of Promise.all without using the built-in.", difficulty:"Hard", category:"JavaScript", points:30, xp_reward:150,
    starter_code_js:"function myPromiseAll(promises) {\n  // Your code here\n}",
    starter_code_ts:"function myPromiseAll<T>(promises: Promise<T>[]): Promise<T[]> {\n  return Promise.resolve([]);\n}",
    starter_code_python:"async def my_gather(*coros):\n    pass",
    test_cases:JSON.stringify([{input:"array of resolved promises",expected:"array of values"}]),
    solution:"function myPromiseAll(promises){\n  return new Promise((resolve,reject)=>{\n    const r=[];\n    let done=0;\n    if(!promises.length)return resolve([]);\n    promises.forEach((p,i)=>{\n      Promise.resolve(p).then(v=>{\n        r[i]=v;\n        if(++done===promises.length)resolve(r);\n      }).catch(reject);\n    });\n  });\n}" },

  { id:"ch019", title:"LRU Cache", description:"Design an LRU Cache with O(1) get and put operations.", difficulty:"Hard", category:"Algorithms", points:40, xp_reward:200,
    starter_code_js:"class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n  }\n  get(key) {}\n  put(key, value) {}\n}",
    starter_code_ts:"class LRUCache {\n  constructor(private capacity: number) {}\n  get(key: number): number { return -1; }\n  put(key: number, value: number): void {}\n}",
    starter_code_python:"class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass",
    test_cases:JSON.stringify([{input:"LRU(2): put(1,1),put(2,2),get(1)→1,put(3,3),get(2)→-1",expected:"correct eviction"}]),
    solution:"class LRUCache{\n  constructor(c){this.c=c;this.m=new Map();}\n  get(k){if(!this.m.has(k))return -1;const v=this.m.get(k);this.m.delete(k);this.m.set(k,v);return v;}\n  put(k,v){this.m.delete(k);if(this.m.size>=this.c)this.m.delete(this.m.keys().next().value);this.m.set(k,v);}\n}" },

  { id:"ch020", title:"Merge Sort", description:"Implement the merge sort algorithm.", difficulty:"Hard", category:"Sorting", points:30, xp_reward:150,
    starter_code_js:"function mergeSort(arr) {\n  // Your code here\n}",
    starter_code_ts:"function mergeSort(arr: number[]): number[] {\n  return arr;\n}",
    starter_code_python:"def merge_sort(arr: list[int]) -> list[int]:\n    pass",
    test_cases:JSON.stringify([{input:[38,27,43,3,9,82,10],expected:[3,9,10,27,38,43,82]}]),
    solution:"function mergeSort(arr){\n  if(arr.length<=1)return arr;\n  const m=Math.floor(arr.length/2);\n  const L=mergeSort(arr.slice(0,m));\n  const R=mergeSort(arr.slice(m));\n  const r=[];\n  let i=0,j=0;\n  while(i<L.length&&j<R.length)L[i]<=R[j]?r.push(L[i++]):r.push(R[j++]);\n  return[...r,...L.slice(i),...R.slice(j)];\n}" },
]);

// ═══════════════════════════════════════════════════════════════
// QUIZZES + QUESTIONS
// ═══════════════════════════════════════════════════════════════
await upsert("quizzes", [
  {id:"q001",title:"HTML5 Fundamentals Quiz",description:"Test your HTML5 knowledge",category:"Frontend",difficulty:"Beginner",time_limit_minutes:20,pass_percentage:70},
  {id:"q002",title:"CSS3 & Tailwind Quiz",description:"Test your CSS mastery",category:"Frontend",difficulty:"Beginner",time_limit_minutes:20,pass_percentage:70},
  {id:"q003",title:"JavaScript ES6+ Quiz",description:"Test your JavaScript knowledge",category:"Frontend",difficulty:"Intermediate",time_limit_minutes:25,pass_percentage:70},
  {id:"q004",title:"TypeScript Quiz",description:"Test your TypeScript types and patterns",category:"Frontend",difficulty:"Intermediate",time_limit_minutes:20,pass_percentage:70},
  {id:"q005",title:"React JS Quiz",description:"Test your React hooks and patterns",category:"Frontend",difficulty:"Intermediate",time_limit_minutes:25,pass_percentage:70},
  {id:"q006",title:"Node.js Quiz",description:"Test your Node.js and event loop knowledge",category:"Backend",difficulty:"Intermediate",time_limit_minutes:20,pass_percentage:70},
  {id:"q007",title:"REST API Design Quiz",description:"Test your API design knowledge",category:"Backend",difficulty:"Intermediate",time_limit_minutes:20,pass_percentage:70},
  {id:"q008",title:"SQL & Databases Quiz",description:"Test your SQL and database design knowledge",category:"Backend",difficulty:"Intermediate",time_limit_minutes:25,pass_percentage:70},
  {id:"q009",title:"Git & GitHub Quiz",description:"Test your version control knowledge",category:"DevOps",difficulty:"Beginner",time_limit_minutes:15,pass_percentage:70},
  {id:"q010",title:"System Design Quiz",description:"Test your architecture and scalability knowledge",category:"System Design",difficulty:"Advanced",time_limit_minutes:30,pass_percentage:70},
]);

await upsert("quiz_questions", [
  // HTML5
  {quiz_id:"q001",question:"Which HTML5 element represents the main navigation?",options:JSON.stringify(["<navigation>","<nav>","<menu>","<navbar>"]),correct_answer:1,explanation:"<nav> is the semantic HTML5 navigation element.",order_index:1},
  {quiz_id:"q001",question:"What does <!DOCTYPE html> do?",options:JSON.stringify(["Adds a comment","Tells browser this is HTML5","Links CSS","Creates a header"]),correct_answer:1,explanation:"<!DOCTYPE html> enables HTML5 standards mode.",order_index:2},
  {quiz_id:"q001",question:"Which attribute makes an input required?",options:JSON.stringify(["mandatory","compulsory","required","validate"]),correct_answer:2,explanation:"The 'required' attribute prevents submission if empty.",order_index:3},
  {quiz_id:"q001",question:"What is the correct largest heading element?",options:JSON.stringify(["<heading>","<h6>","<head>","<h1>"]),correct_answer:3,explanation:"<h1> is the largest and most important heading.",order_index:4},
  {quiz_id:"q001",question:"What is the purpose of the alt attribute on img?",options:JSON.stringify(["Sets title","Text if image fails + accessibility","Links another image","Sets size"]),correct_answer:1,explanation:"alt text displays if image fails and is read by screen readers.",order_index:5},
  {quiz_id:"q001",question:"Which element represents a self-contained blog post?",options:JSON.stringify(["<section>","<div>","<article>","<content>"]),correct_answer:2,explanation:"<article> represents self-contained content that could stand alone.",order_index:6},
  {quiz_id:"q001",question:"What input type shows a date picker?",options:JSON.stringify(["type=calendar","type=date","type=datetime","type=picker"]),correct_answer:1,explanation:"<input type='date'> shows native date picker in modern browsers.",order_index:7},
  {quiz_id:"q001",question:"How many <main> elements should a page have?",options:JSON.stringify(["Unlimited","Two maximum","Exactly one","None"]),correct_answer:2,explanation:"There should be only ONE <main> element per page.",order_index:8},

  // CSS
  {quiz_id:"q002",question:"Which CSS property controls space INSIDE an element?",options:JSON.stringify(["margin","border","padding","spacing"]),correct_answer:2,explanation:"padding controls the space between content and border (inside).",order_index:1},
  {quiz_id:"q002",question:"What does 'display: flex' do?",options:JSON.stringify(["Hides element","Makes element a flex container","Adds animation","Sets position"]),correct_answer:1,explanation:"display: flex creates a flex container where children become flex items.",order_index:2},
  {quiz_id:"q002",question:"What does 'justify-content' align along?",options:JSON.stringify(["Cross axis","Main axis","Z axis","Block axis"]),correct_answer:1,explanation:"justify-content aligns items along the main axis of a flex container.",order_index:3},
  {quiz_id:"q002",question:"What CSS unit is relative to the viewport width?",options:JSON.stringify(["px","em","rem","vw"]),correct_answer:3,explanation:"vw = viewport width. 1vw = 1% of the viewport width.",order_index:4},
  {quiz_id:"q002",question:"What does box-sizing: border-box do?",options:JSON.stringify(["Removes borders","Includes padding and border in width","Adds a box shadow","Centers the element"]),correct_answer:1,explanation:"border-box means padding and border are included in the declared width/height.",order_index:5},
  {quiz_id:"q002",question:"In CSS Grid, what does fr mean?",options:JSON.stringify(["Fractional remainder","Font ratio","Flexible row","Fixed ratio"]),correct_answer:0,explanation:"fr = fraction of the available space in the grid container.",order_index:6},

  // JavaScript
  {quiz_id:"q003",question:"What does typeof null return?",options:JSON.stringify(["null","undefined","object","string"]),correct_answer:2,explanation:"typeof null returns 'object' — a well-known JavaScript bug kept for backwards compatibility.",order_index:1},
  {quiz_id:"q003",question:"What keyword creates a block-scoped immutable binding?",options:JSON.stringify(["var","let","const","static"]),correct_answer:2,explanation:"const creates a block-scoped binding that cannot be reassigned.",order_index:2},
  {quiz_id:"q003",question:"What is a closure?",options:JSON.stringify(["A syntax error","A function that accesses its outer scope after the outer function returns","A way to close windows","An error handler"]),correct_answer:1,explanation:"A closure is a function that retains access to its outer lexical scope.",order_index:3},
  {quiz_id:"q003",question:"What does Promise.all() do when one promise rejects?",options:JSON.stringify(["Continues with remaining","Rejects immediately with that error","Returns null for that item","Retries it"]),correct_answer:1,explanation:"Promise.all() fails fast — if any promise rejects, the whole thing rejects.",order_index:4},
  {quiz_id:"q003",question:"What does the spread operator (...) do with arrays?",options:JSON.stringify(["Deletes elements","Spreads elements into individual values","Creates a deep copy","Reverses the array"]),correct_answer:1,explanation:"The spread operator expands an iterable into its individual elements.",order_index:5},
  {quiz_id:"q003",question:"What is the output of [1,2,3].map(x => x * 2)?",options:JSON.stringify(["[1,2,3]","[2,4,6]","6","undefined"]),correct_answer:1,explanation:"Array.map() creates a new array with each element transformed.",order_index:6},
  {quiz_id:"q003",question:"What does async/await do?",options:JSON.stringify(["Creates threads","Makes async code look synchronous using Promises","Speeds up code","Prevents errors"]),correct_answer:1,explanation:"async/await is syntactic sugar over Promises, making async code read sequentially.",order_index:7},

  // TypeScript
  {quiz_id:"q004",question:"What does 'any' type do in TypeScript?",options:JSON.stringify(["Makes immutable","Disables type checking","Converts to string","Makes optional"]),correct_answer:1,explanation:"'any' opts out of TypeScript's type checking — use sparingly.",order_index:1},
  {quiz_id:"q004",question:"What is a Generic in TypeScript?",options:JSON.stringify(["A base class","A type placeholder for writing reusable type-safe code","A utility function","A module pattern"]),correct_answer:1,explanation:"Generics allow writing code that works with any type while maintaining type safety.",order_index:2},
  {quiz_id:"q004",question:"What does '?' mean after a parameter name?",options:JSON.stringify(["Required","Optional","Nullable","Default"]),correct_answer:1,explanation:"? makes a parameter optional — it can be undefined.",order_index:3},
  {quiz_id:"q004",question:"What is the difference between interface and type?",options:JSON.stringify(["No difference","Interface supports declaration merging, type supports unions","Type is newer","Interface is deprecated"]),correct_answer:1,explanation:"Interfaces can be extended/merged. Type aliases support unions, intersections, and mapped types.",order_index:4},
  {quiz_id:"q004",question:"What does 'keyof' return?",options:JSON.stringify(["All values","Union of all keys of a type","Array of keys","Object keys"]),correct_answer:1,explanation:"keyof T creates a union type of all property names of type T.",order_index:5},

  // React
  {quiz_id:"q005",question:"What is the Virtual DOM?",options:JSON.stringify(["A database","In-memory JS representation of the real DOM for efficient updates","A testing tool","CSS framework"]),correct_answer:1,explanation:"The Virtual DOM is a lightweight copy of the real DOM. React diffs it to make minimal updates.",order_index:1},
  {quiz_id:"q005",question:"When does useEffect run with empty dependency array []?",options:JSON.stringify(["Every render","Only on mount (once)","Never","Only on unmount"]),correct_answer:1,explanation:"useEffect([]) runs once after the initial render — equivalent to componentDidMount.",order_index:2},
  {quiz_id:"q005",question:"How should you update an array in state?",options:JSON.stringify(["state.push(item)","setState([...state, item])","state[length]=item","state.append(item)"]),correct_answer:1,explanation:"Never mutate state directly. Create a new array with spread operator to trigger re-render.",order_index:3},
  {quiz_id:"q005",question:"What is prop drilling?",options:JSON.stringify(["Drilling holes","Passing props through intermediate components that don't need them","A performance issue","A testing pattern"]),correct_answer:1,explanation:"Prop drilling is passing props through many layers just to reach a deeply nested component.",order_index:4},
  {quiz_id:"q005",question:"What hook handles side effects?",options:JSON.stringify(["useState","useEffect","useContext","useRef"]),correct_answer:1,explanation:"useEffect is for side effects: data fetching, subscriptions, DOM manipulation.",order_index:5},
  {quiz_id:"q005",question:"What is the purpose of the key prop in lists?",options:JSON.stringify(["Styling","Helps React identify which items changed for efficient re-rendering","Security","Animation"]),correct_answer:1,explanation:"key helps React track list items and avoid re-rendering unchanged items.",order_index:6},

  // Node.js
  {quiz_id:"q006",question:"What is libuv?",options:JSON.stringify(["A JS framework","A C library providing async I/O and the event loop","A package manager","A testing tool"]),correct_answer:1,explanation:"libuv is the C library that provides Node.js with its event loop, async I/O, and thread pool.",order_index:1},
  {quiz_id:"q006",question:"What happens when you block the event loop?",options:JSON.stringify(["Nothing","No other requests can be processed until unblocked","Memory increases","Server restarts"]),correct_answer:1,explanation:"Blocking the event loop prevents ALL other operations including handling new requests.",order_index:2},
  {quiz_id:"q006",question:"What executes first: Promise.resolve().then() or setTimeout(0)?",options:JSON.stringify(["setTimeout","Promise.then (microtask)","Same time","Depends on system"]),correct_answer:1,explanation:"Microtasks (Promises, nextTick) always run before macrotasks (setTimeout, setImmediate).",order_index:3},
  {quiz_id:"q006",question:"What is the correct way to read files in a Node.js server?",options:JSON.stringify(["fs.readFileSync","fs.readFile (async)","fs.promises.readFile","Both 2 and 3 are correct"]),correct_answer:3,explanation:"Both fs.readFile callback and fs.promises.readFile are async. Never use Sync in a server.",order_index:4},

  // REST API
  {quiz_id:"q007",question:"Which HTTP method should you use to partially update a resource?",options:JSON.stringify(["PUT","POST","PATCH","UPDATE"]),correct_answer:2,explanation:"PATCH is for partial updates. PUT replaces the entire resource.",order_index:1},
  {quiz_id:"q007",question:"What status code means 'resource created'?",options:JSON.stringify(["200","201","204","301"]),correct_answer:1,explanation:"201 Created is the correct response after successfully creating a resource.",order_index:2},
  {quiz_id:"q007",question:"What does idempotent mean for HTTP methods?",options:JSON.stringify(["Fast execution","Multiple identical requests have the same effect as one","Cacheable","Stateless"]),correct_answer:1,explanation:"An idempotent method produces the same result whether called once or many times.",order_index:3},
  {quiz_id:"q007",question:"What status code for 'authentication required'?",options:JSON.stringify(["400","401","403","404"]),correct_answer:1,explanation:"401 Unauthorized means you need to authenticate. 403 Forbidden means you're authenticated but not allowed.",order_index:4},

  // Database
  {quiz_id:"q008",question:"What does SQL stand for?",options:JSON.stringify(["Structured Query Language","Simple Query Logic","Standard Question Language","Sequential Query List"]),correct_answer:0,explanation:"SQL = Structured Query Language, the standard for relational databases.",order_index:1},
  {quiz_id:"q008",question:"Which clause filters AFTER grouping?",options:JSON.stringify(["WHERE","HAVING","FILTER","AFTER"]),correct_answer:1,explanation:"HAVING filters after GROUP BY. WHERE filters before grouping.",order_index:2},
  {quiz_id:"q008",question:"What JOIN returns only matching rows from both tables?",options:JSON.stringify(["LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN","INNER JOIN"]),correct_answer:3,explanation:"INNER JOIN returns only rows where there's a match in BOTH tables.",order_index:3},
  {quiz_id:"q008",question:"What does an index do?",options:JSON.stringify(["Adds rows","Speeds up data retrieval at cost of extra storage","Validates data","Encrypts data"]),correct_answer:1,explanation:"An index (B-tree) allows fast row lookup without full table scans.",order_index:4},
  {quiz_id:"q008",question:"What does ACID stand for?",options:JSON.stringify(["Atomicity Consistency Isolation Durability","Access Control Index Delete","Async Cached Indexed Data","Automatic Concurrent Integrated Database"]),correct_answer:0,explanation:"ACID ensures reliable transactions: Atomic, Consistent, Isolated, Durable.",order_index:5},

  // Git
  {quiz_id:"q009",question:"What does 'git checkout -b feature' do?",options:JSON.stringify(["Deletes feature branch","Creates and switches to feature branch","Merges feature","Lists branches"]),correct_answer:1,explanation:"git checkout -b creates a new branch AND switches to it in one command.",order_index:1},
  {quiz_id:"q009",question:"What does 'git stash' do?",options:JSON.stringify(["Deletes changes","Temporarily saves uncommitted changes","Commits changes","Pushes to remote"]),correct_answer:1,explanation:"git stash saves your working directory changes temporarily so you can switch branches.",order_index:2},
  {quiz_id:"q009",question:"What is a Pull Request?",options:JSON.stringify(["Pulling code from server","Request to merge your branch into another branch","Requesting help","Downloading dependencies"]),correct_answer:1,explanation:"A PR is a request to merge your branch into the target branch, enabling code review.",order_index:3},
  {quiz_id:"q009",question:"What should you NEVER commit?",options:JSON.stringify(["README files","Tests","node_modules and .env files","CSS files"]),correct_answer:2,explanation:"node_modules (huge) and .env (secrets) should always be in .gitignore.",order_index:4},

  // System Design
  {quiz_id:"q010",question:"What does CAP theorem state?",options:JSON.stringify(["All three can be guaranteed","At most two of: Consistency Availability Partition-tolerance","Only for SQL databases","Only applies to big companies"]),correct_answer:1,explanation:"CAP theorem: in a distributed system, you can guarantee at most 2 of 3: Consistency, Availability, Partition tolerance.",order_index:1},
  {quiz_id:"q010",question:"What is horizontal scaling?",options:JSON.stringify(["Bigger server","Adding more servers","Better algorithms","More RAM"]),correct_answer:1,explanation:"Horizontal scaling (scale out) = add more machines. Vertical scaling (scale up) = bigger machine.",order_index:2},
  {quiz_id:"q010",question:"What is a CDN?",options:JSON.stringify(["Central Database Network","Content Delivery Network serving assets from nearby servers","Continuous Deployment Node","Code Distribution Network"]),correct_answer:1,explanation:"CDN caches static assets at edge servers worldwide for faster delivery to users.",order_index:3},
  {quiz_id:"q010",question:"What is eventual consistency?",options:JSON.stringify(["Data is always consistent","Data will become consistent eventually but may be stale temporarily","Data is never consistent","Consistency guaranteed within 1 second"]),correct_answer:1,explanation:"Eventual consistency trades immediate consistency for availability — data syncs eventually.",order_index:4},
  {quiz_id:"q010",question:"What is a message queue used for?",options:JSON.stringify(["Storing messages for users","Decoupling services and handling async processing","Caching responses","Load balancing"]),correct_answer:1,explanation:"Message queues decouple producer and consumer services and enable async, reliable processing.",order_index:5},
]);

// ═══════════════════════════════════════════════════════════════
// CERTIFICATIONS
// ═══════════════════════════════════════════════════════════════
await upsert("certifications", [
  {id:"cert001",title:"HTML5 Developer",description:"Certified in semantic HTML5, forms, accessibility, and web standards",course_id:"c1000000-0000-0000-0000-000000000001",requirements:JSON.stringify({min_xp:200,quiz_score:70,lessons_completed:10})},
  {id:"cert002",title:"CSS Professional",description:"Certified in CSS3, Flexbox, Grid, animations, and Tailwind CSS",course_id:"c1000000-0000-0000-0000-000000000002",requirements:JSON.stringify({min_xp:300,quiz_score:70,lessons_completed:15})},
  {id:"cert003",title:"JavaScript Developer",description:"Certified in modern JavaScript ES6+, async programming, and DOM",course_id:"c1000000-0000-0000-0000-000000000003",requirements:JSON.stringify({min_xp:400,quiz_score:75,lessons_completed:20})},
  {id:"cert004",title:"TypeScript Expert",description:"Certified in TypeScript types, generics, and advanced patterns",course_id:"c1000000-0000-0000-0000-000000000004",requirements:JSON.stringify({min_xp:350,quiz_score:75,lessons_completed:15})},
  {id:"cert005",title:"React JS Professional",description:"Certified in React components, hooks, state management, and testing",course_id:"c1000000-0000-0000-0000-000000000005",requirements:JSON.stringify({min_xp:500,quiz_score:75,lessons_completed:20})},
  {id:"cert006",title:"Node.js Backend Developer",description:"Certified in Node.js, Express, REST APIs, and backend architecture",course_id:"c1000000-0000-0000-0000-000000000007",requirements:JSON.stringify({min_xp:450,quiz_score:75,lessons_completed:18})},
  {id:"cert007",title:"Full Stack Developer",description:"Certified full stack developer with frontend and backend expertise",course_id:null,requirements:JSON.stringify({min_xp:2000,quiz_score:80,certifications_required:["cert001","cert003","cert005","cert006"]})},
]);

console.log("\n✅ All challenges, quizzes, and certifications pushed!");
