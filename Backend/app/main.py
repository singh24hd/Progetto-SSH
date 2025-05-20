# main.py
from fastapi import FastAPI, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, crud, schemas
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, jwt
from typing import Dict, Any, List
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

# Dependency: DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Decode token
def decode_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        role = payload.get("role")
        if not user_id or role not in ["student", "teacher"]:
            raise JWTError()
        return {"id": user_id, "role": role}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Current user dependency
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    info = decode_token(token)
    if info["role"] == "student":
        user = crud.get_student(db, info["id"])
    else:
        user = crud.get_teacher(db, info["id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Role guards
def get_role_required(role: str):
    async def _guard(current_user=Depends(get_current_user)):
        if role == "student" and not isinstance(current_user, models.Student):
            raise HTTPException(status_code=403, detail="Student access required")
        if role == "teacher" and not isinstance(current_user, models.Teacher):
            raise HTTPException(status_code=403, detail="Teacher access required")
        return current_user
    return _guard

get_current_student = get_role_required("student")
get_current_teacher = get_role_required("teacher")

# Login
@app.post("/login", response_model=schemas.TokenResponse)
def login(form_data: schemas.LoginForm, db: Session = Depends(get_db)):
    user = crud.authenticate_student(db, form_data.email, form_data.password)
    role = "student"
    if not user:
        user = crud.authenticate_teacher(db, form_data.email, form_data.password)
        role = "teacher"
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token_data = {"user_id": user.id, "role": role}
    access_token = crud.create_access_token(data=token_data)
    return {"access_token": access_token, "role": role}

# Register
@app.post("/register", response_model=schemas.UserResponse)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    if user_in.ruolo == "insegnante":
        if crud.get_teacher_by_email(db, user_in.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        created = crud.create_teacher(db, schemas.TeacherCreate(**user_in.dict()))
    else:
        if crud.get_student_by_email(db, user_in.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        created = crud.create_student(db, schemas.StudentCreate(**user_in.dict()))
    return created

# Health
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Me
@app.get("/me", response_model=schemas.UserResponse)
def read_me(current_user=Depends(get_current_user)):
    return current_user

# Students list - teacher only
@app.get("/students", response_model=List[schemas.UserResponse])
def get_students_endpoint(
    teacher: models.Teacher = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    return crud.get_students(db, teacher_id=teacher.id)

@app.get("/students_ass", response_model=List[schemas.UserResponse])
def get_students_endpoint(
    teacher: models.Teacher = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    return crud.get_student_ass(db, teacher_id=teacher.id)

@app.put("/aggiungiStud/{student_id}")
def ass_user(
    student_id: int,
    current_teacher=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verifica che l'utente corrente sia un insegnante
    if not isinstance(current_teacher, models.Teacher):
        raise HTTPException(status_code=403, detail="Operazione consentita solo agli insegnanti")
    
    # Ottiene lo studente target
    target_student = crud.get_student(db, student_id)
    if not target_student:
        raise HTTPException(status_code=404, detail="Studente non trovato")
    
    # Associa lo studente all'insegnante corrente
    crud.ass_user(db, student_id, current_teacher.id)
    return {"detail": "Studente assegnato con successo"}

# Update user
@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_in: schemas.UserUpdate,
    user_id: int = Path(..., ge=1),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_student = crud.get_student(db, user_id)
    if target_student:
        if isinstance(current_user, models.Student) and current_user.id != user_id:
            raise HTTPException(status_code=403, detail="Not allowed")
        if isinstance(current_user, models.Teacher) and target_student.insegnante_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not allowed")
        updated = crud.update_student(db, user_id, user_in)
    else:
        if isinstance(current_user, models.Student):
            raise HTTPException(status_code=403, detail="Not allowed")
        updated = crud.update_teacher(db, user_id, user_in)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found or cannot update")
    return updated

# Delete user - teacher only
@app.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if isinstance(current_user, models.Student):
        raise HTTPException(status_code=403, detail="Not allowed")
    target_student = crud.get_student(db, user_id)
    if not target_student or target_student.insegnante_id != current_user.id:
        raise HTTPException(status_code=404, detail="Student not found or not assigned to you")
    crud.delete_student(db, user_id)
    return {"detail": "Deleted"}

# Channels & Applications - students only
@app.get("/channels/by-language/", response_model=List[schemas.ChannelResponse])
def read_channels(
    student: models.Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return crud.get_channels(db, lingua=student.lingua_madre)

@app.get("/applications/by-language", response_model=List[schemas.ApplicationResponse])
def read_apps(
    student: models.Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_applications(db, lingua=student.lingua_madre)

# Rate channel
@app.post("/channels/{channel_id}/rate", response_model=schemas.ChannelResponse)
def rate_channel(
    channel_id: int,
    rating_update: schemas.ChannelRatingUpdate,
    db: Session = Depends(get_db)
):
    ch = crud.increment_channel_rating(db, channel_id, rating_update.increment)
    if not ch:
        raise HTTPException(status_code=404, detail="Channel not found")
    return ch
