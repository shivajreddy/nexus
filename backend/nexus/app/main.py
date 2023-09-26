from fastapi import FastAPI, HTTPException, status
from starlette.middleware.cors import CORSMiddleware

from app.database import connect_mongodb
from app.email.setup import send_email, send_email_with_verification_key
from app.router.auth import router as auth_router
from app.router.eagle import router as eagle_router

app = FastAPI(
    title="Nexus",
    description="""Nexus is a central system designed for Home builders, to accelerate Home building.""",
    version="1.0.0",
    contact={
        "name": "Shiva Reddy",
        "url": "https://github.com/shivajreddy"
    },
    license_info={
        "name": "MIT",
        "url": "https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt"
    }
)

origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def app_init():
    connect_mongodb()       # + connect to database
    app.include_router(auth_router)     # + include router's
    app.include_router(eagle_router)


@app.get("/api/healthchecker")
def root():
    return {"message": "Hello World"}


# ? Delete this after testing
@app.get("/test")
def test_route():
    return {"result": "test passed" }


@app.post('/test')
def test_route_post(name: str):
    return {"your name": name}


@app.post('/email')
def test_email():
    target_testing_email = "sreddy@tecofva.com"
    result = send_email_with_verification_key(target_testing_email, "some key")

    if result is not True:  # + email sending failed
        return result

    return "Email sent successfully"
