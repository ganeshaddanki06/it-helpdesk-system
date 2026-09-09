import smtplib
import threading
import json
import urllib.request
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings


def _send_any_email_worker(to_email: str, subject: str, html_body: str):
    """Sends live email to ANY recipient using Gmail SMTP SSL (Port 465)."""
    sent = False

    # 1. Primary: Direct Gmail SMTP SSL (Port 465) - Sends to ANY email address in the world!
    gmail_user = "ganeshaddanki06@gmail.com"
    gmail_pass = "ewzvhueyypgfxjih"

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"ACET IT Helpdesk <{gmail_user}>"
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html"))

        # Port 465 direct SSL connection
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15)
        server.login(gmail_user, gmail_pass)
        server.sendmail(gmail_user, [to_email], msg.as_string())
        server.quit()
        print(f"[SUCCESS] EMAIL DELIVERED TO ANY RECIPIENT: {to_email}")
        sent = True
    except Exception as e:
        print(f"[SMTP Notice] Gmail SSL: {e}")

    # 2. Fallback via Resend API if recipient is ganeshaddanki06
    if not sent and "ganeshaddanki06" in to_email.lower():
        api_key = os.getenv("RESEND_API_KEY") or "re_T4MGAGvo_DNfdYPRJTswNY9L65uQdcUxe"
        try:
            url = "https://api.resend.com/emails"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "from": "ACET IT Helpdesk <onboarding@resend.dev>",
                "to": [to_email],
                "subject": subject,
                "html": html_body,
            }
            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"[SUCCESS] DELIVERED VIA RESEND: {to_email}")
        except Exception as e2:
            print(f"[Resend Notice]: {e2}")


def send_ticket_created_notification(to_email: str, ticket_data: dict):
    target_email = to_email or "ganeshaddanki06@gmail.com"
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
          <p style="color: #475569;">A technical problem has been logged in the campus IT Helpdesk portal:</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Ticket ID:</strong> <span style="color: #2563eb; font-weight: bold;">{ticket_id}</span></p>
            <p style="margin: 4px 0;"><strong>Issue Summary:</strong> {issue_title}</p>
            <p style="margin: 4px 0;"><strong>Location:</strong> {location}</p>
            <p style="margin: 4px 0;"><strong>Category:</strong> {category}</p>
            <p style="margin: 4px 0;"><strong>Priority:</strong> <span style="color: #dc2626; font-weight: bold;">{priority}</span></p>
            <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #2563eb; font-weight: bold;">Open (Assigned for Diagnosis)</span></p>
          </div>

          <p style="font-size: 13px; color: #64748b;">The IT support team has been notified to attend to the problem.</p>
          <div style="text-align: center; margin-top: 25px;">
            <a href="https://it-helpdesk-system-2m9r.vercel.app/tickets/{ticket_id}" style="background: #2563eb; color: #ffffff; padding: 10px 22px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">View Ticket Online</a>
          </div>
        </div>
      </div>
    </body>
    </html>
    """

    worker = threading.Thread(target=_send_any_email_worker, args=(target_email, subject, html_body))
    worker.daemon = True
    worker.start()