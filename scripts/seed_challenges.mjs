const SUPABASE_URL = "https://rdnhbreuusnfvwmrecor.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbmhicmV1dXNuZnZ3bXJlY29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTg1ODIsImV4cCI6MjA5NTM3NDU4Mn0.eVSHIHpyNUhfYOlBdoDRGTXefkRPm_YCUsmRjz4sl_o";

const challenges = [
  // --- HTML5 Fundamentals ---
  {
    title: "Semantic Webpage Structure",
    description: "Create a semantic webpage using <header>, <nav>, <main>, <section>, and <footer>. Render a basic navigation bar and page structure.",
    difficulty: "Easy",
    category: "HTML5",
    points: 10,
    starter_code_js: `function renderSemanticHTML() {\n  return \`\n    <header>\n      <h1>My Website</h1>\n      <nav>\n        <ul>\n          <li><a href="#home">Home</a></li>\n        </ul>\n      </nav>\n    </header>\n    <main>\n      <section>\n        <h2>About</h2>\n        <p>This is a section.</p>\n      </section>\n    </main>\n    <footer>\n      <p>Footer content</p>\n    </footer>\n  \`;\n}`,
    starter_code_ts: `function renderSemanticHTML(): string {\n  return "";\n}`,
    starter_code_python: `def render_semantic_html():\n    return ""`,
    test_cases: [{ input: [], expected: "header" }],
    solution: "Use modern semantic elements (<header>, <nav>, <main>, <section>, <footer>) instead of nesting <div> elements for better accessibility and SEO."
  },
  {
    title: "Contact Form Validation",
    description: "Build a contact form containing name, email, and message fields using HTML5 validation attributes like 'required' and correct input types.",
    difficulty: "Easy",
    category: "HTML5",
    points: 10,
    starter_code_js: `function getContactFormHTML() {\n  return \`\n    <form>\n      <input type="text" id="name" required />\n      <input type="email" id="email" required />\n      <textarea id="message" required></textarea>\n    </form>\n  \`;\n}`,
    starter_code_ts: `function getContactFormHTML(): string {\n  return "";\n}`,
    starter_code_python: `def get_contact_form_html():\n    return ""`,
    test_cases: [{ input: [], expected: "required" }],
    solution: "Use the 'required' attribute along with specific input types like type='email' to let the browser handle basic validation automatically."
  },
  {
    title: "Registration Form Validation",
    description: "Create a comprehensive registration form with validation patterns (regex) for email, password, date, and phone number.",
    difficulty: "Medium",
    category: "HTML5",
    points: 20,
    starter_code_js: `function getRegistrationFormHTML() {\n  return \`\n    <form>\n      <input type="email" required />\n      <input type="password" pattern=".{8,}" required title="8 characters minimum" />\n      <input type="date" required />\n      <input type="tel" pattern="[0-9]{10}" required />\n    </form>\n  \`;\n}`,
    starter_code_ts: `function getRegistrationFormHTML(): string {\n  return "";\n}`,
    starter_code_python: `def get_registration_form_html():\n    return ""`,
    test_cases: [{ input: [], expected: "pattern" }],
    solution: "Use pattern='.{8,}' for password length constraints and pattern='[0-9]{10}' for US-style phone numbers."
  },
  {
    title: "Video Gallery Component",
    description: "Build a video gallery using HTML5 <video> and <audio> elements with source paths and default controls enabled.",
    difficulty: "Medium",
    category: "HTML5",
    points: 20,
    starter_code_js: `function getVideoGalleryHTML() {\n  return \`\n    <div class="gallery">\n      <video controls width="250">\n        <source src="movie.mp4" type="video/mp4" />\n      </video>\n      <audio controls>\n        <source src="music.mp3" type="audio/mpeg" />\n      </audio>\n    </div>\n  \`;\n}`,
    starter_code_ts: `function getVideoGalleryHTML(): string {\n  return "";\n}`,
    starter_code_python: `def get_video_gallery_html():\n    return ""`,
    test_cases: [{ input: [], expected: "controls" }],
    solution: "The controls attribute enables native play, pause, and volume controls for the user."
  },
  {
    title: "Multi-Step Form Progress",
    description: "Create a multi-step form structure utilizing progress indicators (<progress> or <meter> elements) to represent form step completion.",
    difficulty: "Hard",
    category: "HTML5",
    points: 30,
    starter_code_js: `function getMultiStepFormHTML() {\n  return \`\n    <div>\n      <progress value="50" max="100"></progress>\n      <form id="step2">\n        <h3>Step 2: Profile Info</h3>\n      </form>\n    </div>\n  \`;\n}`,
    starter_code_ts: `function getMultiStepFormHTML(): string {\n  return "";\n}`,
    starter_code_python: `def get_multistep_form_html():\n    return ""`,
    test_cases: [{ input: [], expected: "progress" }],
    solution: "Use the HTML5 <progress> element to native display step tracking and completion percentages."
  },
  {
    title: "Local Storage Notes App",
    description: "Build a notes application structure storing user inputs locally in the browser using the Local Storage API.",
    difficulty: "Hard",
    category: "HTML5",
    points: 30,
    starter_code_js: `function saveNoteToStorage(key, note) {\n  localStorage.setItem(key, JSON.stringify(note));\n  return localStorage.getItem(key);\n}`,
    starter_code_ts: `function saveNoteToStorage(key: string, note: any): string | null {\n  return null;\n}`,
    starter_code_python: `def save_note_to_storage(key, note):\n    pass`,
    test_cases: [{ input: ["myNote", "Hello World"], expected: "Hello World" }],
    solution: "Use localStorage.setItem() to save key-value strings and JSON.stringify() to store complex object states."
  },

  // --- CSS3 & Tailwind CSS ---
  {
    title: "Responsive Flexbox Card",
    description: "Create a responsive card using Flexbox layout which displays text beside an image on desktop, but stacks vertically on mobile.",
    difficulty: "Easy",
    category: "CSS3",
    points: 10,
    starter_code_js: `function getFlexCardStyles() {\n  return \`\n    .card {\n      display: flex;\n      flex-direction: column;\n    }\n    @media (min-width: 768px) {\n      .card {\n        flex-direction: row;\n      }\n    }\n  \`;\n}`,
    starter_code_ts: `function getFlexCardStyles(): string {\n  return "";\n}`,
    starter_code_python: `def get_flex_card_styles():\n    return ""`,
    test_cases: [{ input: [], expected: "flex-direction" }],
    solution: "Use flex-direction: column for stacked mobile views and media queries to switch to row on wider screens."
  },
  {
    title: "Pricing Card Hover Effect",
    description: "Design a pricing card that lifts upwards and increases shadow depth when a user hovers over it.",
    difficulty: "Easy",
    category: "CSS3",
    points: 10,
    starter_code_js: `function getPricingCardHoverStyles() {\n  return \`\n    .pricing-card {\n      transition: transform 0.3s, box-shadow 0.3s;\n    }\n    .pricing-card:hover {\n      transform: translateY(-5px);\n      box-shadow: 0 10px 20px rgba(0,0,0,0.15);\n    }\n  \`;\n}`,
    starter_code_ts: `function getPricingCardHoverStyles(): string {\n  return "";\n}`,
    starter_code_python: `def get_pricing_card_hover_styles():\n    return ""`,
    test_cases: [{ input: [], expected: "translateY" }],
    solution: "Use CSS transitions on transform and box-shadow coupled with :hover state triggers."
  },
  {
    title: "Responsive CSS Grid Landing Page",
    description: "Build a responsive grid-based landing page layout featuring a header, sidebar, main content, and footer.",
    difficulty: "Medium",
    category: "CSS3",
    points: 20,
    starter_code_js: `function getGridLayout() {\n  return \`\n    .grid-container {\n      display: grid;\n      grid-template-areas:\n        "header header"\n        "sidebar main"\n        "footer footer";\n      grid-template-columns: 200px 1fr;\n    }\n  \`;\n}`,
    starter_code_ts: `function getGridLayout(): string {\n  return "";\n}`,
    starter_code_python: `def get_grid_layout():\n    return ""`,
    test_cases: [{ input: [], expected: "grid-template-areas" }],
    solution: "CSS Grid Areas are highly readable for multi-column main app layouts."
  },
  {
    title: "Animated Navigation Menu",
    description: "Create a navigation menu where items scale up and change colors using CSS keyframes and transitions.",
    difficulty: "Medium",
    category: "CSS3",
    points: 20,
    starter_code_js: `function getNavAnimationStyles() {\n  return \`\n    .menu-item {\n      transition: all 0.2s ease-in-out;\n    }\n    .menu-item:hover {\n      transform: scale(1.1);\n      color: #3b82f6;\n    }\n  \`;\n}`,
    starter_code_ts: `function getNavAnimationStyles(): string {\n  return "";\n}`,
    starter_code_python: `def get_nav_animation_styles():\n    return ""`,
    test_cases: [{ input: [], expected: "scale" }],
    solution: "Ensure transition: all is used to apply smooth scaling and color changes."
  },
  {
    title: "Hero Section Reconstruction",
    description: "Recreate a standard tech product hero section with background overlays, title text, and primary call-to-action buttons.",
    difficulty: "Hard",
    category: "CSS3",
    points: 30,
    starter_code_js: `function getHeroStyles() {\n  return \`\n    .hero {\n      background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('hero.jpg');\n      background-size: cover;\n      min-height: 80vh;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n  \`;\n}`,
    starter_code_ts: `function getHeroStyles(): string {\n  return "";\n}`,
    starter_code_python: `def get_hero_styles():\n    return ""`,
    test_cases: [{ input: [], expected: "linear-gradient" }],
    solution: "Use CSS gradients overlaying images to guarantee readable text contrast."
  },
  {
    title: "Responsive Dashboard Layout",
    description: "Build a responsive grid-based dashboard with a collapsing sidebar, top navigation, and analytical cards.",
    difficulty: "Hard",
    category: "CSS3",
    points: 30,
    starter_code_js: `function getDashboardLayout() {\n  return \`\n    .dashboard {\n      display: grid;\n      grid-template-rows: auto 1fr;\n      grid-template-columns: var(--sidebar-width) 1fr;\n    }\n  \`;\n}`,
    starter_code_ts: `function getDashboardLayout(): string {\n  return "";\n}`,
    starter_code_python: `def get_dashboard_layout():\n    return ""`,
    test_cases: [{ input: [], expected: "grid-template-columns" }],
    solution: "CSS variables inside grid template layouts simplify toggling sidebar widths dynamically."
  },

  // --- JavaScript ES6+ ---
  {
    title: "Calculator Logic",
    description: "Create a function that performs addition, subtraction, multiplication, and division calculations based on operator inputs.",
    difficulty: "Easy",
    category: "JavaScript",
    points: 10,
    starter_code_js: `function calculate(a, b, op) {\n  switch(op) {\n    case '+': return a + b;\n    case '-': return a - b;\n    case '*': return a * b;\n    case '/': return a / b;\n    default: return 0;\n  }\n}`,
    starter_code_ts: `function calculate(a: number, b: number, op: string): number {\n  return 0;\n}`,
    starter_code_python: `def calculate(a, b, op):\n    pass`,
    test_cases: [{ input: [5, 3, "+"], expected: 8 }, { input: [10, 2, "/"], expected: 5 }],
    solution: "A simple switch statement handles parsing inputs safely."
  },
  {
    title: "Random Quote Generator",
    description: "Build a quote generator function that selects a random index from a list of quote strings.",
    difficulty: "Easy",
    category: "JavaScript",
    points: 10,
    starter_code_js: `function getRandomQuote(quotes) {\n  const idx = Math.floor(Math.random() * quotes.length);\n  return quotes[idx];\n}`,
    starter_code_ts: `function getRandomQuote(quotes: string[]): string {\n  return "";\n}`,
    starter_code_python: `def get_random_quote(quotes):\n    pass`,
    test_cases: [{ input: [["Quote A", "Quote B"]], expected: "Quote" }],
    solution: "Combine Math.random() and Math.floor() matching array lengths to pull clean indexes."
  },
  {
    title: "Weather Fetch API Client",
    description: "Create an asynchronous fetch client that pulls weather stats from a mock JSON endpoint.",
    difficulty: "Medium",
    category: "JavaScript",
    points: 20,
    starter_code_js: `async function fetchWeather(url) {\n  const res = await fetch(url);\n  const data = await res.json();\n  return data.temp;\n}`,
    starter_code_ts: `async function fetchWeather(url: string): Promise<number> {\n  return 0;\n}`,
    starter_code_python: `def fetch_weather(url):\n    pass`,
    test_cases: [{ input: ["https://jsonplaceholder.typicode.com/todos/1"], expected: "" }],
    solution: "Use async/await blocks together with fetch() responses and res.json() serialization."
  },
  {
    title: "To-Do List Storage Sync",
    description: "Write a sync function that stores list strings to local storage, appending new tasks securely.",
    difficulty: "Medium",
    category: "JavaScript",
    points: 20,
    starter_code_js: `function syncTasks(tasks) {\n  localStorage.setItem('todo_tasks', JSON.stringify(tasks));\n  return JSON.parse(localStorage.getItem('todo_tasks'));\n}`,
    starter_code_ts: `function syncTasks(tasks: string[]): string[] {\n  return [];\n}`,
    starter_code_python: `def sync_tasks(tasks):\n    pass`,
    test_cases: [{ input: [["Clean room", "Code"]], expected: "Clean room" }],
    solution: "Utilize localStorage syncs parsing strings back into JS arrays."
  },
  {
    title: "Movie Search API Wrapper",
    description: "Build a promise-based search wrapper that queries database movies by search queries.",
    difficulty: "Hard",
    category: "JavaScript",
    points: 30,
    starter_code_js: `async function searchMovies(query) {\n  const res = await fetch(\`https://api.themoviedb.org/3/search/movie?query=\${encodeURIComponent(query)}\`);\n  return res.status;\n}`,
    starter_code_ts: `async function searchMovies(query: string): Promise<number> {\n  return 0;\n}`,
    starter_code_python: `def search_movies(query):\n    pass`,
    test_cases: [{ input: ["Inception"], expected: "" }],
    solution: "Always encode dynamic user inputs using encodeURIComponent() to avoid malformed API requests."
  },
  {
    title: "Kanban Drag-and-Drop State",
    description: "Create a javascript helper function to handle task transitions between column states (todo, in_progress, done).",
    difficulty: "Hard",
    category: "JavaScript",
    points: 30,
    starter_code_js: `function moveTask(taskMap, taskId, targetCol) {\n  const updated = { ...taskMap };\n  updated[taskId] = targetCol;\n  return updated;\n}`,
    starter_code_ts: `function moveTask(taskMap: Record<string, string>, taskId: string, targetCol: string): Record<string, string> {\n  return {};\n}`,
    starter_code_python: `def move_task(task_map, task_id, target_col):\n    pass`,
    test_cases: [{ input: [{ "t1": "todo" }, "t1", "done"], expected: "done" }],
    solution: "Immutably update key-value mapping representations for clear rendering in React/Vue dashboard boards."
  },

  // --- TypeScript Complete Guide ---
  {
    title: "Typed User Interface",
    description: "Create a typed user interface that represents standard user details and access parameters.",
    difficulty: "Easy",
    category: "TypeScript",
    points: 10,
    starter_code_js: `// TypeScript exercise. Define IUser interface.\nfunction validateUser(user) {\n  return user.id && user.email;\n}`,
    starter_code_ts: `interface IUser {\n  id: string;\n  email: string;\n  role: 'admin' | 'user';\n}\n\nfunction validateUser(user: IUser): boolean {\n  return user.id.length > 0 && user.email.includes('@');\n}`,
    starter_code_python: `def validate_user(user):\n    return True`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Declaring exact static interfaces allows compiler validation and autocompletion supports."
  },
  {
    title: "Typed Function Signatures",
    description: "Create a mathematical helper function that calculates compound percentages with strict typed arguments.",
    difficulty: "Easy",
    category: "TypeScript",
    points: 10,
    starter_code_js: `function compound(amount, rate) {\n  return amount * (1 + rate);\n}`,
    starter_code_ts: `function compound(amount: number, rate: number): number {\n  return amount * (1 + rate);\n}`,
    starter_code_python: `def compound(amount: float, rate: float) -> float:\n    return amount * (1 + rate)`,
    test_cases: [{ input: [100, 0.05], expected: 105 }],
    solution: "Always strictly type standard input arguments and final return output properties."
  },
  {
    title: "Product Inventory Manager Class",
    description: "Design a Class model representing product inventories using typescript private modifiers and accessors.",
    difficulty: "Medium",
    category: "TypeScript",
    points: 20,
    starter_code_js: `class Inventory {\n  constructor() { this.items = []; }\n  add(item) { this.items.push(item); }\n}`,
    starter_code_ts: `interface Item { name: string; quantity: number; }\nclass Inventory {\n  private items: Item[] = [];\n  public add(item: Item): void {\n    this.items.push(item);\n  }\n  public count(): number {\n    return this.items.length;\n  }\n}`,
    starter_code_python: `class Inventory:\n    def __init__(self): self.items = []`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Use private modifiers to secure system data from external modifications."
  },
  {
    title: "Generic Filter Library",
    description: "Build a generic filtering utility that matches collections of items by matching field parameters.",
    difficulty: "Medium",
    category: "TypeScript",
    points: 20,
    starter_code_js: `function filterItems(items, filterFn) {\n  return items.filter(filterFn);\n}`,
    starter_code_ts: `function filterItems<T>(items: T[], filterFn: (item: T) => boolean): T[] {\n  return items.filter(filterFn);\n}`,
    starter_code_python: `def filter_items(items, filter_fn):\n    return list(filter(filter_fn, items))`,
    test_cases: [{ input: [[1, 2, 3, 4], "even"], expected: "" }],
    solution: "Generics allow developers to build type-safe utilities that work with customizable items."
  },
  {
    title: "TypeScript Task Manager Class",
    description: "Design a class-based task manager system with custom methods to modify task statuses.",
    difficulty: "Hard",
    category: "TypeScript",
    points: 30,
    starter_code_js: `class TaskManager {\n  constructor() { this.tasks = []; }\n}`,
    starter_code_ts: `enum Status { Todo, Done }\ninterface Task { id: number; status: Status; }\nclass TaskManager {\n  private tasks: Task[] = [];\n  public addTask(t: Task) { this.tasks.push(t); }\n  public getTasks(): Task[] { return this.tasks; }\n}`,
    starter_code_python: `class TaskManager:\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Use TypeScript Enums to represent fixed state choices cleanly in application states."
  },
  {
    title: "Typed API Client Generic",
    description: "Build a typescript API client utilizing generics to fetch type-safe API responses.",
    difficulty: "Hard",
    category: "TypeScript",
    points: 30,
    starter_code_js: `async function getAPIResource(url) {\n  const res = await fetch(url);\n  return await res.json();\n}`,
    starter_code_ts: `async function getAPIResource<T>(url: string): Promise<T> {\n  const res = await fetch(url);\n  return res.json();\n}`,
    starter_code_python: `def get_api_resource(url):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Return generic Promise<T> signatures on API calls to allow type enforcement on response payloads."
  },

  // --- React JS Mastery ---
  {
    title: "Counter App Hooks",
    description: "Create a counter component featuring increment, decrement, and reset states using React useState Hook.",
    difficulty: "Easy",
    category: "React",
    points: 10,
    starter_code_js: `// React simulation. Return updated state counter.\nfunction incrementCount(current) {\n  return current + 1;\n}`,
    starter_code_ts: `function incrementCount(current: number): number {\n  return current + 1;\n}`,
    starter_code_python: `def increment_count(current):\n    return current + 1`,
    test_cases: [{ input: [5], expected: 6 }],
    solution: "Always utilize React hooks to handle internal component states safely."
  },
  {
    title: "Profile Card Components",
    description: "Build a React functional component representing user profiles, receiving and rendering custom props.",
    difficulty: "Easy",
    category: "React",
    points: 10,
    starter_code_js: `function UserProfile(props) {\n  return \`<div>\${props.name}</div>\`;\n}`,
    starter_code_ts: `interface ProfileProps { name: string; }\nfunction UserProfile(props: ProfileProps): string {\n  return props.name;\n}`,
    starter_code_python: `def user_profile(props):\n    return props.get("name", "")`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Strictly type React component props to prevent runtime type errors during rendering."
  },
  {
    title: "Shopping Cart Context API",
    description: "Design a React Context API reducer function to add, remove, and clear items inside shopping carts.",
    difficulty: "Medium",
    category: "React",
    points: 20,
    starter_code_js: `function cartReducer(state, action) {\n  switch(action.type) {\n    case 'ADD': return [...state, action.payload];\n    case 'CLEAR': return [];\n    default: return state;\n  }\n}`,
    starter_code_ts: `interface Action { type: 'ADD' | 'CLEAR'; payload?: any; }\nfunction cartReducer(state: any[], action: Action): any[] {\n  return [];\n}`,
    starter_code_python: `def cart_reducer(state, action):\n    pass`,
    test_cases: [{ input: [[], { type: "ADD", payload: "Item" }], expected: "Item" }],
    solution: "React context and useReducer provide clean state management for small applications."
  },
  {
    title: "Product Search List Filter",
    description: "Create a React component filter helper that filters a list of products dynamically by title query.",
    difficulty: "Medium",
    category: "React",
    points: 20,
    starter_code_js: `function filterProducts(products, query) {\n  return products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));\n}`,
    starter_code_ts: `interface Product { name: string; }\nfunction filterProducts(products: Product[], query: string): Product[] {\n  return [];\n}`,
    starter_code_python: `def filter_products(products, query):\n    pass`,
    test_cases: [{ input: [[{ name: "Apple" }, { name: "Orange" }], "ap"], expected: "Apple" }],
    solution: "Cache calculated lists using React's useMemo() hook when handling large data collections."
  },
  {
    title: "Full CRUD React Hook",
    description: "Build custom React state handlers to coordinate standard REST requests (GET, POST, DELETE) for posts lists.",
    difficulty: "Hard",
    category: "React",
    points: 30,
    starter_code_js: `function handleCreatePost(posts, newPost) {\n  return [...posts, newPost];\n}`,
    starter_code_ts: `function handleCreatePost(posts: any[], newPost: any): any[] {\n  return [];\n}`,
    starter_code_python: `def handle_create_post(posts, new_post):\n    pass`,
    test_cases: [{ input: [[], "New"], expected: "New" }],
    solution: "Manage fetching state triggers explicitly using custom hooks to keep UI components simple."
  },
  {
    title: "Trello Board State reducer",
    description: "Design a board state reducer to transfer tasks dynamically between list columns in a dashboard.",
    difficulty: "Hard",
    category: "React",
    points: 30,
    starter_code_js: `function moveCard(boards, cardId, fromCol, toCol) {\n  // React state immutability helper\n  return boards;\n}`,
    starter_code_ts: `function moveCard(boards: any, cardId: string, fromCol: string, toCol: string): any {\n  return boards;\n}`,
    starter_code_python: `def move_card(boards, card_id, from_col, to_col):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Always duplicate outer arrays and inner object structures before updating state to prevent React render skips."
  },

  // --- Tailwind CSS Deep Dive ---
  {
    title: "Responsive Profile Card UI",
    description: "Design a Tailwind profile card featuring grid alignment and shadow-lg borders.",
    difficulty: "Easy",
    category: "Tailwind",
    points: 10,
    starter_code_js: `function getTailwindCardClasses() {\n  return "flex flex-col md:flex-row items-center p-6 bg-card rounded-xl shadow-lg";\n}`,
    starter_code_ts: `function getTailwindCardClasses(): string {\n  return "";\n}`,
    starter_code_python: `def get_tailwind_card_classes():\n    return ""`,
    test_cases: [{ input: [], expected: "flex-col" }],
    solution: "Combine layout flex utilities to transition between row and column structures."
  },
  {
    title: "Dark Mode Toggle styling",
    description: "Create background and text colors styling that toggles dynamically on HTML dark classes.",
    difficulty: "Easy",
    category: "Tailwind",
    points: 10,
    starter_code_js: `function getDarkModeClasses() {\n  return "bg-white text-black dark:bg-slate-900 dark:text-white";\n}`,
    starter_code_ts: `function getDarkModeClasses(): string {\n  return "";\n}`,
    starter_code_python: `def get_dark_mode_classes():\n    return ""`,
    test_cases: [{ input: [], expected: "dark:bg" }],
    solution: "Always prefix dark styles with dark: in Tailwind CSS."
  },
  {
    title: "Responsive Blog Layout Grid",
    description: "Design a blog post grid layout using tailwind classes to scale from 1 to 3 columns.",
    difficulty: "Medium",
    category: "Tailwind",
    points: 20,
    starter_code_js: `function getGridClasses() {\n  return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";\n}`,
    starter_code_ts: `function getGridClasses(): string {\n  return "";\n}`,
    starter_code_python: `def get_grid_classes():\n    return ""`,
    test_cases: [{ input: [], expected: "grid-cols" }],
    solution: "Tailwind's mobile-first breakpoints make responsive column configuration trivial."
  },
  {
    title: "Component Pattern Classes",
    description: "Create an object grouping Tailwind styling for button variants (primary, secondary).",
    difficulty: "Medium",
    category: "Tailwind",
    points: 20,
    starter_code_js: `const btnStyles = {\n  base: "px-4 py-2 rounded font-medium transition-colors",\n  primary: "bg-blue-600 text-white hover:bg-blue-700"\n};`,
    starter_code_ts: `const btnStyles: Record<string, string> = { base: "" };`,
    starter_code_python: `btn_styles = {}`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Group base classes and combine variant strings dynamically to manage design systems cleanly."
  },
  {
    title: "Custom Dashboard Layout",
    description: "Design a complete grid dashboard layout featuring sidebar overlays and content scroll boxes.",
    difficulty: "Hard",
    category: "Tailwind",
    points: 30,
    starter_code_js: `function getDashboardClasses() {\n  return "h-screen flex overflow-hidden bg-background";\n}`,
    starter_code_ts: `function getDashboardClasses(): string {\n  return "";\n}`,
    starter_code_python: `def get_dashboard_classes():\n    return ""`,
    test_cases: [{ input: [], expected: "h-screen" }],
    solution: "Using overflow-hidden on the parent wrapper and overflow-y-auto on content columns yields desktop-app style feel."
  },
  {
    title: "Tailwind Configuration Extensions",
    description: "Build a mock tailwind.config theme extension object defining branding colors.",
    difficulty: "Hard",
    category: "Tailwind",
    points: 30,
    starter_code_js: `const themeConfig = {\n  extend: {\n    colors: {\n      brand: { 500: "#3b82f6" }\n    }\n  }\n};`,
    starter_code_ts: `const themeConfig: any = {};`,
    starter_code_python: `theme_config = {}`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Extend standard themes in tailwind.config instead of replacing to preserve access to default utilities."
  },

  // --- Node.js Backend Development ---
  {
    title: "File Reader Service",
    description: "Create a Node.js utility utilizing the fs module to read file strings asynchronously.",
    difficulty: "Easy",
    category: "Node.js",
    points: 10,
    starter_code_js: `const fs = require('fs').promises;\nasync function readFileContent(path) {\n  return await fs.readFile(path, 'utf8');\n}`,
    starter_code_ts: `import { promises as fs } from "fs";\nasync function readFileContent(path: string): Promise<string> {\n  return "";\n}`,
    starter_code_python: `def read_file_content(path):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Always use promises-based FS modules to avoid blocking the single-threaded event loop."
  },
  {
    title: "HTTP Basic Server",
    description: "Build a native Node.js HTTP server returning a JSON status object on port 3000.",
    difficulty: "Easy",
    category: "Node.js",
    points: 10,
    starter_code_js: `const http = require('http');\nfunction createMockServer() {\n  return http.createServer((req, res) => {\n    res.writeHead(200, { 'Content-Type': 'application/json' });\n    res.end(JSON.stringify({ status: 'ok' }));\n  });\n}`,
    starter_code_ts: `import * as http from "http";\nfunction createMockServer(): http.Server {\n  return {} as any;\n}`,
    starter_code_python: `def create_mock_server():\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Call res.end() to finalize response streams and prevent hanging connections."
  },
  {
    title: "CLI Notes App Manager",
    description: "Write a command-line script handler that appends new records to storage logs.",
    difficulty: "Medium",
    category: "Node.js",
    points: 20,
    starter_code_js: `const fs = require('fs').promises;\nasync function addNote(filePath, note) {\n  await fs.appendFile(filePath, note + '\\n');\n  return true;\n}`,
    starter_code_ts: `import { promises as fs } from "fs";\nasync function addNote(filePath: string, note: string): Promise<boolean> {\n  return false;\n}`,
    starter_code_python: `def add_note(file_path, note):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Use appendFile to push text records to log files safely."
  },
  {
    title: "File Upload Stream Handler",
    description: "Create a stream write function to save incoming chunk uploads to local storage.",
    difficulty: "Medium",
    category: "Node.js",
    points: 20,
    starter_code_js: `const fs = require('fs');\nfunction saveUploadedStream(readStream, destPath) {\n  const writeStream = fs.createWriteStream(destPath);\n  readStream.pipe(writeStream);\n}`,
    starter_code_ts: `import * as fs from "fs";\nfunction saveUploadedStream(readStream: any, destPath: string): void {}`,
    starter_code_python: `def save_uploaded_stream(read_stream, dest_path):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Use streams to write chunk uploads to avoid exhausting system memory."
  },
  {
    title: "WebSocket Connection Manager",
    description: "Design a connection tracking array to broadcast messaging payloads to connected clients.",
    difficulty: "Hard",
    category: "Node.js",
    points: 30,
    starter_code_js: `const clients = [];\nfunction broadcast(message) {\n  clients.forEach(c => c.send(message));\n}`,
    starter_code_ts: `const clients: any[] = [];\nfunction broadcast(message: string): void {}`,
    starter_code_python: `def broadcast(message):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Maintain active connection sockets in memory to enable push communications."
  },
  {
    title: "URL Shortener Redirect logic",
    description: "Write a server redirect handler mapping shortened slugs to database resource locations.",
    difficulty: "Hard",
    category: "Node.js",
    points: 30,
    starter_code_js: `const urlMap = { 'g': 'https://google.com' };\nfunction resolveRedirect(slug) {\n  return urlMap[slug] || '/404';\n}`,
    starter_code_ts: `function resolveRedirect(slug: string): string {\n  return "";\n}`,
    starter_code_python: `def resolve_redirect(slug):\n    pass`,
    test_cases: [{ input: ["g"], expected: "https://google.com" }],
    solution: "Return HTTP 302 Found response headers to redirect client browsers."
  },

  // --- Express.js Framework ---
  {
    title: "Product CRUD Routers",
    description: "Create Express routes mapping to standard request handlers for retrieving product collections.",
    difficulty: "Easy",
    category: "Express.js",
    points: 10,
    starter_code_js: `const express = require('express');\nconst router = express.Router();\nrouter.get('/products', (req, res) => {\n  res.json([]);\n});`,
    starter_code_ts: `import { Router } from "express";\nconst router = Router();`,
    starter_code_python: `from flask import Flask\napp = Flask(__name__)`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Express.Router() isolates route definitions for cleaner structures."
  },
  {
    title: "Logging Request Middleware",
    description: "Build an Express middleware logging request methods and target paths.",
    difficulty: "Easy",
    category: "Express.js",
    points: 10,
    starter_code_js: `function logger(req, res, next) {\n  console.log(\`\${req.method} \${req.path}\`);\n  next();\n}`,
    starter_code_ts: `import { Request, Response, NextFunction } from "express";\nfunction logger(req: Request, res: Response, next: NextFunction): void {}`,
    starter_code_python: `def logger(req, res, next):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Call next() inside middleware to avoid hanging connection requests."
  },
  {
    title: "Centralized Error Middleware",
    description: "Create an Express error middleware formatting exception messages for clients.",
    difficulty: "Medium",
    category: "Express.js",
    points: 20,
    starter_code_js: `function errorHandler(err, req, res, next) {\n  res.status(500).json({ error: err.message });\n}`,
    starter_code_ts: `import { Request, Response, NextFunction } from "express";\nfunction errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {}`,
    starter_code_python: `def error_handler(err, req, res, next):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Declare four inputs to register a middleware as an error handler in Express."
  },
  {
    title: "E-Commerce Cart Controllers",
    description: "Build controller functions to calculate cart totals based on item list arrays.",
    difficulty: "Medium",
    category: "Express.js",
    points: 20,
    starter_code_js: `function getCartTotal(items) {\n  return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);\n}`,
    starter_code_ts: `interface CartItem { price: number; quantity: number; }\nfunction getCartTotal(items: CartItem[]): number {\n  return 0;\n}`,
    starter_code_python: `def get_cart_total(items):\n    pass`,
    test_cases: [{ input: [[{ price: 10, quantity: 2 }]], expected: 20 }],
    solution: "Use array methods like reduce to iterate values safely."
  },
  {
    title: "E-Commerce REST API controllers",
    description: "Design transactional routers that handle checkout operations, decreasing inventory levels.",
    difficulty: "Hard",
    category: "Express.js",
    points: 30,
    starter_code_js: `async function handleCheckout(db, order) {\n  // database update queries\n  return true;\n}`,
    starter_code_ts: `async function handleCheckout(db: any, order: any): Promise<boolean> {\n  return false;\n}`,
    starter_code_python: `def handle_checkout(db, order):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Wrap multi-table inventory modifications in database transactions."
  },
  {
    title: "RBAC Authorization guards",
    description: "Build route authorization filters that restrict path access based on user role strings.",
    difficulty: "Hard",
    category: "Express.js",
    points: 30,
    starter_code_js: `function authorize(roles) {\n  return (req, res, next) => {\n    if (roles.includes(req.user.role)) next();\n    else res.status(403).send('Forbidden');\n  };\n}`,
    starter_code_ts: `function authorize(roles: string[]): any {\n  return (req: any, res: any, next: any) => {};\n}`,
    starter_code_python: `def authorize(roles):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Return middleware closures to configure role access controls cleanly."
  },

  // --- REST API Design ---
  {
    title: "Library Endpoint Design Scenario",
    description: "Design REST API endpoints for a library system. Detail the URLs and HTTP methods for managing books, authors, and rentals.",
    difficulty: "Easy",
    category: "REST API",
    points: 10,
    starter_code_js: `// Describe your endpoints and methods here\n/*\nGET /books - List books\nPOST /books - Add book\nGET /books/:id - Get details\n*/`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Follow plural noun conventions (e.g. /books, /authors) and map operations to HTTP verbs: GET (read), POST (create), PUT/PATCH (update), DELETE (remove)."
  },
  {
    title: "REST Convention Responses Scenario",
    description: "Design standard JSON responses for success, validation errors, and authentication failures following REST design principles.",
    difficulty: "Easy",
    category: "REST API",
    points: 10,
    starter_code_js: `// Describe JSON structures for status codes 200, 400, and 401`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Use HTTP 200/201 with payload on success, 400 Bad Request with an errors array on validation issues, and 401 Unauthorized with a clear message on login failure."
  },
  {
    title: "API Pagination and Filtering Design",
    description: "Design the query parameters and backend database logic for paginating and filtering a product search API.",
    difficulty: "Medium",
    category: "REST API",
    points: 20,
    starter_code_js: `// Specify query params like page, limit, sort, filter`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Standardize query parameters: ?page=2&limit=20&category=electronics&sort=-price. Include total count and next/prev links in the response metadata."
  },
  {
    title: "API Versioning Strategy Scenario",
    description: "Propose and compare three different methods for versioning REST APIs (URI, Custom Headers, and Accept Headers).",
    difficulty: "Medium",
    category: "REST API",
    points: 20,
    starter_code_js: `// Compare URI vs Header vs Media type versioning`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "URI versioning (/v1/books) is highly cacheable. Custom headers (X-API-Version: 1.0) and Accept headers (application/vnd.company.v1+json) keep URLs clean but make caching harder."
  },
  {
    title: "Scalable Social Media API Design",
    description: "Design the API endpoints for a scalable social media feed, explaining how you would handle loading nested comments and user profiles.",
    difficulty: "Hard",
    category: "REST API",
    points: 30,
    starter_code_js: `// Design /feed and /posts/:id/comments endpoints`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Use sub-resources (/posts/:id/comments) and lazy-loading with cursor-based pagination for high performance. Avoid deep JSON nesting; fetch related resources in separate requests."
  },
  {
    title: "Rate-Limiting API Design Scenario",
    description: "Design a rate-limiting mechanism for APIs, defining HTTP headers to communicate limits (e.g. X-RateLimit-Limit) and error codes.",
    difficulty: "Hard",
    category: "REST API",
    points: 30,
    starter_code_js: `// Design rate-limit headers and 429 Too Many Requests response`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Track IP/API Keys using a fast in-memory store like Redis. Return status code 429 and headers: X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After."
  },

  // --- Authentication & Security ---
  {
    title: "Password Hashing with Bcrypt",
    description: "Write a function to hash passwords and verify matching credentials using Bcrypt salt routines.",
    difficulty: "Easy",
    category: "Security",
    points: 10,
    starter_code_js: `const bcrypt = require('bcrypt');\nasync function hashPassword(plainText) {\n  return await bcrypt.hash(plainText, 10);\n}`,
    starter_code_ts: `import * as bcrypt from "bcrypt";\nasync function hashPassword(plainText: string): Promise<string> {\n  return "";\n}`,
    starter_code_python: `import bcrypt\ndef hash_password(plain_text):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Use Bcrypt with a salt factor of 10+ to slow down brute force cracking attempts."
  },
  {
    title: "JWT Login and Verification",
    description: "Create validation routines to generate tokens and verify JWT signatures.",
    difficulty: "Easy",
    category: "Security",
    points: 10,
    starter_code_js: `const jwt = require('jsonwebtoken');\nfunction createToken(payload, secret) {\n  return jwt.sign(payload, secret, { expiresIn: '1h' });\n}`,
    starter_code_ts: `import * as jwt from "jsonwebtoken";\nfunction createToken(payload: any, secret: string): string {\n  return "";\n}`,
    starter_code_python: `import jwt\ndef create_token(payload, secret):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Enforce expiry properties on generated tokens to reduce damage if compromised."
  },
  {
    title: "Role-Based Route guards",
    description: "Design route middleware blocks that block unauthorized user roles.",
    difficulty: "Medium",
    category: "Security",
    points: 20,
    starter_code_js: `function checkRole(requiredRole) {\n  return (req, res, next) => {\n    if (req.user && req.user.role === requiredRole) next();\n    else res.status(403).send('Unauthorized');\n  };\n}`,
    starter_code_ts: `function checkRole(requiredRole: string): any {\n  return (req: any, res: any, next: any) => {};\n}`,
    starter_code_python: `def check_role(required_role):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Apply authorization filters on routes immediately after verifying credentials."
  },
  {
    title: "Refresh Token Security Flow",
    description: "Design standard endpoints to handle token renewal based on refresh token validations.",
    difficulty: "Medium",
    category: "Security",
    points: 20,
    starter_code_js: `const refreshTokens = [];\nfunction renewAccessToken(token, secret) {\n  if (!refreshTokens.includes(token)) return null;\n  return 'new_access_token';\n}`,
    starter_code_ts: `function renewAccessToken(token: string, secret: string): string | null {\n  return null;\n}`,
    starter_code_python: `def renew_access_token(token, secret):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Store refresh tokens in HttpOnly cookies to defend against Cross-Site Scripting (XSS) theft."
  },
  {
    title: "OAuth2 Provider Integration",
    description: "Write auth handlers to exchange OAuth2 authorization codes for user details payload.",
    difficulty: "Hard",
    category: "Security",
    points: 30,
    starter_code_js: `async function exchangeCode(code, clientSecret) {\n  // HTTP post to OAuth provider\n  return 'access_token';\n}`,
    starter_code_ts: `async function exchangeCode(code: string, clientSecret: string): Promise<string> {\n  return "";\n}`,
    starter_code_python: `def exchange_code(code, client_secret):\n    pass`,
    test_cases: [{ input: [], expected: "" }],
    solution: "Perform token exchanges server-side directly with the OAuth provider to keep credentials safe."
  },
  {
    title: "Secure Auth System Architecture",
    description: "Design a complete authentication architecture detailing access token rotation, verification keys, and lockouts.",
    difficulty: "Hard",
    category: "Security",
    points: 30,
    starter_code_js: `// Describe access token rotation and lockout policies\n/*\nAccess token: 15m\nRefresh token: 7d\nFailed logins: Lockout after 5 attempts\n*/`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Build multi-tier auth featuring short-lived access tokens, stored refresh tokens in HttpOnly cookies, and account lockouts via Redis counters."
  },

  // --- Database Fundamentals ---
  {
    title: "SQL Tables Creation",
    description: "Write raw SQL DDL queries to create users and products tables with keys.",
    difficulty: "Easy",
    category: "Database",
    points: 10,
    starter_code_js: `const createTablesSQL = \`\n  CREATE TABLE users (\n    id SERIAL PRIMARY KEY,\n    email VARCHAR(255) UNIQUE NOT NULL\n  );\n\`;`,
    starter_code_ts: `const createTablesSQL: string = "";`,
    starter_code_python: `create_tables_sql = ""`,
    test_cases: [{ input: [], expected: "PRIMARY KEY" }],
    solution: "Enforce correct constraints like PRIMARY KEY and UNIQUE on critical database columns."
  },
  {
    title: "CRUD Query logic",
    description: "Write database operations to query, update, and delete user profiles.",
    difficulty: "Easy",
    category: "Database",
    points: 10,
    starter_code_js: `function getInsertUserSQL(email) {\n  return \`INSERT INTO users (email) VALUES ('\${email}')\`;\n}`,
    starter_code_ts: `function getInsertUserSQL(email: string): string {\n  return "";\n}`,
    starter_code_python: `def get_insert_user_sql(email):\n    pass`,
    test_cases: [{ input: ["test@example.com"], expected: "INSERT INTO" }],
    solution: "Use parameterized queries (e.g., $1, ?) in production to prevent SQL injection vulnerabilities."
  },
  {
    title: "Database Relational design",
    description: "Design a schema mapping many-to-many relationships (e.g. orders to products) using junction tables.",
    difficulty: "Medium",
    category: "Database",
    points: 20,
    starter_code_js: `const junctionTableSQL = \`\n  CREATE TABLE order_items (\n    order_id INT REFERENCES orders(id),\n    product_id INT REFERENCES products(id),\n    PRIMARY KEY (order_id, product_id)\n  );\n\`;`,
    starter_code_ts: `const junctionTableSQL: string = "";`,
    starter_code_python: `junction_table_sql = ""`,
    test_cases: [{ input: [], expected: "REFERENCES" }],
    solution: "Map relationships using foreign key constraints and junction tables for many-to-many mappings."
  },
  {
    title: "E-Commerce Schema Design",
    description: "Design a database schema representing users, categories, products, orders, and transaction details.",
    difficulty: "Medium",
    category: "Database",
    points: 20,
    starter_code_js: `// Describe tables and foreign key relationships`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Construct tables with clear DDL structures, establishing order-to-product foreign keys, and indexes on indexable keys."
  },
  {
    title: "Slow Query Optimization Scenario",
    description: "Analyze and optimize a query with multiple nested joins and filters that is running slowly. Propose index plans.",
    difficulty: "Hard",
    category: "Database",
    points: 30,
    starter_code_js: `// Propose EXPLAIN ANALYZE and INDEX configurations`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Execute EXPLAIN to isolate scanning bottlenecks. Introduce compound indexes on filtered fields and convert outer loops to joins."
  },
  {
    title: "Inventory Management Transaction",
    description: "Write database operations to subtract stocks during checkout, reversing queries if inventory levels drop below zero.",
    difficulty: "Hard",
    category: "Database",
    points: 30,
    starter_code_js: `const checkoutTxSQL = \`\n  BEGIN TRANSACTION;\n  UPDATE products SET stock = stock - 1 WHERE id = $1;\n  COMMIT;\n\`;`,
    starter_code_ts: `const checkoutTxSQL: string = "";`,
    starter_code_python: `checkout_tx_sql = ""`,
    test_cases: [{ input: [], expected: "TRANSACTION" }],
    solution: "Always execute database transactions with ROLLBACK controls to preserve database accuracy."
  },

  // --- Backend Architecture ---
  {
    title: "Blog Platform Architecture Scenario",
    description: "Design the architecture for a blogging platform. Explain how you would decouple rendering, databases, and assets storage.",
    difficulty: "Easy",
    category: "Architecture",
    points: 10,
    starter_code_js: `// Design decoupled components: Static CDN, Web server, Database`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Decouple rendering using a static frontend (CDN), APIs hosted on auto-scaling servers, and media files stored in cloud object storage (S3)."
  },
  {
    title: "Microservice Boundaries Scenario",
    description: "Define boundaries and communication pathways for an e-commerce platform split into Microservices (Auth, Catalog, Cart, Order).",
    difficulty: "Easy",
    category: "Architecture",
    points: 10,
    starter_code_js: `// Define microservice boundaries and sync vs async communication`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Define isolated boundaries with independent databases. Use synchronous HTTP/gRPC for catalog lookups, and asynchronous RabbitMQ/Kafka for orders processing."
  },
  {
    title: "E-Commerce Caching Strategy",
    description: "Design a caching layer for an e-commerce platform. Explain what data should be cached, where, and what invalidation strategies to use.",
    difficulty: "Medium",
    category: "Architecture",
    points: 20,
    starter_code_js: `// Design cache-aside / write-through configurations for Redis`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Use Redis for shopping carts and catalogs. Implement the Cache-Aside pattern for database reads, and set TTLs (time-to-live) for safe cache invalidation."
  },
  {
    title: "Service Communication Flow Scenario",
    description: "Design the end-to-end communication flow for a checkout service, detailing how it communicates with billing, shipping, and email services.",
    difficulty: "Medium",
    category: "Architecture",
    points: 20,
    starter_code_js: `// Design message queue exchanges and retry policies`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Checkout writes to an Order DB and publishes an 'order.created' event. Billing and Shipping consume this event asynchronously, handling failures with dead-letter queues (DLQ)."
  },
  {
    title: "Ride-Sharing Architecture Design",
    description: "Design the backend architecture for a ride-sharing system like Uber, handling real-time driver tracking and matching algorithms.",
    difficulty: "Hard",
    category: "Architecture",
    points: 30,
    starter_code_js: `// Design geo-indexing databases (Redis/S2) and matching systems`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Utilize WebSockets/gRPC for streaming driver locations. Track spatial indexes using Redis Geospatial or Google S2 geometry, matching nearby passengers asynchronously."
  },
  {
    title: "Scalable Feed Architecture Scenario",
    description: "Design a system architecture capable of serving activity feeds to 1 million active users daily, avoiding database query locks.",
    difficulty: "Hard",
    category: "Architecture",
    points: 30,
    starter_code_js: `// Design fan-out on write vs fan-out on read architectures`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Use Fan-out on Write (push model) by writing posts to active followers' Redis lists. Use Fan-out on Read (pull model) only for celebrity accounts to save memory."
  },

  // --- System Design Basics ---
  {
    title: "URL Shortener Design Scenario",
    description: "Design a URL Shortener system like bit.ly. Estimate scale, storage needs, and outline key design layers.",
    difficulty: "Easy",
    category: "System Design",
    points: 10,
    starter_code_js: `// Detail estimations (QPS, storage) and base-62 encoding design`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Use Base62 encoding to generate short slugs. Calculate storage requirements (e.g. 500 bytes per URL) and use caching for redirect queries."
  },
  {
    title: "Social Media Caching Plan",
    description: "Explain how and where to introduce caching in a social media application to resolve feed query bottlenecks.",
    difficulty: "Easy",
    category: "System Design",
    points: 10,
    starter_code_js: `// Detail Cache targets: CDNs, Redis feed caches, DB query caches`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Serve static assets from CDNs, cache user profiles and follow relations in Redis, and cache pre-computed timeline lists to avoid database reads."
  },
  {
    title: "Chat Service System Design",
    description: "Design a real-time chat service supporting 1-on-1 and group chats, detailing connections management and message storage.",
    difficulty: "Medium",
    category: "System Design",
    points: 20,
    starter_code_js: `// Design WebSocket gateways, message stores (NoSQL), and statuses`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Connect users via WebSockets managed by Gateway instances. Store chat history in Cassandra or DynamoDB, and use Redis Pub/Sub to route messages between servers."
  },
  {
    title: "Distributed File Storage Design",
    description: "Design a distributed file storage service like Dropbox. Explain how files are uploaded, chunked, and synced across devices.",
    difficulty: "Medium",
    category: "System Design",
    points: 20,
    starter_code_js: `// Design file chunking, block storage, and metadata servers`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Split files into 4MB chunks and store them in object storage. Maintain version histories and file block locations in a metadata database, notifying clients via long polling."
  },
  {
    title: "Video Streaming Platform Design",
    description: "Design a video streaming platform like YouTube. Explain video uploading, transcoding pipelines, and content delivery networks (CDNs).",
    difficulty: "Hard",
    category: "System Design",
    points: 30,
    starter_code_js: `// Design ingest queue, transcoding worker pool, and HLS/DASH CDNs`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Ingest videos to cloud storage. Use worker queues (transcoders) to compile standard formats (HLS/DASH) at different resolutions, serving content through global CDNs."
  },
  {
    title: "Instagram Scale Design Scenario",
    description: "Design a photo-sharing application like Instagram at massive scale, supporting millions of active feeds, likes, and photo uploads.",
    difficulty: "Hard",
    category: "System Design",
    points: 30,
    starter_code_js: `// Design write path, feed generation, and database sharding`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Shard relational databases on userId. Implement pre-computed feeds in Redis, serve compressed images from CDN nodes, and queue write updates to keep databases fast."
  },

  // --- Git & GitHub Mastery ---
  {
    title: "Git Commit Basics",
    description: "Detail the commands required to initialize a local Git repository, add files, and commit changes.",
    difficulty: "Easy",
    category: "Git",
    points: 10,
    starter_code_js: `// Write Git commands to initialize, add, and commit\n/*\ngit init\ngit add .\n*/`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Use git init to create a repo, git add <files> to stage changes, and git commit -m 'message' to commit them."
  },
  {
    title: "Git Branching Workflows",
    description: "Detail the commands required to create a feature branch, switch to it, make changes, and merge it back into main.",
    difficulty: "Easy",
    category: "Git",
    points: 10,
    starter_code_js: `// Write branch commands`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Use git checkout -b <branch> to create and switch, then switch back with git checkout main, and merge with git merge <branch>."
  },
  {
    title: "Merge Conflict Resolution Scenario",
    description: "Describe the steps and Git commands used to identify, resolve, and commit a merge conflict between two branches modifying the same line.",
    difficulty: "Medium",
    category: "Git",
    points: 20,
    starter_code_js: `// Describe steps to resolve merge conflicts`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Run git merge <branch>. Locate conflict markers (<<<<<<<, =======, >>>>>>>) in the code, choose the correct lines, stage the file (git add), and run git commit."
  },
  {
    title: "Git Revert vs Reset Scenario",
    description: "Propose when to use git revert versus git reset, outlining the impact of each on public shared repository histories.",
    difficulty: "Medium",
    category: "Git",
    points: 20,
    starter_code_js: `// Compare git revert vs git reset`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Use git revert to safely undo a commit on a public branch by creating a new commit. Avoid git reset on shared branches, as it deletes history and disrupts other developers."
  },
  {
    title: "Team Branching Strategy Design",
    description: "Design a git branching workflow strategy (e.g. GitFlow, GitHub Flow) for a team of 10 developers releasing updates bi-weekly.",
    difficulty: "Hard",
    category: "Git",
    points: 30,
    starter_code_js: `// Design GitFlow or GitHub Flow strategy`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Implement GitHub Flow for continuous deployment, or GitFlow with 'main', 'develop', and 'release/' branches to manage bi-weekly schedules."
  },
  {
    title: "GitHub Actions CI/CD pipeline",
    description: "Design a GitHub Actions workflow YAML configuration that triggers on push to main, installing packages and running test scripts.",
    difficulty: "Hard",
    category: "Git",
    points: 30,
    starter_code_js: `// Design GitHub Actions YAML pipeline config`,
    starter_code_ts: `// Scenario challenge`,
    starter_code_python: ``,
    test_cases: [],
    solution: "Write a .github/workflows/test.yml file specifying on: [push], using actions/checkout and actions/setup-node steps, followed by npm install and npm test."
  }
];

async function seed() {
  // Add unique UUIDs to each challenge
  challenges.forEach((ch, index) => {
    const hex = (index + 1).toString(16).padStart(12, '0');
    ch.id = `ca11e4ge-0000-0000-0000-${hex}`;
  });

  console.log("🚀 Starting seeding of challenges...");
  
  // First, delete existing challenges to avoid duplicate seeding
  console.log("🧹 Clearing old challenges...");
  const deleteRes = await fetch(`${SUPABASE_URL}/rest/v1/challenges?id=not.is.null`, {
    method: "DELETE",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!deleteRes.ok) {
    const errorText = await deleteRes.text();
    console.error(`❌ Failed to clear challenges: ${errorText}`);
    return;
  }
  
  console.log("✅ Cleared challenges successfully.");

  // Insert in batches of 10
  const batchSize = 10;
  for (let i = 0; i < challenges.length; i += batchSize) {
    const batch = challenges.slice(i, i + batchSize);
    console.log(`📦 Seeding batch ${i / batchSize + 1} (${batch.length} items)...`);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/challenges`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(batch)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Failed to seed batch: ${errorText}`);
      return;
    }
  }

  console.log("🎉 Seeding completed successfully!");
}

seed();
