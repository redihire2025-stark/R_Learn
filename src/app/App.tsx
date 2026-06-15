import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { useAuth } from "./hooks/useAuth";

import { Landing } from "./pages/Landing";
import { SignIn } from "./pages/auth/SignIn";
import { SignUp } from "./pages/auth/SignUp";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { PendingApproval } from "./pages/auth/PendingApproval";

import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";

import { EmployeeDashboard } from "./pages/dashboard/EmployeeDashboard";
import { CourseExplorer } from "./pages/courses/CourseExplorer";
import { CourseDetail } from "./pages/courses/CourseDetail";
import { ChallengesExplorer } from "./pages/challenges/ChallengesExplorer";
import { ChallengeDetail } from "./pages/challenges/ChallengeDetail";
import { QuizExplorer } from "./pages/quizzes/QuizExplorer";
import { QuizDetail } from "./pages/quizzes/QuizDetail";
import { Leaderboard } from "./pages/Leaderboard";
import { Analytics } from "./pages/Analytics";
import { Certifications } from "./pages/Certifications";
import { Profile } from "./pages/Profile";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminCourses } from "./pages/admin/AdminCourses";
import { AdminChallenges } from "./pages/admin/AdminChallenges";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";
import { AdminSettings } from "./pages/admin/AdminSettings";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (!user) return <Navigate to="/signin" replace />;
  if (!user.isApproved) return <Navigate to="/pending-approval" replace />;
  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  return <>{children}</>;
}

function AdminRedirect({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pending-approval" element={<PendingApproval />} />

          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><AdminRedirect><EmployeeDashboard /></AdminRedirect></AppLayout></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><AppLayout><CourseExplorer /></AppLayout></ProtectedRoute>} />
          <Route path="/courses/:courseId" element={<ProtectedRoute><AppLayout><CourseDetail /></AppLayout></ProtectedRoute>} />
          <Route path="/challenges" element={<ProtectedRoute><AppLayout><ChallengesExplorer /></AppLayout></ProtectedRoute>} />
          <Route path="/challenges/:challengeId" element={<ProtectedRoute><AppLayout><ChallengeDetail /></AppLayout></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><AppLayout><QuizExplorer /></AppLayout></ProtectedRoute>} />
          <Route path="/quizzes/:quizId" element={<ProtectedRoute><AppLayout><QuizDetail /></AppLayout></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><AppLayout><Leaderboard /></AppLayout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
          <Route path="/certifications" element={<ProtectedRoute><AppLayout><Certifications /></AppLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AppLayout><AdminUsers /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute><AppLayout><AdminCourses /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/challenges" element={<ProtectedRoute><AppLayout><AdminChallenges /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><AppLayout><AdminAnalytics /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AppLayout><AdminSettings /></AppLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
