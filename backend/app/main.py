from fastapi import FastAPI, Depends
from app.routes.auth import auth_router
from app.routes.drugs_do import drugs_router
from app.token.jwt_bearer import JWTBearer

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/protected" , dependencies=[Depends(JWTBearer())])
def protected_api():
    return{"message":"this is protected page"}

app.include_router(auth_router)
app.include_router(drugs_router)
