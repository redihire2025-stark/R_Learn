import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, BookOpen, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../../components/ui/skeleton";
import { getCourseLogoUrl, getCourseAccentColor, getChallengesForCourse } from "../../lib/utils";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  thumbnail_color: string;
  duration_hours: number;
  progress?: number;
  moduleCount?: number;
}

const difficultyConfig: Record<string, { label: string; className: string }> = {
  Beginner: {
    label: "Beginner",
    className: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  },
  Intermediate: {
    label: "Intermediate",
    className: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
  },
  Advanced: {
    label: "Advanced",
    className: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
  },
};

export function CourseExplorer() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => { fetchCourses(); }, []);

  async function fetchCourses() {
    setLoading(true);
    const { data: coursesData } = await supabase.from("courses").select("*").eq("is_published", true).order("created_at");
    if (!coursesData) { setLoading(false); return; }

    const { data: allEasy } = await supabase.from("challenges").select("*").eq("difficulty", "Easy").eq("is_published", true);

    const coursesWithProgress = await Promise.all(
      coursesData.map(async (course) => {
        const { count: totalLessons } = await supabase
          .from("lessons").select("id", { count: "exact", head: true })
          .in("module_id", (await supabase.from("modules").select("id").eq("course_id", course.id)).data?.map((m) => m.id) ?? []);

        const { count: completedLessons } = user
          ? await supabase
              .from("user_progress").select("id", { count: "exact", head: true })
              .eq("user_id", user.id)
              .in("lesson_id", (await supabase.from("lessons").select("id").in("module_id", (await supabase.from("modules").select("id").eq("course_id", course.id)).data?.map((m) => m.id) ?? [])).data?.map((l) => l.id) ?? [])
          : { count: 0 };

        const { count: moduleCount } = await supabase
          .from("modules").select("id", { count: "exact", head: true }).eq("course_id", course.id);

        const courseChalls = getChallengesForCourse(course.id, allEasy ?? []);
        const { data: solvedSubs } = user && courseChalls.length > 0
          ? await supabase
              .from("challenge_submissions").select("challenge_id, passed")
              .eq("user_id", user.id)
              .in("challenge_id", courseChalls.map((c) => c.id))
              .eq("passed", true)
          : { data: [] };
        const solvedCount = new Set(solvedSubs?.map((s) => s.challenge_id) ?? []).size;

        const totalItems = (totalLessons ?? 0) + 3;
        const completedItems = (completedLessons ?? 0) + solvedCount;
        const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        return { ...course, progress, moduleCount: moduleCount ?? 0 };
      })
    );

    setCourses(coursesWithProgress);
    setLoading(false);
  }

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) &&
      (category === "All" || c.category === category) &&
      (difficulty === "All" || c.difficulty === difficulty)
    );
  });

  const inProgress = filtered.filter((c) => c.progress! > 0 && c.progress! < 100);
  const others = filtered.filter((c) => c.progress! === 0 || c.progress! === 100);

  const CourseCard = ({ course }: { course: Course }) => {
    const accent = getCourseAccentColor(course.title);
    const diff = difficultyConfig[course.difficulty];
    return (
      <Card className="group relative flex flex-col h-full overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-0.5">
        {/* Tech-colored top accent stripe */}
        <div className="h-[3px] w-full flex-shrink-0 rounded-t-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}40, transparent)` }} />

        {/* Thumbnail */}
        <div className="relative w-full h-44 flex items-center justify-center overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-[#0a0c10]">
          {/* Radial glow — works on both light/dark because it layers on top of the base */}
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 60%, ${accent}28 0%, transparent 68%)` }} />
          {/* Dot grid texture */}
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{ backgroundImage: "radial-gradient(circle, rgba(128,128,128,0.25) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
          />
          {/* Soft glow blob behind logo */}
          <div
            className="absolute w-28 h-28 rounded-full blur-3xl opacity-20 dark:opacity-25 group-hover:opacity-35 dark:group-hover:opacity-40 transition-opacity duration-500"
            style={{ background: accent }}
          />
          {/* Logo */}
          <img
            src={getCourseLogoUrl(course.title)}
            alt={course.title}
            className="relative z-10 w-[88px] h-[88px] object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
          />
          {/* Category pill */}
          <span className="absolute top-3 right-3 text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-background/75 text-muted-foreground border border-border backdrop-blur-sm">
            {course.category}
          </span>
        </div>

        {/* Card body */}
        <CardContent className="flex flex-col flex-grow p-5 gap-3">
          {/* Difficulty badge */}
          {diff && (
            <span className={`self-start text-[10px] px-2.5 py-0.5 rounded-full border font-bold tracking-widest uppercase ${diff.className}`}>
              {diff.label}
            </span>
          )}

          {/* Title + description */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold leading-snug line-clamp-1 text-foreground">{course.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">{course.description}</p>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-3 mt-auto">
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
              {course.moduleCount} modules
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
              {course.duration_hours}h
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Star className="w-3.5 h-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
              4.8
            </span>
          </div>

          {/* Progress bar */}
          {(course.progress ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%`, background: accent }}
                />
              </div>
              <span className="text-[10px] font-semibold tabular-nums text-muted-foreground w-7 text-right">
                {course.progress}%
              </span>
            </div>
          )}

          {/* CTA */}
          <Link to={`/courses/${course.id}`} className="block w-full">
            <Button
              className="w-full h-9 text-xs font-semibold rounded-lg transition-all"
              size="sm"
              style={
                course.progress !== 0
                  ? { background: accent, color: "#000", border: "none", fontWeight: 700 }
                  : {}
              }
              variant={course.progress === 0 ? "outline" : "default"}
            >
              {course.progress === 100 ? "Review Course" : course.progress! > 0 ? "Continue Learning" : "Start Course"}
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Course Explorer</h1>
        <p className="text-muted-foreground mt-1.5">14 technology tracks — from HTML to System Design</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44">
            <SelectValue>{category === "All" ? "All Categories" : category}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {["All", "Frontend", "Backend", "DevOps", "System Design"].map((c) => (
              <SelectItem key={c} value={c}>{c === "All" ? "All Categories" : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-44">
            <SelectValue>{difficulty === "All" ? "All Difficulties" : difficulty}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {["All", "Beginner", "Intermediate", "Advanced"].map((d) => (
              <SelectItem key={d} value={d}>{d === "All" ? "All Difficulties" : d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      ) : (
        <>
          {inProgress.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-widest">Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {inProgress.map((c) => <CourseCard key={c.id} course={c} />)}
              </div>
            </section>
          )}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-widest">All Courses</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">{others.length} courses</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {others.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
