import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Skeleton } from "../../components/ui/skeleton";
import { Search, BookOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { supabase, Course, UserCourseProgress } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { difficultyColor } from "../../lib/xp";

const categories = ["All", "Frontend", "Backend", "DevOps", "Full Stack"];
const difficulties = ["All", "beginner", "intermediate", "advanced"];

type CourseWithProgress = Course & { progress?: number };

export function CourseExplorer() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  useEffect(() => {
    if (!user) return;
    loadCourses();
  }, [user?.id]);

  async function loadCourses() {
    setLoading(true);
    try {
      const [{ data: coursesData }, { data: progressData }] = await Promise.all([
        supabase.from("courses").select("*").eq("is_published", true).order("created_at"),
        supabase.from("user_course_progress").select("*").eq("user_id", user!.id),
      ]);

      const progressMap: Record<string, number> = {};
      (progressData as UserCourseProgress[] ?? []).forEach((p) => {
        progressMap[p.course_id] = p.progress_percent;
      });

      setCourses(
        (coursesData as Course[] ?? []).map((c) => ({
          ...c,
          progress: progressMap[c.id],
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "All" || c.category === selectedCategory;
    const matchDiff = selectedDifficulty === "All" || c.difficulty === selectedDifficulty;
    return matchSearch && matchCat && matchDiff;
  });

  const inProgress = filtered.filter((c) => (c.progress ?? 0) > 0 && (c.progress ?? 0) < 100);
  const notStarted = filtered.filter((c) => !c.progress || c.progress === 0);
  const completed = filtered.filter((c) => c.progress === 100);

  const CourseCard = ({ course }: { course: CourseWithProgress }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className={`w-full h-28 rounded-lg bg-gradient-to-br ${course.thumbnail_gradient} mb-3`} />
        <div className="flex gap-2 mb-2">
          <Badge variant={difficultyColor(course.difficulty) as "default" | "secondary" | "destructive" | "outline"} className="text-xs capitalize">
            {course.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs">{course.category}</Badge>
        </div>
        <CardTitle className="text-base leading-tight">{course.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {course.total_lessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.estimated_hours}h
          </span>
        </div>
        {(course.progress ?? 0) > 0 ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Progress value={course.progress} className="h-1.5" />
              <span className="text-xs text-muted-foreground">{course.progress}%</span>
            </div>
            <Link to={`/courses/${course.id}`}>
              <Button className="w-full" size="sm">
                {course.progress === 100 ? "Review Course" : "Continue"}
              </Button>
            </Link>
          </div>
        ) : (
          <Link to={`/courses/${course.id}`}>
            <Button variant="outline" className="w-full" size="sm">Start Course</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Course Explorer</h1>
        <p className="text-muted-foreground mt-1">Explore comprehensive developer learning paths</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>{difficulties.map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      ) : (
        <>
          {/* In Progress */}
          {inProgress.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgress.map((c) => <CourseCard key={c.id} course={c} />)}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completed.map((c) => <CourseCard key={c.id} course={c} />)}
              </div>
            </div>
          )}

          {/* All / Not Started */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{inProgress.length > 0 ? "Available Courses" : "All Courses"}</h2>
              <p className="text-sm text-muted-foreground">{notStarted.length} courses</p>
            </div>
            {notStarted.length === 0 ? (
              <p className="text-muted-foreground">No courses match your filters.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notStarted.map((c) => <CourseCard key={c.id} course={c} />)}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
