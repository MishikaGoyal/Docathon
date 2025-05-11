import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]
