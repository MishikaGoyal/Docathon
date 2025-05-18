from fastapi import APIRouter , HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel,EmailStr
from app.database import db
from app.token import jwt_token
from datetime import datetime

auth_router = APIRouter()

class doctorIn(BaseModel):
    name : str 
    email: EmailStr
    password: str
    gender:str
    speciality: str
    department: str

class doctorData(BaseModel):
    email:EmailStr
    password:str

class patientIn(BaseModel):
    name:str
    email:EmailStr
    gender:str
    password:str
    dob:datetime

class patientData(BaseModel):
    email:EmailStr
    password:str


@auth_router.post("/doctor/register")
async def doctor_register_handler(user: doctorIn):
    user_dict = user.model_dump()
    existing_user = await db["doctors"].find_one({"email": user_dict["email"]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    result = await db["doctors"].insert_one(user_dict)
    token = jwt_token.sign_jwt(user_dict["email"])

    response = JSONResponse(content={"message": "Doctor registered successfully"})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # Set True in production with HTTPS
        samesite="Lax",
        max_age=3600,
        path="/"
    )
    return response

@auth_router.post("/patient/register")
async def patient_register_handler(user: patientIn):
    user_dict = user.model_dump()
    existing_user = await db["patients"].find_one({"email": user_dict["email"]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    result = await db["patients"].insert_one(user_dict)
    token = jwt_token.sign_jwt(user_dict["email"])

    response = JSONResponse(content={"message": "Patient registered successfully"})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=3600,
        path="/"
    )
    return response
   

@auth_router.post("/doctor/login")
async def doctor_login_handler(user: doctorData):
    user_dict = user.model_dump()
    existing_user = await db["doctors"].find_one({"email": user_dict["email"]})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = jwt_token.sign_jwt(user_dict["email"])
    response = JSONResponse(content={"message": "Doctor logged in successfully"})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=3600,
        path="/"
    )
    return response


@auth_router.post("/patient/login")
async def patient_login_handler(user: patientData):
    user_dict = user.model_dump()
    existing_user = await db["patients"].find_one({"email": user_dict["email"]})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = jwt_token.sign_jwt(user_dict["email"])
    response = JSONResponse(content={"message": "Patient logged in successfully"})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=3600,
        path="/"
    )
    return response



