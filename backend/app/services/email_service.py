import json
import os
import threading
import urllib.request
import urllib.error


def _send_emailjs_worker(to_email: str, ticket_data: dict):
  """Delivers live email styled with ACET institutional HTML card directly to recipient."""
  service_id = (
      os.getenv("EMAILJS_SERVICE_ID") or "service_mfchigg"
  ).strip()
  template_id = (
      os.getenv("EMAILJS_TEMPLATE_ID") or "template_x3nc6xw"
  ).strip()
  public_key = (
      os.getenv("EMAILJS_PUBLIC_KEY") or "UdBMHRKJKbUDStLfX"
  ).strip()
  resend_key = (os.getenv("RESEND_API_KEY") or "").strip().strip("'\"")

  ticket_id = ticket_data.get("ticket_id", "TICKET")
  issue_title = ticket_data.get("issue_title", "IT Incident")
  requester = ticket_data.get("requester_name", "Student / Faculty")
  location = ticket_data.get("location", "Campus")
  category = ticket_data.get("category", "General")
  priority = ticket_data.get("priority", "Medium")
  ticket_url = f"https://it-helpdesk-system-2m9r.vercel.app/tickets/{ticket_id}"

  # 1. Primary Delivery: EmailJS (Sends directly to recipient via your connected Gmail)
  try:
    url = "https://api.emailjs.com/api/v1.0/email/send"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "ACET-IT-Helpdesk/1.0",
    }
    payload = {
        "service_id": service_id,
        "template_id": template_id,
        "user_id": public_key,
        "template_params": {
            "to_email": to_email,
            "ticket_id": ticket_id,
            "issue_title": issue_title,
            "requester_name": requester,
            "location": location,
            "category": category,
            "priority": priority,
            "ticket_url": ticket_url,
        },
    }
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode("utf-8"), headers=headers
    )
    with urllib.request.urlopen(req, timeout=15) as response:
      print(
          f"[SUCCESS] EMAILJS DELIVERED DIRECTLY TO {to_email}:"
          f" {response.status}",
          flush=True,
      )
      return
  except Exception as e:
    print(f"[Email Warning] EmailJS failed: {e}. Trying Resend fallback...", flush=True)

  # 2. Backup Delivery: Resend
  if resend_key:
    try:
      url = "https://api.resend.com/emails"
      headers = {
          "Authorization": f"Bearer {resend_key}",
          "Content-Type": "application/json",
          "User-Agent": "ACET-IT-Helpdesk/1.0",
      }
      payload = {
          "from": "ACET IT Helpdesk <onboarding@resend.dev>",
          "to": ["ganeshaddanki06@gmail.com"],
          "subject": f"[For: {to_email}] [{ticket_id}] Problem Raised: {issue_title}",
          "html": f"""
                <div style="font-family: Arial, sans-serif; background: #0f172a; padding: 20px;">
                  <div style="max-width: 550px; margin: 0 auto; background: #fff; border-radius: 10px; padding: 20px;">
                    <h3 style="color: #2563eb; margin: 0;">ACET IT Helpdesk: {ticket_id}</h3>
                    <p><strong>Issue:</strong> {issue_title}</p>
                    <p><strong>Location:</strong> {location}</p>
                    <p><strong>Recipient:</strong> {to_email}</p>
                    <a href="{ticket_url}" style="background: #2563eb; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Ticket Online</a>
                  </div>
                </div>
                """,
      }
      req = urllib.request.Request(
          url, data=json.dumps(payload).encode("utf-8"), headers=headers
      )
      with urllib.request.urlopen(req, timeout=15) as response:
        print(f"[SUCCESS] RESEND BACKUP DELIVERED", flush=True)
    except Exception as re_err:
      print(f"[Email Error] Resend fallback failed: {re_err}", flush=True)


def send_ticket_created_notification(to_email: str, ticket_data: dict):
  if not to_email:
    return
  worker = threading.Thread(
      target=_send_emailjs_worker, args=(to_email, ticket_data)
  )
  worker.daemon = True
  worker.start()


def send_password_reset_email(to_email: str, username: str, temp_pass: str):
  if not to_email:
    return
  reset_data = {
      "ticket_id": "RESET",
      "issue_title": f"Temporary Password: {temp_pass}",
      "requester_name": username,
      "location": "Portal Security",
      "category": "Password Reset",
      "priority": "High",
  }
  worker = threading.Thread(
      target=_send_emailjs_worker, args=(to_email, reset_data)
  )
  worker.daemon = True
  worker.start()