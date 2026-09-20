import json
import os
import threading
import urllib.request
import urllib.error


def _send_emailjs_worker(to_email: str, ticket_data: dict):
  """Delivers live email directly to ANY recipient in the world using EmailJS API."""
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

  # 1. Primary Delivery: EmailJS (Sends to ANY email via your verified Gmail!)
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
            "name": requester,
            "location": location,
            "category": category,
            "priority": priority,
            "message": (
                f"Your IT problem has been registered under Ticket ID:"
                f" {ticket_id} for location: {location}. The technical team has"
                " been assigned to diagnose it."
            ),
        },
    }
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode("utf-8"), headers=headers
    )
    with urllib.request.urlopen(req, timeout=15) as response:
      print(
          f"[SUCCESS] EMAILJS DELIVERED DIRECTLY TO {to_email} (Status:"
          f" {response.status})",
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
          "subject": f"[For: {to_email}] [{ticket_id}] {issue_title}",
          "html": (
              f"<h3>[{ticket_id}] {issue_title}</h3><p>Location:"
              f" {location}</p><p>Intended Recipient: {to_email}</p>"
          ),
      }
      req = urllib.request.Request(
          url, data=json.dumps(payload).encode("utf-8"), headers=headers
      )
      with urllib.request.urlopen(req, timeout=15) as response:
        print(f"[SUCCESS] RESEND BACKUP DELIVERED TO ADMIN INBOX", flush=True)
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
      "issue_title": "Account Password Reset",
      "requester_name": username,
      "location": "Portal Authentication",
      "category": "Security",
      "priority": "High",
  }
  worker = threading.Thread(
      target=_send_emailjs_worker, args=(to_email, reset_data)
  )
  worker.daemon = True
  worker.start()