from datetime import datetime

from fastapi import BackgroundTasks


def send_email(message):
    print("Email Time: ", datetime.now())
    print("Message:", message)

# Get the required data and arrange it



