import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings


def send_email_notification(to_email: str, subject: str, html_content: str):
    """Sends a real email using SMTP safely in the background."""
    if not settings.EMAILS_ENABLED or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"[Email Service] Live emails disabled or credentials missing. Simulated email to: {to_email}")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_USER}>"
        msg["To"] = to_email

        html_part = MIMEText(html_content, "html")
        msg.attach(html_part)

        # Connect to SMTP server (e.g. Gmail / College SMTP)
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
        server.quit()
        print(f"[Email Service] Successfully sent live email to: {to_email}")
    except Exception as e:
        print(f"[Email Service Warning] Failed to send email: {e}")


def send_ticket_created_email(to_email: str, requester_name: str, ticket_id: str, issue_title: str, category: str, location: str, priority: str):
    """Sends a formatted confirmation email when a ticket is logged."""
    subject = f"[{ticket_id}] Ticket Logged: {issue_title}"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #334155; margin: 0; padding: 20px; }}
        .email-container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }}
        .email-header {{ background: linear-gradient(135deg, #0b1329 0%, #1e293b 100%); color: #ffffff; padding: 24px; text-align: center; }}
        .badge {{ display: inline-block; background-color: #2563eb; color: #ffffff; padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 12px; }}
        .content {{ padding: 24px; line-height: 1.6; }}
        .detail-box {{ background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }}
        .footer {{ background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; }}
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h2 style="margin:0;">ACET IT Helpdesk System</h2>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #94a3b8;">Aditya College of Engineering and Technology</p>
        </div>
        <div class="content">
          <p>Hello <strong>{requester_name}</strong>,</p>
          <p>Your campus IT support ticket has been successfully registered and logged in the system.</p>
          
          <div class="detail-box">
            <div style="margin-bottom: 8px;"><span class="badge">{ticket_id}</span> <strong style="margin-left: 8px; font-size: 16px;">{issue_title}</strong></div>
            <p style="margin: 6px 0;"><strong>Location:</strong> {location}</p>
            <p style="margin: 6px 0;"><strong>Category:</strong> {category}</p>
            <p style="margin: 6px 0;"><strong>Priority:</strong> <span style="color: #dc2626; font-weight: bold;">{priority}</span></p>
            <p style="margin: 6px 0;"><strong>Status:</strong> Open (Assigned for diagnosis)</p>
          </div>

          <p>An IT Technician has been notified and will attend to the issue shortly.</p>
          <p style="text-align: center; margin-top: 24px;">
            <a href="https://it-helpdesk-system-2m9r.vercel.app/tickets/{ticket_id}" style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Ticket Status Online</a>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated operational notification from Campus IT Operations.</p>
        </div>
      </div>
    </body>
    </html>
    """
    send_email_notification(to_email, subject, html_content)


def send_ticket_resolved_email(to_email: str, requester_name: str, ticket_id: str, issue_title: str, notes: str):
    """Sends an email when ticket is resolved by technician."""
    subject = f"[{ticket_id}] Resolved: {issue_title}"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h2 style="color: #10b981; margin-top: 0;">Ticket Resolved</h2>
        <p>Dear <strong>{requester_name}</strong>,</p>
        <p>Your support ticket <strong>{ticket_id}</strong> (<em>{issue_title}</em>) has been marked as <strong>RESOLVED</strong>.</p>
        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px; border-radius: 6px; margin: 16px 0;">
          <strong>Technician Resolution Notes:</strong>
          <p style="margin: 4px 0 0 0; color: #065f46;">{notes or 'Hardware/software issue diagnosed and fixed successfully.'}</p>
        </div>
        <p>Thank you,<br>Campus IT Support Team</p>
      </div>
    </body>
    </html>
    """
    send_email_notification(to_email, subject, html_content)