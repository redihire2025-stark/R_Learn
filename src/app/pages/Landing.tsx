import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Code, BookOpen, Trophy, Users, ArrowRight, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import logoImage from "../../imports/R-Learn.png";
import { supabase } from "../lib/supabase";

const features = [
  {
    icon: BookOpen,
    title: "Documentation-First Learning",
    description: "Master technologies through comprehensive, well-structured courses and guides.",
  },
  {
    icon: Code,
    title: "Hands-On Challenges",
    description: "Practice with real coding challenges and a built-in Monaco editor environment.",
  },
  {
    icon: Trophy,
    title: "Gamified Experience",
    description: "Earn XP, maintain streaks, and compete on the leaderboard with your colleagues.",
  },
  {
    icon: Users,
    title: "Team Learning",
    description: "Track team progress, compare department rankings, and grow together.",
  },
];

const technologies = [
  "HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Node.js",
  "Tailwind CSS", "REST APIs", "Git & GitHub", "Databases", "Express.js", "System Design",
];

interface PlatformStats {
  members: number;
  courses: number;
  challenges: number;
}

export function Landing() {
  const [stats, setStats] = useState<PlatformStats>({ members: 0, courses: 0, challenges: 0 });

  useEffect(() => {
    (async () => {
      const [usersRes, coursesRes, challengesRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_approved", true),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("challenges").select("id", { count: "exact", head: true }).eq("is_published", true),
      ]);
      setStats({
        members: usersRes.count ?? 0,
        courses: coursesRes.count ?? 0,
        challenges: challengesRes.count ?? 0,
      });
    })();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <ImageWithFallback src={logoImage} alt="R-Learn" className="h-8 w-auto" />
          <div className="flex items-center gap-3">
            <Link to="/signin"><Button variant="ghost">Sign In</Button></Link>
            <Link to="/signup"><Button>Request Access</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <ImageWithFallback src={logoImage} alt="R-Learn" className="h-20 w-auto mx-auto" />
          <h1 className="text-5xl font-bold leading-tight">
            Master Developer Skills with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              R-Learn
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The internal developer upskilling platform for{" "}
            <span className="text-primary font-semibold">@redihire.com</span> team members.
            Learn frontend, backend, and system design through courses, coding challenges, and quizzes.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8">
                Request Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/signin">
              <Button size="lg" variant="outline" className="text-lg px-8">Sign In</Button>
            </Link>
          </div>

          {/* Live stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {stats.members > 0 ? stats.members : "—"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {stats.courses > 0 ? stats.courses : "—"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {stats.challenges > 0 ? stats.challenges : "—"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Challenges</div>
            </div>
          </div>
        </div>
      </section>

      {/* Domain notice */}
      <div className="bg-primary/5 border-y border-primary/10 py-4">
        <div className="container mx-auto px-6 text-center flex items-center justify-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-primary" />
          <span>
            <strong>Company-exclusive platform</strong> — Only{" "}
            <span className="text-primary font-medium">@redihire.com</span> email addresses are accepted.
            Sign up requires admin approval.
          </span>
        </div>
      </div>

      {/* Features */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-muted-foreground">Comprehensive features designed for effective developer learning</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Technologies You'll Master</h2>
          <p className="text-muted-foreground">Learn the most in-demand technologies for modern development</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {technologies.map((tech) => (
            <div key={tech} className="px-6 py-3 bg-accent rounded-full border border-border hover:bg-accent/80 transition-colors">
              <span className="font-medium">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join the team on R-Learn and master the skills needed for modern development. Your growth is tracked, rewarded, and celebrated.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Request Access
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <ImageWithFallback src={logoImage} alt="R-Learn" className="h-8 w-auto" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} R-Learn · Internal Developer Learning Platform · redihire.com
          </p>
        </div>
      </footer>
    </div>
  );
}
