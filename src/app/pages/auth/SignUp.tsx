import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { useAuth } from "../../hooks/useAuth";
import { Loader2, Mail, User, Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import logoImage from "../../../imports/R-Learn.png";

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Data Science",
  "DevOps",
  "QA",
  "Marketing",
  "HR",
];

export function SignUp() {
  const navigate = useNavigate();
  const { sendOTP } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.department) { setError("Please select your department."); return; }
    if (!acceptTerms) { setError("Please accept the terms and conditions."); return; }

    setLoading(true);
    setError("");
    try {
      const email = formData.email.trim().toLowerCase();
      await sendOTP(email, { name: formData.name.trim(), department: formData.department });
      navigate("/verify-otp", {
        state: { email, redirectTo: "/pending-approval" },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof formData) => (v: string) =>
    setFormData((f) => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12">
        <div className="max-w-md text-center space-y-6">
          <ImageWithFallback src={logoImage} alt="R-Learn" className="h-20 w-auto mx-auto" />
          <h2 className="text-3xl font-bold">Join R-Learn Today</h2>
          <p className="text-muted-foreground text-lg">
            Start your developer journey. Your account will be reviewed and activated by an admin.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-primary mb-1">Domain Restricted</p>
            <p className="text-xs text-muted-foreground">
              Only <strong>@redihire.com</strong> email addresses are accepted. Sign up with your
              company email to request access.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="text-muted-foreground mt-2">
              Join the internal developer learning platform. Requires <strong>@redihire.com</strong> email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => set("name")(e.target.value)}
                  className="pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Company Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@redihire.com"
                  value={formData.email}
                  onChange={(e) => set("email")(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Select value={formData.department} onValueChange={set("department")}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(c) => setAcceptTerms(c as boolean)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                I agree to the platform terms and conditions
              </Label>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending code...</>
              ) : (
                "Request Access"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
