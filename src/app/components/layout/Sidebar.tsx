import { cn } from "../../lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Code,
  Trophy,
  Award,
  BarChart3,
  User,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import logoImage from "../../../imports/R-Learn.png";

const employeeNavItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: Code, label: "Challenges", path: "/challenges" },
  { icon: HelpCircle, label: "Quizzes", path: "/quizzes" },
  { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
  { icon: Award, label: "Certifications", path: "/certifications" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: User, label: "Profile", path: "/profile" },
];

const mentorNavItems = [
  { icon: Home, label: "Dashboard", path: "/mentor" },
  { icon: Users, label: "Students", path: "/mentor/students" },
  { icon: Code, label: "Assignments", path: "/mentor/assignments" },
  { icon: BarChart3, label: "Analytics", path: "/mentor/analytics" },
];

const adminNavItems = [
  { icon: Home, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: BookOpen, label: "Courses", path: "/admin/courses" },
  { icon: Code, label: "Challenges", path: "/admin/challenges" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems =
    user?.role === "admin"
      ? adminNavItems
      : user?.role === "mentor"
      ? mentorNavItems
      : employeeNavItems;

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <ImageWithFallback
          src={logoImage}
          alt="R-Learn"
          className="h-10 w-auto mb-1"
        />
        <p className="text-xs text-muted-foreground">Developer Platform</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");

          return (
            <Link key={item.path} to={item.path}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="mb-3 p-3 bg-accent rounded-lg">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              {user?.xp} XP
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-orange-500" />
              {user?.streak} day streak
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full justify-start gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
