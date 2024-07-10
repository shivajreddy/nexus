from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from fastapi import HTTPException
from app.settings.config import settings
import smtplib

email_server = smtplib.SMTP(settings.SMTP_SERVER_ADDRESS, settings.SMTP_PORT)


def send_email():
    sender_email = "my@gmail.com"
    receiver_email = "your@gmail.com"
    message = """\
    Subject: Hi there

    This message is sent from Python."""

    email_server.sendmail(sender_email, receiver_email, message)


def send_email_with_given_message_and_attachment(recipient_email, message):

    smtp = smtplib.SMTP(
        host=settings.SMTP_SERVER_ADDRESS,
        port=settings.SMTP_PORT
    )
    smtp.starttls()

    try:
        # :: using username, password
        smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        print("smtp has finished login")
        smtp.sendmail(  # send customer-email
            from_addr=settings.SENDER_EMAIL,
            to_addrs=recipient_email,
            msg=message.as_string())
        smtp.quit()  # + quit the smtp server after sending email
        return True
    except Exception as e:
        print("Error =", e)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(e)}"
        )


def send_email_with_verification_key(recipient_email: str, verification_key: str):
    admin_email_addrs = "sreddy@tecofva.com"

    confirmation_link = "http://" + settings.CLIENT_ORIGIN + f"/auth/confirm-registration/{recipient_email}/{verification_key}"

    html_message = f"""
    <pre>
        <p>Please use the below link to verify your account:</p>
        <a href="{confirmation_link}">Confirmation Registration</a>
    </pre>
    """
    # this text_message will act as fallback if html_message fails
    text_message = f"Please copy paste the following link in your broswer to finish registration \n {confirmation_link}"

    html_mime_message = MIMEText(html_message, 'html')
    text_mime_message = MIMEText(text_message, 'plain')

    # customer_email = EmailMessage()
    customer_email = MIMEMultipart('alternative')
    customer_email["From"] = settings.SENDER_EMAIL
    customer_email["To"] = recipient_email
    customer_email["Subject"] = "Nexus account Registration"
    # customer_email.set_content(message)
    # customer_email.set_content(message, subtype="html")     # sending email in html formatl, to get clickable url.
    # customer_email.set_content(mime_message, subtype="html")     # sending email in html formatl, to get clickable url.
    customer_email.attach(html_mime_message)
    customer_email.attach(text_mime_message)

    # admin_email = EmailMessage()
    admin_email = MIMEMultipart('alternative')
    admin_email["From"] = settings.SENDER_EMAIL
    admin_email["To"] = admin_email_addrs
    admin_email["Subject"] = "Copy Of Customer's registration email confirmation"
    # admin_email.set_content(message)
    # admin_email.set_content(message, subtype="html")     # sending email in html formatl, to get clickable url.
    # admin_email.set_content(mime_message, subtype="html")     # sending email in html formatl, to get clickable url.
    admin_email.attach(html_mime_message)
    admin_email.attach(text_mime_message)

    smtp = smtplib.SMTP(
        host=settings.SMTP_SERVER_ADDRESS,
        port=settings.SMTP_PORT
    )
    smtp.starttls()

    try:
        # :: using username, password
        smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        print("smtp has finished login")
        smtp.sendmail(  # send customer-email
            from_addr=settings.SENDER_EMAIL,
            to_addrs=recipient_email,
            msg=customer_email.as_string())
        smtp.sendmail(  # send a copy to admin
            from_addr=settings.SENDER_EMAIL,
            to_addrs=admin_email_addrs,
            msg=admin_email.as_string())
        smtp.quit()  # + quit the smtp server after sending email
        return True
    except Exception as e:
        print("Error =", e)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(e)}"
        )
