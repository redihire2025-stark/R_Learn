import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../components/ui/input-otp";
import { useAuth } from "../../hooks/useAuth";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import logoImage from "../../../imports/R-Learn.png";

export function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, sendOTP, pendingEmail } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const email = pendingEmail ?? (location.state as { email?: string })?.email ?? "";
  const redirectTo = (location.state as { redirectTo?: string })?.redirectTo ?? "/dashboard";

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const { needsApproval } = await verifyOTP(email, otp);
      navigate(needsApproval ? "/pending-approval" : redirectTo, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code. Please try again.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await sendOTP(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    navigate("/signin", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <ImageWithFallback src={logoImage} alt="R-Learn" className="h-12 w-auto mx-auto" />

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto">
          <Mail className="w-10 h-10 text-primary" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground mt-3">
            We sent a 6-digit verification code to
          </p>
          <p className="font-semibold text-foreground mt-1">{email}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
              {error}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={otp.length !== 6 || loading}
            size="lg"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Verify & Sign In
          </Button>

          <div className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              {resending && <RefreshCw className="w-3 h-3 animate-spin" />}
              {resending ? "Sending..." : "Resend code"}
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Code expires in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
