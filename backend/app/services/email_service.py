import json
import os
import threading
import urllib.request


def _send_brevo_worker(to_email: str, subject: str, html_body: str):
  """Sends live email to ANY recipient in the world using Brevo HTTPS REST API."""
  api_key = os.getenv("BREVO_API_KEY") or ""

  if not api_key:
    print(
        f"[Email Service] BREVO_API_KEY not configured. Simulated email to:"
        f" {to_email}"
    )
    return

  try:
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "api-key": api_key,
        "Content-Type": "application/json",
        "accept": "application/json",
    }
    payload = {
        "sender": {
            "name": "ACET IT Helpdesk",
            "email": "ganeshaddanki06@gmail.com",
        },
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_body,
    }

    req = urllib.request.Request(
        url, data=json.dumps(payload).encode("utf-8"), headers=headers
    )
    with urllib.request.urlopen(req, timeout=12) as response:
      resp_data = response.read().decode("utf-8")
      print(f"[SUCCESS] EMAIL DELIVERED TO ANY RECIPIENT: {resp_data}")
  except Exception as e:
    print(f"[Email Service Warning] Brevo delivery failed: {e}")


def send_ticket_created_notification(to_email: str, ticket_data: dict):
  if not to_email:
    return

  ticket_id = ticket_data.get("ticket_id", "TICKET")
  issue_title = ticket_data.get("issue_title", "IT Incident")
  requester = ticket_data.get("requester_name", "Faculty / Student")
  location = ticket_data.get("location", "Campus")
  category = ticket_data.get("category", "Hardware/Lab")
  priority = ticket_data.get("priority", "Medium")

  subject = f"[{ticket_id}] Problem Raised: {issue_title}"
  html_body = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 20px; color: #334155;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
        <div style="background: linear-gradient(135deg, #0b1329 0%, #1e293b 100%); color: #ffffff; padding: 22px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">ACET IT Helpdesk Notification</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">Aditya College of Engineering and Technology</p>
        </div>
        <div style="padding: 24px; line-height: 1.6;">
          <p style="font-size: 15px; margin-top: 0;">Hello <strong>{requester}</strong>,</p>
          <p style="color: #475569;">A technical incident has been logged and registered in the IT Helpdesk portal:</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Ticket ID:</strong> <span style="color: #2563eb; font-weight: bold;">{ticket_id}</span></p>
            <p style="margin: 4px 0;"><strong>Issue Summary:</strong> {issue_title}</p>
            <p style="margin: 4px 0;"><strong>Location:</strong> {location}</p>
            <p style="margin: 4px 0;"><strong>Category:</strong> {category}</p>
            <p style="margin: 4px 0;"><strong>Priority:</strong> <span style="color: #dc2626; font-weight: bold;">{priority}</span></p>
            <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #2563eb; font-weight: bold;">Open (Assigned for Diagnosis)</span></p>
          </div>

          <p style="font-size: 13px; color: #64748b;">The IT support team has been informed and will attend to the problem shortly.</p>
          <div style="text-align: center; margin-top: 25px;">
            <a href="https://it-helpdesk-system-2m9r.vercel.app/tickets/{ticket_id}" style="background: #2563eb; color: #ffffff; padding: 10px 22px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">View Ticket Online</a>
          </div>
        </div>
      </div>
    </body>
    </html>
    """

  worker = threading.Thread(
      target=_send_brevo_worker, args=(to_email, subject, html_body)
  )
  worker.daemon = True
  worker.start()