from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

from .database import engine, SessionLocal  # Assuming you have a function to get DB session
from . import schemas, crud, models
from fastapi.middleware.cors import CORSMiddleware 

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        




@app.post("/register-new-user/", response_model=schemas.StudenteResponse)
def create_user(user: schemas.StudenteCreate, db: Session = Depends(get_db)):
    return crud.create_studente(db=db, user=user)

 
        

