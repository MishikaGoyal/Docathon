import time
from typing import Dict

import jwt
from decouple import config

JWT_SECRET = config("JWT_SECRET")
JWT_ALGORITHM = config("algorithm", default="HS256")  


def decode_jwt(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        
        if decoded_token.get("expires") and decoded_token["expires"] >= time.time():
            return decoded_token
        return {"error": "Token has expired"}
    except Exception as e:
        return {"error": str(e)}

def sign_jwt(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "expires": time.time() + 1200
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


