from fastapi import APIRouter , HTTPException
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
async def login_handler(user:doctorIn):
    user_dict = user.model_dump()
    existing_user = await db["doctors"].find_one({"email": user_dict["email"]})
    if existing_user:
        raise HTTPException(status_code=400 , detail="Email already registered")
    result = await db["doctors"].insert_one(user_dict)
    token = jwt_token.sign_jwt(user_dict["email"])
    print(result)
    return {"message": "Doctor registered successfully", "token": token}



@auth_router.post("/patient/register")
async def login_handler(user:patientIn):
    user_dict = user.model_dump()
    existing_user = await db["patients"].find_one({"email": user_dict["email"]})
    if existing_user:
        raise HTTPException(status_code=400 , detail="Email already registered")
    result = await db["patients"].insert_one(user_dict)
    token = jwt_token.sign_jwt(user_dict["email"])
    print(result)
    return {"message": "Patient registered successfully","token": token}
   

@auth_router.post("/doctor/login")
async def login_handler(user:doctorData):
    user_dict = user.model_dump()
    existing_user = await db["doctors"].find_one({"email": user_dict["email"]})
    if not existing_user:
        raise HTTPException(status_code=400 , detail="Email already registered")
    token = jwt_token.sign_jwt(user_dict["email"])
    print(existing_user)
    return {"message": "Doctor  logged in success" ,"token":token }

@auth_router.post("/patient/login")
async def login_handler(user:patientData):
    user_dict = user.model_dump()
    existing_user = await db["patients"].find_one({"email": user_dict["email"]})
    if not existing_user:
        raise HTTPException(status_code=400 , detail="Email already registered")
    print(existing_user)
    token = jwt_token.sign_jwt(user_dict["email"])
    return {"message": "patient logged in", "token": token}


