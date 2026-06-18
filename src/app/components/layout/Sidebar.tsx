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

  const isCollapsedPage = 
    (location.pathname.startsWith("/courses/") && location.pathname !== "/courses") ||
    (location.pathname.startsWith("/challenges/") && location.pathname !== "/challenges");

  const navItems =
    user?.role === "admin"
      ? adminNavItems
      : user?.role === "mentor"
        ? mentorNavItems
        : employeeNavItems;

  const initials = (name: string) => name ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "U";

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out z-50",
        isCollapsedPage
          ? "w-16 hover:w-64 absolute left-0 top-0 shadow-lg hover:shadow-2xl group"
          : "w-64"
      )}
    >
      <div className={cn("p-6 border-b border-border transition-all duration-300", isCollapsedPage && "px-2 py-4 group-hover:p-6")}>
        <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsedPage && "justify-center group-hover:justify-start")}>
          <ImageWithFallback
            src={logoImage}
            alt="R-Learn"
            className={cn("h-10 w-auto mb-1 transition-all flex-shrink-0", isCollapsedPage && "h-8 w-8 group-hover:h-10 group-hover:w-auto")}
          />
          {!isCollapsedPage && (
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground whitespace-nowrap">Developer Platform</p>
            </div>
          )}
          {isCollapsedPage && (
            <div className="min-w-0 hidden group-hover:block transition-all duration-300">
              <p className="text-xs text-muted-foreground whitespace-nowrap">Developer Platform</p>
            </div>
          )}
        </div>
      </div>

      <nav className={cn("flex-1 p-4 space-y-1 overflow-y-auto transition-all", isCollapsedPage && "p-2 group-hover:p-4")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");

          return (
            <Link key={item.path} to={item.path} className="block w-full">
              <div
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg transition-all overflow-hidden",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsedPage
                    ? "gap-0 group-hover:gap-3 justify-center px-0 group-hover:justify-start group-hover:px-3"
                    : "gap-3"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={cn(
                  "text-sm font-medium transition-all duration-300 whitespace-nowrap",
                  isCollapsedPage ? "w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100" : "w-auto opacity-100"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className={cn("p-4 border-t border-border transition-all", isCollapsedPage && "p-2 group-hover:p-4")}>
        <div className={cn("mb-3 p-3 bg-accent rounded-lg transition-all overflow-hidden", isCollapsedPage && "p-2 group-hover:p-3")}>
          {isCollapsedPage && (
            <div className="group-hover:hidden flex justify-center py-1">
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center font-bold">
                {user?.name ? initials(user.name) : "U"}
              </div>
            </div>
          )}
          <div className={cn("flex flex-col gap-1", isCollapsedPage && "hidden group-hover:flex")}>
            <p className="text-sm font-medium truncate">{user?.name}</p>
            {(!isCollapsedPage || (isCollapsedPage && true)) && (
              <p className={cn("text-xs text-muted-foreground truncate", isCollapsedPage && "hidden group-hover:block")}>
                {user?.email}
              </p>
            )}

            {user?.role === "admin" ? (
              <div className={cn("mt-2", isCollapsedPage && "hidden group-hover:block")}>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-medium whitespace-nowrap">Administrator</span>
              </div>
            ) : (
              <div className={cn("flex flex-col gap-1 mt-2 text-xs", isCollapsedPage && "hidden group-hover:flex")}>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                  {user?.xp} XP
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Award className="w-3.5 h-3.5 text-orange-500" />
                  {user?.streak} day streak
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className={cn(
            "w-full justify-start gap-2 overflow-hidden transition-all",
            isCollapsedPage && "justify-center group-hover:justify-start px-0 group-hover:px-3"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className={cn(
            "transition-all duration-300 whitespace-nowrap",
            isCollapsedPage ? "w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100" : "w-auto opacity-100"
          )}>
            Logout
          </span>
        </Button>
      </div>
    </aside>
  );
}
