const SERVER = import.meta.env.VITE_EMAIL_SERVER_URL || "http://localhost:3001";

async function post(endpoint: string, body: object) {
  try {
    const res = await fetch(`${SERVER}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) console.warn(`${endpoint} failed:`, await res.text());
  } catch {
    console.warn(`${endpoint} unreachable`);
  }
}

// Called on signup — sends pending email to user
export async function sendPendingApprovalEmail(data: { name: string; email: string; department: string }) {
  await post("/api/send-pending", data);
}

// Called on signup — notifies admin
export async function notifyAdminNewRegistration(data: { name: string; email: string; department: string }) {
  await post("/api/notify-admin", data);
}

// Called when admin approves — sends congrats to user
export async function sendApprovalEmail(data: { name: string; email: string }) {
  await post("/api/send-approval", data);
}
