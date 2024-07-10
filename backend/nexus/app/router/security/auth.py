import secrets
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from starlette.responses import JSONResponse

from app.database.database import users_coll
from app.email.utils import send_email_with_verification_key
from app.security.oauth2 import create_access_token, create_refresh_token, verify_refresh_token, get_current_user_data
from app.database.schemas.user import User, NewUserSchema, UserSecurityDetails, UserInfo
from app.security.utils import hash_password, verify_password

router = APIRouter(prefix="/auth")


# Register a new user
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user(payload: NewUserSchema):
    # + Check if user already exist
    existing_user = users_coll.find_one({"username": payload.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"{payload.username} is already registered."
        )

    # create new User object
    new_user = User(
        username=payload.username,
        security=UserSecurityDetails(hashed_password=hash_password(payload.plain_password)),
        user_info=UserInfo(
            first_name=payload.first_name,
            last_name=payload.last_name,
            department=payload.department,
            job_title=payload.job_title
        )
    )

    # set security details
    new_user.security.roles = [101]
    new_user.security.created_at = datetime.utcnow().isoformat()
    new_user.security.verified = False  # add verified status to false.

    # + send verification email
    email_verification_key = secrets.token_urlsafe(16)  # create a secret key, to email them for verifying email
    email_result = send_email_with_verification_key(payload.username, email_verification_key)

    if email_result is not True:  # + email sending failed
        return email_result

    # + add to DB after sending the confirmation link
    inserted_id = users_coll.insert_one(new_user.model_dump()).inserted_id
    users_coll.update_one(
        {"_id": inserted_id},
        {
            "$set":
                {
                    **new_user.model_dump(),
                    "email_verification_key": email_verification_key
                }
        }
    )

    return {"result": "email_sent_successfully"}


@router.post("/login")
async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    # async def login_user(payload: LoginUserSchema, response: Response):
    # user_doc = user_coll.find_one({"username": payload.email})
    # print("form_data=", form_data)
    user_doc = users_coll.find_one({"username": form_data.username})
    # print("user_doc=", user_doc)

    if not user_doc:
        raise HTTPException(
            # status_code=status.HTTP_204_NO_CONTENT, detail="User email doesn't exist"
            status_code=status.HTTP_404_NOT_FOUND, detail="User email doesn't exist"
        )

    # + check if the user has verified their account
    security_data = user_doc.get("security", {})
    if not security_data.get("verified", {}):
        raise HTTPException(
            status_code=status.HTTP_412_PRECONDITION_FAILED,
            detail={
                "error": "Unauthorized",
                "message": "Your account has not been verified yet.Please check your email \
                for a verification link and follow the instructions to verify your account."
            })

    # + evaluate password
    if not verify_password(form_data.password, security_data.get("hashed_password")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong Password"
        )

    # + create JWTs -> access-token & refresh-token
    user = User(
        # **user_doc
        username=user_doc["username"],
        security=UserSecurityDetails(
            hashed_password=security_data["hashed_password"],
            roles=security_data["roles"],
            verified=True,
            created_at=security_data["created_at"]
        ),
        user_info=user_doc["user_info"]
    )

    access_token = create_access_token(data=user)
    refresh_token = create_refresh_token(data=user)

    # + update refresh_token in the document
    users_coll.update_one(user_doc, {"$set": {"security.refresh_token": refresh_token}})

    # + send user data and accessToken in response body
    # response = JSONResponse(content={
    #     "status": "success",
    #     "access_token": access_token,
    #     "roles": user.security.roles,
    #     "username": user.username,
    #     "department": "",
    #     "team": "",
    # })

    # print("now would be user=", user.model_dump())
    # print(type(user.model_dump()))
    response = JSONResponse(content={
        "access_token": access_token,
        "user": user.model_dump()
    })
    # + store refresh in HTTP only cookie
    response.set_cookie("refresh_token", refresh_token, httponly=True, max_age=86400)
    return response


@router.get("/refresh")
def refresh(request: Request):
    print("🔥cookies:", request.cookies)

    if "refresh_token" not in request.cookies:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No Refresh Token in cookies",
        )
    refresh_token = request.cookies["refresh_token"]

    refresh_token_data = verify_refresh_token(refresh_token)
    # print("👾 refresh_token is validated:", refresh_token_data)

    user_doc = users_coll.find_one({"username": refresh_token_data.username})
    # print("🍔 user_doc:", user_doc)

    user_data = {k: v for (k, v) in user_doc.items() if k != "_id"}
    user = User(**user_data)
    new_access_token = create_access_token(data=user)
    # # print("☺️ user=", user)
    # # print("✅ new_access_token", new_access_token)

    # + check if the user has verified their account
    security_data = user_doc.get("security", {})

    user = User(
        # **user_doc
        username=user_doc["username"],
        security=UserSecurityDetails(
            hashed_password=security_data["hashed_password"],
            roles=security_data["roles"],
            verified=True,
            created_at=security_data["created_at"],
        ),
        user_info=UserInfo(
            **user_doc["user_info"]
        )
    )

    # return {
    #     "status": "success",
    #     "username": user.username,
    #     "new_access_token": new_access_token,
    #     "roles": user.security.roles,
    #     "department": "",
    #     "team": ""
    # }
    return {
        "new_access_token": new_access_token,
        "user": user.model_dump()
    }


@router.get("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"status": "successfully logged out"}


@router.get("/reset-password")
async def reset_password(
        current_user_data: Annotated[User, Depends(get_current_user_data)]
):
    # only logged-in users can view this page
    # print("current-user:", current_user_data)
    pass


@router.get("/forgot-password")
async def forgot_password():
    # open for public
    # get the user-name, make sure he/she
    # set verified status to False

    # create secret
    forgot_password_secret = secrets.token_urlsafe(16)

    # email secret
    pass


@router.get("/forgot-password/confirmation/{secret_key}")
async def forgot_password_confirmation(secret_key: str):
    # get the
    # print("given secret_key", secret_key)

    # get the secret_key from DB
    secret_key_from_db = None

    # verify both equal

    # get the new password

    # hash the new password
    new_hashed_password = None

    # save the new_hashed_password in db

    # send tokens


@router.get("/confirm-registration/{username}/{email_verification_key}")
async def confirm_registration(request: Request, username: str, email_verification_key: str):
    # print("given username:", username)
    # print("given key:", email_verification_key)

    #  + validate username and email_verification_key
    user_doc = users_coll.find_one({"username": username})
    if not user_doc:  # user doesn't exist in DB
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User email doesn't exist"
        )
    if user_doc.get("verified"):  # check if the user has already verified their account
        return JSONResponse(
            status_code=status.HTTP_304_NOT_MODIFIED,
            content={"result": "account already verified"},
        )

    if user_doc.get("email_verification_key") != email_verification_key:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Wrong verification key")

    # + Set the verified status to True and delete the email_verification_key
    users_coll.update_one({"_id": user_doc["_id"]}, {"$set": {"security.verified": True},
                                                     "$unset": {"email_verification_key": ""}})

    return {"result": "account successfully verified. Please login with your credentials"}


@router.post("/update-password")
async def update_password(
        new_plain_password: str,
        current_user_data: Annotated[User, Depends(get_current_user_data)],
):
    # print(current_user_data)

    # hash the new password
    # print("new_password given:", new_plain_password)

    # save the hashed password to db
    new_hashed_password = hash_password(new_plain_password)
