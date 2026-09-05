import smtplib
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings


def _send_smtp_worker(to_email: str, subject: str, html_body: str):
    user = settings.effective_smtp_user
    password = settings.effective_smtp_password
    host = settings.effective_smtp_host
    port = settings.effective_smtp_port

    if not user or not password:
        print(f"[Email Service] Credentials not ready. Simulated email to: {to_email}")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{user}>"
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html"))

        if port == 465:
            server = smtplib.SMTP_SSL(host, port, timeout=12)
        else:
            server = smtplib.SMTP(host, port, timeout=12)
            server.starttls()

        server.login(user, password)
        server.sendmail(user, to_email, msg.as_string())
        server.quit()
        print(f"[Email Service] LIVE EMAIL DELIVERED to: {to_email}")
    except Exception as e:
        print(f"[Email Service Warning] Delivery attempt: {e}")


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
          <p style="color: #475569;">A technical incident has been logged in the campus IT Helpdesk portal:</p>
          
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

    worker = threading.Thread(target=_send_smtp_worker, args=(target_email, subject, html_body))
    worker.daemon = True
    worker.start()