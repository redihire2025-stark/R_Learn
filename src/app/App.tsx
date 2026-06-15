import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { useAuth } from "./hooks/useAuth";

import { Landing } from "./pages/Landing";
import { SignIn } from "./pages/auth/SignIn";
import { SignUp } from "./pages/auth/SignUp";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { PendingApproval } from "./pages/auth/PendingApproval";
import { VerifyOTP } from "./pages/auth/VerifyOTP";

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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/signin" replace />;
  if (!user.isApproved) return <Navigate to="/pending-approval" replace />;
  return <>{children}</>;
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
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
          {/* Public */}
          <Route path="/" element={<AuthLayout><Landing /></AuthLayout>} />
          <Route path="/signin" element={<AuthLayout><SignIn /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
          <Route path="/verify-otp" element={<AuthLayout><VerifyOTP /></AuthLayout>} />
          <Route path="/pending-approval" element={<AuthLayout><PendingApproval /></AuthLayout>} />

          {/* Protected — Employee */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><EmployeeDashboard /></AppLayout></ProtectedRoute>} />
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

          {/* Protected — Admin */}
          <Route path="/admin" element={<ProtectedRoute><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
