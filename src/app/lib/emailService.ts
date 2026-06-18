// EmailJS REST API — no server needed, works directly from the browser.
// Free plan: 200 emails/month, 2 templates active.
// Templates in use:
//   VITE_EMAILJS_TEMPLATE_ADMIN    → new registration alert to admin
//   VITE_EMAILJS_TEMPLATE_APPROVED → account approved notification to user

const SERVICE_ID   = import.meta.env.VITE_EMAILJS_SERVICE_ID        ?? "";
const PUBLIC_KEY   = import.meta.env.VITE_EMAILJS_PUBLIC_KEY        ?? "";
const T_ADMIN      = import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN    ?? "";
const T_APPROVED   = import.meta.env.VITE_EMAILJS_TEMPLATE_APPROVED ?? "";
const ADMIN_EMAIL  = import.meta.env.VITE_ADMIN_EMAIL               ?? "itsupport@redihire.com";
// Use deployed URL for email links — falls back to current origin in dev
const APP_URL      = import.meta.env.VITE_APP_URL || window.location.origin;

async function send(templateId: string, params: Record<string, string>): Promise<boolean> {
  if (!SERVICE_ID || !PUBLIC_KEY || !templateId) {
    console.error("[email] EmailJS not configured — missing VITE_EMAILJS_* env vars");
    return false;
  }
  console.log("[email] Sending via EmailJS →", templateId, params);
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id:      SERVICE_ID,
        template_id:     templateId,
        user_id:         PUBLIC_KEY,
        template_params: params,
      }),
    });
    const body = await res.text();
    if (!res.ok) {
      console.error(`[email] EmailJS error ${res.status}:`, body);
      return false;
    }
    console.log("[email] EmailJS success:", body);
    return true;
  } catch (err) {
    console.error("[email] EmailJS network error:", err);
    return false;
  }
}

// ── Pending approval email skipped (free plan allows 2 templates only) ───────
export async function sendPendingApprovalEmail(_data: {
  name: string;
  email: string;
  department: string;
}) {
  // User sees the /pending-approval page immediately after signup — no email needed.
}

// ── Called on signup: alert admin to review & approve ────────────────────────
// EmailJS admin template variables expected:
//   {{to_email}}    → recipient (admin email)
//   {{user_name}}   → new user's full name
//   {{user_email}}  → new user's email
//   {{department}}  → new user's department
//   {{approve_url}} → link to /admin/users
export async function notifyAdminNewRegistration(data: {
  name: string;
  email: string;
  department: string;
}) {
  await send(T_ADMIN, {
    to_email:    ADMIN_EMAIL,
    user_name:   data.name,
    user_email:  data.email,
    department:  data.department,
    approve_url: `${APP_URL}/admin/users`,
  });
}

// ── Called when admin approves a user ────────────────────────────────────────
// EmailJS approved template variables expected:
//   {{to_name}}   → approved user's name
//   {{to_email}}  → approved user's email (recipient)
//   {{login_url}} → link to /signin
export async function sendApprovalEmail(data: { name: string; email: string }) {
  await send(T_APPROVED, {
    to_name:   data.name,
    to_email:  data.email,
    login_url: `${APP_URL}/signin`,
  });
}
