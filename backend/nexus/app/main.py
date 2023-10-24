from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.database.database import connect_mongodb, department_data_coll, users_coll
from app.router.security.auth import router as auth_router
from app.router.company.eagle import router as eagle_router
from app.router.public import router as public_router
from app.router.department.teclab.epc import router as epc_router

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
    app.include_router(public_router)
    app.include_router(epc_router)


@app.get("/api/healthchecker")
def root():
    return {"message": "Hello World"}


# :: SETUP DATABASE :: #
@app.get("/setup-database")
def setup_database():
    # + set up collections
    # + 'department_data' collection
    department_data_coll.create_index('department_name', unique=True)

    # + 'users' collection
    users_coll.create_index('username', unique=True)
    return {"done setting up department data"}

    # + 'eagle_data' collection

    # + 'projects' collection
