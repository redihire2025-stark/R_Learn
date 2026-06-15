import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL  = process.env.BREVO_SENDER_EMAIL;
const SENDER_NAME   = process.env.BREVO_SENDER_NAME || "R-Learn Platform";
const ADMIN_EMAIL   = process.env.ADMIN_EMAIL;

async function sendBrevoEmail(to_email, to_name, subject, htmlContent) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to_email, name: to_name || to_email }],
      subject,
      htmlContent,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
}

/* ─── Shared layout helpers ─────────────────────────── */

const LOGO_SVG = `
<table cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="vertical-align:middle;padding-right:10px">
      <div style="width:42px;height:42px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.3)">
        <span style="font-size:22px;font-weight:900;color:#1e40af;line-height:1">R</span>
      </div>
    </td>
    <td style="vertical-align:middle">
      <span style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px">R-Learn</span><br>
      <span style="font-size:11px;color:rgba(255,255,255,0.75);letter-spacing:1.5px;text-transform:uppercase">by RediHire</span>
    </td>
  </tr>
</table>`;

function header(bgColor = "#1e40af") {
  return `
  <tr>
    <td style="background:linear-gradient(135deg,${bgColor} 0%,${bgColor}dd 100%);padding:28px 40px;border-radius:12px 12px 0 0">
      ${LOGO_SVG}
    </td>
  </tr>`;
}

function footer() {
  return `
  <tr>
    <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;text-align:center">
      <p style="margin:0 0 6px;font-size:13px;color:#64748b">R-Learn · RediHire Global Services Private Limited</p>
      <p style="margin:0;font-size:12px;color:#94a3b8">
        Questions? Contact us at
        <a href="mailto:itsupport@redihire.com" style="color:#1e40af;text-decoration:none">itsupport@redihire.com</a>
      </p>
    </td>
  </tr>`;
}

function wrapper(rows) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;padding:40px 16px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background:#ffffff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        ${rows}
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/* ─── Email 1: Pending Approval (to user) ───────────── */

function pendingTemplate(name, email, department) {
  return wrapper(`
    ${header("#1e40af")}
    <tr><td style="padding:36px 40px 20px">
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0f172a">Hi ${name}! 👋</h1>
      <p style="margin:0;font-size:15px;color:#475569;line-height:1.6">
        Welcome to <strong>R-Learn</strong> — RediHire's developer upskilling platform.
        Your account has been created and is now <strong>pending admin approval</strong>.
      </p>
    </td></tr>

    <tr><td style="padding:0 40px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fef9c3;border:1px solid #fde047;border-radius:10px;margin:4px 0">
        <tr><td style="padding:16px 20px">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-size:22px;padding-right:12px">⏳</td>
              <td>
                <p style="margin:0 0 2px;font-weight:700;color:#854d0e;font-size:14px">Awaiting Approval</p>
                <p style="margin:0;color:#a16207;font-size:13px">Our admin team will review your request and approve your account shortly.</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:20px 40px">
      <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.8px">Your Registration Details</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:14px">
        <tr style="background:#f8fafc">
          <td style="padding:12px 16px;color:#64748b;width:120px;font-weight:500">Full Name</td>
          <td style="padding:12px 16px;color:#0f172a;font-weight:600">${name}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;color:#64748b;font-weight:500">Email</td>
          <td style="padding:12px 16px;color:#0f172a;font-weight:600">${email}</td>
        </tr>
        <tr style="background:#f8fafc">
          <td style="padding:12px 16px;color:#64748b;font-weight:500">Department</td>
          <td style="padding:12px 16px;color:#0f172a;font-weight:600">${department}</td>
        </tr>
      </table>
    </td></tr>

    <tr><td style="padding:0 40px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eff6ff;border-radius:10px;border:1px solid #bfdbfe">
        <tr><td style="padding:16px 20px">
          <p style="margin:0 0 10px;font-weight:700;color:#1e40af;font-size:14px">🚀 What's waiting for you on R-Learn</p>
          <table cellpadding="0" cellspacing="0" border="0" style="font-size:13px;color:#1e3a8a">
            <tr><td style="padding:3px 0">📚 &nbsp;14 Technology Learning Tracks</td></tr>
            <tr><td style="padding:3px 0">💻 &nbsp;Coding Challenges &amp; Quizzes</td></tr>
            <tr><td style="padding:3px 0">🏆 &nbsp;XP System, Streaks &amp; Leaderboard</td></tr>
            <tr><td style="padding:3px 0">🎓 &nbsp;Certifications &amp; Expert Mentorship</td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:24px 40px 32px">
      <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center">
        Approval typically takes <strong style="color:#475569">1–2 business days</strong>.
        You'll receive an email once your account is approved.
      </p>
    </td></tr>
    ${footer()}
  `);
}

/* ─── Email 2: Admin Notification ───────────────────── */

