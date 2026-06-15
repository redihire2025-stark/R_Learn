import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../hooks/useAuth";
import { Loader2, BookOpen, Code, Trophy, Users } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import logoImage from "../../../imports/R-Learn.png";

export function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      const loggedIn = useAuth.getState().user;
      navigate(loggedIn?.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (msg === "PENDING_APPROVAL") {
        navigate("/pending-approval");
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left branding panel */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12">
        <div className="max-w-md text-center space-y-6">
          <ImageWithFallback src={logoImage} alt="R-Learn" className="h-20 w-auto mx-auto" />
          <h2 className="text-3xl font-bold">Welcome to R-Learn</h2>
          <p className="text-muted-foreground text-lg">
            RediHire's internal developer upskilling platform. Master 14 technologies through hands-on learning.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2 text-left">
            {[
              { icon: BookOpen, label: "14 Technology Tracks", color: "text-blue-500" },
              { icon: Code, label: "15 Coding Challenges", color: "text-green-500" },
              { icon: Trophy, label: "XP & Leaderboards", color: "text-yellow-500" },
              { icon: Users, label: "Expert Mentorship", color: "text-purple-500" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border border-border">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            🔒 Restricted to <strong>@redihire.com</strong> email addresses only
          </p>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">Sign in to R-Learn</h1>
            <p className="text-muted-foreground mt-2">
              Use your <strong>@redihire.com</strong> email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
            <div className="space-y-2">
              <Label htmlFor="email">Company Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@redihire.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
