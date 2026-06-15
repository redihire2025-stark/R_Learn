import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Clock, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function PendingApproval() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-background">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/10">
          <Clock className="w-12 h-12 text-amber-500" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Account Pending Approval</h1>
          <p className="text-muted-foreground text-lg">
            Your account has been successfully created and is awaiting admin approval.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 text-left space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Account Created</p>
              <p className="text-sm text-muted-foreground">Your profile has been set up</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium">Admin Notified</p>
              <p className="text-sm text-muted-foreground">
                Our admin team has been notified and will review your request shortly
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium">Awaiting Approval</p>
              <p className="text-sm text-muted-foreground">
                You'll receive an email once your account is approved
              </p>
            </div>
          </div>
        </div>

        {user && (
          <div className="bg-accent rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Registered as</p>
            <p className="font-medium">{user.email}</p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Approval typically takes 1-2 business days. You'll be able to access the platform once
            an admin approves your account.
          </p>

          <Button variant="outline" onClick={logout} className="w-full">
            Back to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