function adminTemplate(name, email, department, approveUrl) {
  return wrapper(`
    ${header("#0f172a")}
    <tr><td style="padding:28px 40px 12px">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background:#dc2626;color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:4px;letter-spacing:1px;text-transform:uppercase">
            Action Required
          </td>
        </tr>
      </table>
      <h1 style="margin:12px 0 6px;font-size:22px;font-weight:700;color:#0f172a">New Registration Awaiting Approval</h1>
      <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6">
        A new employee has signed up on <strong>R-Learn</strong> and is waiting for your approval to access the platform.
      </p>
    </td></tr>

    <tr><td style="padding:16px 40px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;font-size:14px">
        <tr style="background:#0f172a">
          <td colspan="2" style="padding:12px 16px;color:#94a3b8;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase">Employee Details</td>
        </tr>
        <tr style="background:#f8fafc">
          <td style="padding:13px 16px;color:#64748b;width:130px;font-weight:500">Full Name</td>
          <td style="padding:13px 16px;color:#0f172a;font-weight:700">${name}</td>
        </tr>
        <tr>
          <td style="padding:13px 16px;color:#64748b;font-weight:500">Email</td>
          <td style="padding:13px 16px;color:#1e40af;font-weight:600">${email}</td>
        </tr>
        <tr style="background:#f8fafc">
          <td style="padding:13px 16px;color:#64748b;font-weight:500">Department</td>
          <td style="padding:13px 16px;color:#0f172a;font-weight:600">${department}</td>
        </tr>
      </table>
    </td></tr>

    <tr><td style="padding:16px 40px 32px;text-align:center">
      <a href="${approveUrl}" style="display:inline-block;background:linear-gradient(135deg,#1e40af,#1d4ed8);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:15px;letter-spacing:0.3px">
        Review &amp; Approve in Dashboard →
      </a>
      <p style="margin:14px 0 0;font-size:12px;color:#94a3b8">Or visit: <a href="${approveUrl}" style="color:#1e40af">${approveUrl}</a></p>
    </td></tr>
    ${footer()}
  `);
}

/* ─── Email 3: Account Approved (to user) ───────────── */

function approvedTemplate(name, loginUrl) {
  return wrapper(`
    ${header("#15803d")}
    <tr><td style="padding:32px 40px 16px;text-align:center">
      <div style="display:inline-block;background:#dcfce7;border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;text-align:center">✅</div>
      <h1 style="margin:16px 0 6px;font-size:26px;font-weight:800;color:#0f172a">You're Approved!</h1>
      <p style="margin:0;font-size:15px;color:#475569">Welcome to the R-Learn community, <strong>${name}</strong>!</p>
    </td></tr>

    <tr><td style="padding:8px 40px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px">
        <tr><td style="padding:20px 24px">
          <p style="margin:0 0 14px;font-weight:700;color:#15803d;font-size:14px">🎉 Your account is now fully active. Here's what you can explore:</p>
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="50%" style="padding:6px 8px;font-size:13px;color:#166534">📚 14 Technology Tracks</td>
              <td width="50%" style="padding:6px 8px;font-size:13px;color:#166534">💻 Coding Challenges</td>
            </tr>
            <tr>
              <td style="padding:6px 8px;font-size:13px;color:#166534">🧠 Skill Quizzes</td>
              <td style="padding:6px 8px;font-size:13px;color:#166534">🏆 XP &amp; Leaderboard</td>
            </tr>
            <tr>
              <td style="padding:6px 8px;font-size:13px;color:#166534">🔥 Daily Streaks</td>
              <td style="padding:6px 8px;font-size:13px;color:#166534">🎓 Certifications</td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:24px 40px;text-align:center">
      <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#15803d,#16a34a);color:#ffffff;text-decoration:none;padding:15px 48px;border-radius:8px;font-weight:700;font-size:16px;letter-spacing:0.3px">
        Start Learning Now →
      </a>
    </td></tr>

    <tr><td style="padding:0 40px 28px;text-align:center">
      <p style="margin:0;font-size:13px;color:#94a3b8">
        Sign in at <a href="${loginUrl}" style="color:#15803d;font-weight:600">${loginUrl}</a>
      </p>
    </td></tr>
    ${footer()}
  `);
}

/* ─── Routes ─────────────────────────────────────────── */

app.post("/api/notify-admin", async (req, res) => {
  const { name, email, department } = req.body;
  const approveUrl = (req.headers.origin || "http://localhost:5174") + "/admin/users";
  try {
    await sendBrevoEmail(ADMIN_EMAIL, "R-Learn Admin",
      `Action Required: New Registration — ${name}`,
      adminTemplate(name, email, department, approveUrl)
    );
    res.json({ success: true });
  } catch (err) {
    console.error("notify-admin error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/send-pending", async (req, res) => {
  const { name, email, department } = req.body;
  try {
    await sendBrevoEmail(email, name,
      "Welcome to R-Learn — Your Account is Pending Approval",
      pendingTemplate(name, email, department)
    );
    res.json({ success: true });
  } catch (err) {
    console.error("send-pending error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/send-approval", async (req, res) => {
  const { name, email } = req.body;
  console.log(`[send-approval] name=${name} email=${email}`);
  const loginUrl = (req.headers.origin || "http://localhost:5174") + "/signin";
  try {
    await sendBrevoEmail(email, name,
      "🎉 Congratulations — You're Onboarded on R-Learn!",
      approvedTemplate(name, loginUrl)
    );
    res.json({ success: true });
  } catch (err) {
    console.error("send-approval error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.EMAIL_SERVER_PORT || 3001;
app.listen(PORT, () => console.log(`R-Learn email server running on port ${PORT}`));
