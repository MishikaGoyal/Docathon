from fastapi import APIRouter
from pydantic import BaseModel,EmailStr
from app.database import db

router = APIRouter()


class UserIn(BaseModel):
    name : str 
    email: EmailStr
    password: str


@router.post("/login")
async def login_handler(user:UserIn):
    user_dict = user.dict()
    result = await db["users"].insert_one(user_dict)
    print(result)
    return {"id": str(result.inserted_id)}