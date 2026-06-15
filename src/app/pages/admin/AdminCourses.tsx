import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { supabase } from "../../lib/supabase";
import { Search, BookOpen, Clock, Eye, EyeOff, Layers } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  thumbnail_color: string;
  duration_hours: number;
  is_published: boolean;
  created_at: string;
  moduleCount?: number;
  lessonCount?: number;
  enrollmentCount?: number;
}

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Advanced: "bg-red-100 text-red-700 border-red-200",
};

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => { fetchCourses(); }, []);

  async function fetchCourses() {
    setLoading(true);
    const { data } = await supabase.from("courses").select("*").order("created_at");
    if (!data) { setLoading(false); return; }

    const enriched = await Promise.all(
      data.map(async (course) => {
        const { count: moduleCount } = await supabase.from("modules").select("id", { count: "exact", head: true }).eq("course_id", course.id);
        const moduleIds = (await supabase.from("modules").select("id").eq("course_id", course.id)).data?.map((m) => m.id) ?? [];
        const { count: lessonCount } = moduleIds.length > 0
          ? await supabase.from("lessons").select("id", { count: "exact", head: true }).in("module_id", moduleIds)
          : { count: 0 };
        const lessonIds = moduleIds.length > 0
          ? (await supabase.from("lessons").select("id").in("module_id", moduleIds)).data?.map((l) => l.id) ?? []
          : [];
        const { count: enrollmentCount } = lessonIds.length > 0
          ? await supabase.from("user_progress").select("id", { count: "exact", head: true }).in("lesson_id", lessonIds)
          : { count: 0 };
        return { ...course, moduleCount: moduleCount ?? 0, lessonCount: lessonCount ?? 0, enrollmentCount: enrollmentCount ?? 0 };
      })
    );

    setCourses(enriched);
    setLoading(false);
  }

  async function togglePublish(id: string, current: boolean) {
    setToggling(id);
    await supabase.from("courses").update({ is_published: !current }).eq("id", id);
    await fetchCourses();
    setToggling(null);
  }

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.difficulty.toLowerCase().includes(q);
  });

  const publishedCount = courses.filter((c) => c.is_published).length;
  const draftCount = courses.filter((c) => !c.is_published).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all platform courses</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-blue-100 rounded-lg"><BookOpen className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-2xl font-bold">{courses.length}</p><p className="text-xs text-muted-foreground">Total Courses</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-green-100 rounded-lg"><Eye className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-2xl font-bold">{publishedCount}</p><p className="text-xs text-muted-foreground">Published</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-gray-100 rounded-lg"><EyeOff className="w-5 h-5 text-gray-600" /></div>
          <div><p className="text-2xl font-bold">{draftCount}</p><p className="text-xs text-muted-foreground">Drafts</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> All Courses</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No courses found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((course) => (
                <div key={course.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/30 transition-colors">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${course.thumbnail_color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{course.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium ${difficultyColors[course.difficulty] ?? ""}`}>{course.difficulty}</span>
                      <Badge variant={course.is_published ? "default" : "secondary"} className="text-xs">
                        {course.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{course.moduleCount} modules</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessonCount} lessons</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration_hours}h</span>
                      <span>{course.category}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={course.is_published ? "outline" : "default"}
                    className="flex-shrink-0 h-8 text-xs"
                    disabled={toggling === course.id}
                    onClick={() => togglePublish(course.id, course.is_published)}
                  >
                    {course.is_published ? <><EyeOff className="w-3.5 h-3.5 mr-1" />Unpublish</> : <><Eye className="w-3.5 h-3.5 mr-1" />Publish</>}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
