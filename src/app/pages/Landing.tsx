import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Code, BookOpen, Trophy, Users, ArrowRight, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import logoImage from "../../imports/R-Learn.png";

const features = [
  {
    icon: BookOpen,
    title: "Documentation-First Learning",
    description: "Master technologies through comprehensive, well-structured documentation and guides.",
  },
  {
    icon: Code,
    title: "Hands-On Challenges",
    description: "Practice with real-world coding challenges and build your problem-solving skills.",
  },
  {
    icon: Trophy,
    title: "Gamified Experience",
    description: "Earn XP, maintain streaks, and compete on leaderboards with your colleagues.",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "Get guidance from experienced mentors and learn from peer discussions.",
  },
];

const technologies = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Tailwind CSS",
  "REST APIs",
  "Git & GitHub",
  "Databases",
  "Express.js",
  "System Design",
];

export function Landing() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageWithFallback
              src={logoImage}
              alt="R-Learn"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="mb-4">
            <ImageWithFallback
              src={logoImage}
              alt="R-Learn"
              className="h-20 w-auto mx-auto"
            />
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Master Developer Skills with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              R-Learn
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your internal company platform for upskilling in frontend, backend, and system design
            through documentation-first learning, coding challenges, and expert mentorship.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">14</div>
              <div className="text-sm text-muted-foreground mt-1">Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground mt-1">Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground mt-1">Employees</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-muted-foreground">
              Comprehensive features designed for effective learning
            </p>
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

      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Technologies You'll Master</h2>
          <p className="text-muted-foreground">
            Learn the most in-demand technologies for modern development
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {technologies.map((tech) => (
            <div
              key={tech}
              className="px-6 py-3 bg-accent rounded-full border border-border hover:bg-accent/80 transition-colors"
            >
              <span className="font-medium">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join your colleagues in mastering the skills needed for modern web development.
            Request access today!
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Request Access
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <ImageWithFallback
              src={logoImage}
              alt="R-Learn"
              className="h-8 w-auto"
            />
            <p className="text-sm text-muted-foreground">
              © 2026 R-Learn. Internal Developer Learning Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
