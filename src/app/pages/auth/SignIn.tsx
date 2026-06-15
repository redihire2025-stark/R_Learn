import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../hooks/useAuth";
import { Loader2, Mail, Lock } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import logoImage from "../../../imports/R-Learn.png";

const ADMIN_EMAIL = "itsupport@redihire.com";

export function SignIn() {
  const navigate = useNavigate();
  const { sendOTP, signInWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = email.trim().toLowerCase() === ADMIN_EMAIL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const trimmedEmail = email.trim().toLowerCase();

      if (isAdmin) {
        // Admin uses password-based login
        await signInWithPassword(trimmedEmail, password);
        navigate("/dashboard");
      } else {
        // Regular users get OTP via Web3Forms
        await sendOTP(trimmedEmail);
        navigate("/verify-otp", { state: { email: trimmedEmail, redirectTo: "/dashboard" } });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12">
        <div className="max-w-md text-center space-y-6">
          <ImageWithFallback src={logoImage} alt="R-Learn" className="h-20 w-auto mx-auto" />
          <h2 className="text-3xl font-bold">Welcome back to R-Learn</h2>
          <p className="text-muted-foreground text-lg">
            Your internal developer upskilling platform. Sign in with your{" "}
            <span className="text-primary font-medium">@redihire.com</span> email.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">8+</div>
              <div className="text-xs text-muted-foreground">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">8+</div>
              <div className="text-xs text-muted-foreground">Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5+</div>
              <div className="text-xs text-muted-foreground">Quizzes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">Sign in to R-Learn</h1>
            <p className="text-muted-foreground mt-2">
              {isAdmin
                ? "Welcome, Admin. Enter your password to continue."
                : "Enter your @redihire.com email — we'll send a one-time code."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Company Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@redihire.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password field — only shown for admin */}
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    autoFocus
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isAdmin ? "Signing in..." : "Sending code..."}
                </>
              ) : (
                isAdmin ? "Sign In" : "Send Verification Code"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Request access
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
