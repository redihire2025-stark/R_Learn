import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Search, BookOpen, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../../components/ui/skeleton";

import { getCourseCoverImage, getChallengesForCourse } from "../../lib/utils";

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

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Advanced: "bg-red-100 text-red-700 border-red-200",
};

export function CourseExplorer() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    const { data: coursesData } = await supabase.from("courses").select("*").eq("is_published", true).order("created_at");
    if (!coursesData) { setLoading(false); return; }

    const { data: allEasy } = await supabase.from("challenges").select("*").eq("difficulty", "Easy").eq("is_published", true);

    const coursesWithProgress = await Promise.all(
      coursesData.map(async (course) => {
        const { count: totalLessons } = await supabase
          .from("lessons")
          .select("id", { count: "exact", head: true })
          .in("module_id", (await supabase.from("modules").select("id").eq("course_id", course.id)).data?.map((m) => m.id) ?? []);

        const { count: completedLessons } = user
          ? await supabase
              .from("user_progress")
              .select("id", { count: "exact", head: true })
              .eq("user_id", user.id)
              .in("lesson_id", (await supabase.from("lessons").select("id").in("module_id", (await supabase.from("modules").select("id").eq("course_id", course.id)).data?.map((m) => m.id) ?? [])).data?.map((l) => l.id) ?? [])
          : { count: 0 };

        const { count: moduleCount } = await supabase
          .from("modules")
          .select("id", { count: "exact", head: true })
          .eq("course_id", course.id);

        const courseChalls = getChallengesForCourse(course.id, allEasy ?? []);
        const { data: solvedSubs } = user && courseChalls.length > 0
          ? await supabase
              .from("challenge_submissions")
              .select("challenge_id, passed")
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

  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden border border-border">
      <div className="relative w-full h-40 overflow-hidden group">
        <img 
          src={getCourseCoverImage(course.title)} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute bottom-3 right-3 text-xs px-2.5 py-0.5 rounded-full font-medium bg-black/40 text-white backdrop-blur-sm border border-white/20">
          {course.category}
        </span>
      </div>
      
      <CardHeader className="space-y-2 flex-grow pb-3">
        <div className="flex gap-2 items-center">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold tracking-wide uppercase ${difficultyColors[course.difficulty] ?? ""}`}>
            {course.difficulty}
          </span>
        </div>
        <CardTitle className="text-base font-bold leading-snug line-clamp-1">{course.title}</CardTitle>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem] leading-relaxed">{course.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0 mt-auto">
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3">
          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-primary" />{course.moduleCount} modules</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" />{course.duration_hours}h</span>
          <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />4.8</span>
        </div>
        
        {(course.progress ?? 0) > 0 && (
          <div className="flex items-center gap-2">
            <Progress value={course.progress} className="h-1.5 flex-1" />
            <span className="text-[10px] font-medium text-muted-foreground">{course.progress}%</span>
          </div>
        )}
        
        <Link to={`/courses/${course.id}`} className="block w-full">
          <Button className="w-full font-medium" size="sm" variant={course.progress === 0 ? "outline" : "default"}>
            {course.progress === 100 ? "Review Course" : course.progress! > 0 ? "Continue" : "Start Course"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Course Explorer</h1>
        <p className="text-muted-foreground mt-1">14 technology tracks — from HTML to System Design</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["All","Frontend","Backend","DevOps","System Design"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["All","Beginner","Intermediate","Advanced"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : (
        <>
          {inProgress.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgress.map((c) => <CourseCard key={c.id} course={c} />)}
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">All Courses</h2>
              <p className="text-sm text-muted-foreground">{others.length} courses</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
