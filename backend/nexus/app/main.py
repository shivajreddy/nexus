# from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.database.database import connect_mongodb, department_data_coll, users_coll, eagle_data_coll, projects_coll
from app.database.setup_data.eagle_data import eagle_data_coll_initial_data, department_data_coll_initial_data, \
    projects_coll_initial_data

from app.router.users.users import router as users_router
from app.router.security.auth import router as auth_router
from app.router.eagle.eagle import router as eagle_router
from app.router.public import router as public_router
from app.router.department.teclab.teclab import router as teclab_router
from app.router.department.teclab.epc import router as teclab_epc_router
from app.router.department.teclab.cor import router as teclab_cor_router
from app.router.department.teclab.fosc import router as teclab_fosc_router
from app.router.testing.test1 import router as testing_router
from app.router.projects.projects import router as projects_router
from app.sockets.sockets import sio_app

# '''
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_mongodb()  # + connect to database
    app.include_router(auth_router)  # + include router's
    app.include_router(eagle_router)
    app.include_router(public_router)
    app.include_router(users_router)
    app.include_router(teclab_router)
    app.include_router(teclab_epc_router)
    app.include_router(teclab_cor_router)
    app.include_router(teclab_fosc_router)
    app.include_router(testing_router)
    app.include_router(projects_router)
    yield

# '''


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
    },
    lifespan=lifespan
)

app.mount("/ws", sio_app)

# origins = [
#     "https://34.139.78.157:3000",
#     "https://34.139.78.157",
#
#     "http://34.139.78.157:3000",
#     "http://34.139.78.157",
#
#     "34.139.78.157:3000",
#     "34.139.78.157",
#
#     "http://34.139.78.157:3000/",
#     "http://34.139.78.157/",
#
#     "http://localhost:3000",
#     "http://localhost",
#
#     "http://0.0.0.0:3000",
#     "http://0.0.0.0",
#
#     "http://localhost:8000",
#     "http://34.139.78.157:8000/",

# "http://localhost",
# "http://34.148.73.253:8000/",
# "http://nexus.tecofva.com:8000",
# ]

# Front-end origins that should be allowed

origins = [
    "http://localhost:3000",
    "http://192.168.18.72:3000",
    # "http://34.148.73.253:3000",
    # "http://nexus.tecofva.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

'''
@app.on_event("startup")
async def app_init():
    connect_mongodb()  # + connect to database
    app.include_router(auth_router)  # + include router's
    app.include_router(eagle_router)
    app.include_router(public_router)
    app.include_router(users_router)
    app.include_router(teclab_router)
    app.include_router(teclab_epc_router)
    app.include_router(teclab_cor_router)
    app.include_router(testing_router)
    app.include_router(projects_router)
'''

@app.get('/')
def test_public():
    return {"Hello World! from Nexus"}

@app.get("/api/healthchecker")
def root():
    return {"message": "Hello World"}


# :: SETUP DATABASE (DROPS IF PRE-EXISTING COLLECTIONS) :: #
@app.get("/setup-database")
def setup_database():
    # + 'users' collection
    users_coll.drop()
    users_coll.create_index('username', unique=True)
    # users_coll.insert_many(users_coll_initial_data)

    # + 'eagle_data' collection
    eagle_data_coll.drop()
    eagle_data_coll.create_index('table_name', unique=True)
    eagle_data_coll.insert_many(eagle_data_coll_initial_data)

    # + 'department_data' collection
    department_data_coll.drop()
    department_data_coll.create_index('department_name', unique=True)
    department_data_coll.insert_many(department_data_coll_initial_data)

    # + 'projects' collection
    projects_coll.drop()
    projects_coll.insert_many(projects_coll_initial_data)

    return {"All database collections are setup successfully"}
