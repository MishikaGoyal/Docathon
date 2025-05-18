from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware 

from app.routes.auth import auth_router
from app.routes.drugs_do import drugs_router
from app.token.jwt_bearer import JWTBearer

app = FastAPI()


origins = [
    "http://localhost:3000",      
    "http://localhost:3001",
]

# 👇 Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],             
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/protected", dependencies=[Depends(JWTBearer())])
def protected_api():
    return {"message": "this is protected page"}

app.include_router(auth_router)
app.include_router(drugs_router)
