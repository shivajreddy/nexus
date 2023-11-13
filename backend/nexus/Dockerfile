FROM python:3.11-slim

# set the working directory
WORKDIR /app/backend

COPY . .

# install all the dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

EXPOSE 8000

# start the uvicorn app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

