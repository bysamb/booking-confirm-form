export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { emails, email, quote } = req.body || {};
  const emailList = emails || (email ? [email] : []);
  if (emailList.length === 0 || !quote) {
    return res.status(400).json({ error: "email(s) and quote are required" });
  }

  const webhookUrl =
    process.env.N8N_CONFIRM_WEBHOOK ||
    "https://n8n.srv1361720.hstgr.cloud/webhook/quote-booking-form";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails: emailList, quote }),
    });
    if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
    res.status(200).json({ success: true });
  } catch (e) {
    console.error("N8N webhook error:", e);
    res.status(502).json({ error: "Failed to process booking confirmation" });
  }
}
