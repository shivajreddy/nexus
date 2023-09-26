import smtplib
import ssl
from email.message import EmailMessage

import certifi
from fastapi import HTTPException

from app.config import settings

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session


email_server = smtplib.SMTP(settings.SMTP_SERVER_ADDRESS, settings.SMTP_PORT)
# email_server.starttls()
# email_server.login(SMTP_USERNAME, SMTP_PASSWORD)


def send_email():
    sender_email = "my@gmail.com"
    receiver_email = "your@gmail.com"
    message = """\
    Subject: Hi there

    This message is sent from Python."""

    email_server.sendmail(sender_email, receiver_email, message)


# Office 365 OAuth2 credentials
client_id = settings.OFFICE_CLIENT_ID
client_secret = settings.OFFICE_CLIENT_SECRET
tenant_id = settings.OFFICE_TENANT_ID
resource_uri = settings.OFFICE_RESOURCE_URI

# Create an OAuth2 session
client = BackendApplicationClient(client_id=client_id)
oauth = OAuth2Session(client=client)
token = oauth.fetch_token(token_url=f"https://login.microsoftonline.com/{tenant_id}/oauth2/token",
                          client_id=client_id,
                          client_secret=client_secret,
                          resource_uri=resource_uri)
print("🔥TOKEN= ", token)


def send_email_with_verification_key(recipient_email:str, verification_key: str):
    recipient = "sreddy@tecofva.com" # ? change this to recipent_email after testing

    confirmation_link = settings.SERVER_ADDRESS + f"/auth/confirm-registration/{recipient_email}/{verification_key}"

    message = f"hello:{recipient_email}, please use this link to verify your account: {confirmation_link}"

    email = EmailMessage()
    email["From"] = settings.SENDER_EMAIL
    email["To"] = recipient
    email["Subject"] = "Test Email"
    email.set_content(message)

    smtp = smtplib.SMTP(
        host=settings.SMTP_SERVER_ADDRESS,
        port=settings.SMTP_PORT
    )
    # smtp.ehlo()
    smtp.starttls()
    # ssl._create_default_https_context = ssl._create_unverified_context
    # ssl._create_default_https_context(cafile=certifi.where())
    # sslcontext = ssl.create_default_context()
    # smtp.starttls(sslcontext)

    try:
        # :: using TOKEN
        # smtp.login(settings.SMTP_USERNAME, f"Bearer {token['access_token']}")
        # :: using username, password
        smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        print("smtp has finished login")
        smtp.sendmail(settings.SENDER_EMAIL, recipient, email.as_string())
        smtp.quit()     # + quit the smtp server after sending email
        return True
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(e)}"
        )
