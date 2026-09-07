import smtplib
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings


def _send_real_email(to_email: str, subject: str, html_body: str):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"ACET IT Helpdesk <ganeshaddanki06@gmail.com>"
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html"))

        # Connect directly to Gmail SMTP
        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=15)
        server.starttls()
        server.login("ganeshaddanki06@gmail.com", "ewzvhueyypgfxjih")
        server.sendmail("ganeshaddanki06@gmail.com", to_email, msg.as_string())
        server.quit()
        print(f"\n[SUCCESS] REAL EMAIL SENT TO: {to_email}\n")
    except Exception as e:
        print(f"\n[EMAIL ERROR]: {e}\n")


def send_ticket_created_notification(to_email: str, ticket_data: dict):
    target = to_email or "ganeshaddanki06@gmail.com"
    ticket_id = ticket_data.get("ticket_id", "TICKET")
    title = ticket_data.get("issue_title", "Lab Incident")
    location = ticket_data.get("location", "Cotton Bhavan CS Lab 3")
    category = ticket_data.get("category", "Computer/Lab")
    priority = ticket_data.get("priority", "High")
    requester = ticket_data.get("requester_name", "Faculty / Student")

    subject = f"[{ticket_id}] Problem Raised: {title}"
    html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #0f172a; color: #fff;">
      <div style="max-width: 550px; margin: auto; background: #fff; color: #333; padding: 25px; border-radius: 10px;">
        <h2 style="color: #2563eb; margin-top: 0;">ACET IT Helpdesk - Problem Raised</h2>
        <p>Hello <strong>{requester}</strong>,</p>
        <p>Your technical complaint has been successfully registered on campus:</p>
        <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p><strong>Ticket ID:</strong> {ticket_id}</p>
          <p><strong>Problem:</strong> {title}</p>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Priority:</strong> <span style="color: red; font-weight: bold;">{priority}</span></p>
          <p><strong>Status:</strong> Open (Technician Assigned)</p>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">Aditya College of Engineering & Technology • Automated Campus Operations</p>
      </div>
    </div>
    """

    thread = threading.Thread(target=_send_real_email, args=(target, subject, html))
    thread.daemon = True
    thread.start()