import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Mail, Info } from "lucide-react";

export function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-background">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10">
          <Mail className="w-10 h-10 text-blue-500" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold">No Password Needed</h1>
          <p className="text-muted-foreground">
            R-Learn uses passwordless authentication. Simply enter your{" "}
            <strong>@redihire.com</strong> email and you'll receive a 6-digit OTP code to sign in.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 text-left space-y-2">
          <div className="flex items-start gap-3 text-sm">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              Every sign-in sends a fresh one-time code to your email — no password to remember or reset.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link to="/signin">
            <Button className="w-full">Go to Sign In</Button>
          </Link>
          <Link to="/signin">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
