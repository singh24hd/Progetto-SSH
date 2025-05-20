from fastapi import FastAPI, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, crud, schemas
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, jwt
from typing import Optional, List
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware - ensure this is set correctly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Authentication configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = "your_secret_key"  # Replace with a secure key in production!
ALGORITHM = "HS256"

# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token format",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        user = crud.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
            
        return user
        
    except JWTError as e:
        logger.error(f"JWT Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )

# Check teacher role
async def get_current_teacher(current_user: models.User = Depends(get_current_user)):
    # Check if user is a teacher
    if not current_user.ruolo.lower().startswith("insegnante"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Teacher role required.",
        )
    return current_user

# Login endpoint
@app.post("/login", response_model=schemas.TokenResponse)
def login(form_data: schemas.LoginForm, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for email: {form_data.email}")
    user = crud.authenticate_user(db, form_data.email, form_data.password)
    if not user:
        logger.warning(f"Authentication failed for: {form_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    # Create token with standardized role
    role = "student" if user.ruolo.lower().startswith("student") else "teacher"
    token_data = {
        "sub": user.email,
        "user_id": user.id,
        "role": role
    }
    
    access_token = crud.create_access_token(data=token_data)
    logger.info(f"Login successful for: {form_data.email} with role: {role}")
    
    return {
        "access_token": access_token,
        "role": role
    }


# Registration endpoint
@app.post("/register/", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        logger.warning(f"Registration failed: {user.email} already registered")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    logger.info(f"Registering new user: {user.email}")
    return crud.create_user(db, user)

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/channels/by-language", response_model=List[schemas.ChannelBase])
def read_channels_by_language(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_channel(db, native_language=current_user.lingua_madre)

@app.get("/applications/{native_language}", response_model=List[schemas.ApplicationResponse])
def get_application(native_language: str, db: Session = Depends(get_db)):
    return crud.get_application(db, native_language)

## Profile endpoint


@app.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    logger.info(f"Profile request for user: {current_user.email}")

    # Standardize role
    role = "student" if current_user.ruolo.lower().startswith("student") else "teacher"

    return schemas.UserResponse(
        id=current_user.id,
        email=current_user.email,
        nome=current_user.nome,
        cognome=current_user.cognome,
        data_nasc=current_user.data_nasc,
        luogo_nasc=current_user.luogo_nasc,
        nazionalità=current_user.nazionalità,
        telefono=current_user.telefono,
        indirizzo=current_user.indirizzo,
        cap=str(current_user.cap) if current_user.cap is not None else None,  # Convert to string
        citta=current_user.citta,
        prov=current_user.prov,
        cod_fisc=current_user.cod_fisc,
        lingua_madre=current_user.lingua_madre,
        lingua_secondaria=current_user.lingua_secondaria,
        livello_italiano=current_user.livello_italiano,
        role=role
    )

# Modified get_all_studenti function
@app.get("/studenti-list", response_model=list[schemas.UserResponse])
def get_all_studenti(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_teacher)
):
    studenti = crud.get_all_student(db)
    return [schemas.UserResponse(
        id=s.id,
        role="student",
        email=s.email,
        nome=s.nome,
        cognome=s.cognome,
        data_nasc=s.data_nasc,
        luogo_nasc=s.luogo_nasc,
        nazionalità=s.nazionalità,
        telefono=s.telefono,
        indirizzo=s.indirizzo,
        cap=str(s.cap) if s.cap is not None else None,  # Convert to string
        citta=s.citta,
        prov=s.prov,
        cod_fisc=s.cod_fisc,
        lingua_madre=s.lingua_madre,
        lingua_secondaria=s.lingua_secondaria,
        livello_italiano=s.livello_italiano,
    ) for s in studenti]

# Modified update_student function
@app.put("/studenti/{student_id}", response_model=schemas.UserResponse)
def update_student(
    student_id: int,
    student_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_teacher)
):
    # Check if student exists
    student = crud.get_user_by_id(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Verify that the user is a student
    if not student.ruolo.lower().startswith("student"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The specified user is not a student"
        )
    
    # Update the student
    updated_student = crud.update_user(db, student_id, student_update)
    if not updated_student:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update student"
        )
    
    role = "student"  # We know it's a student
    
    logger.info(f"Student updated: ID={student_id}, Email={updated_student.email}")
    return schemas.UserResponse(
        id=updated_student.id,
        email=updated_student.email,
        nome=updated_student.nome,
        cognome=updated_student.cognome,
        data_nasc=updated_student.data_nasc,
        luogo_nasc=updated_student.luogo_nasc,
        nazionalità=updated_student.nazionalità,
        telefono=updated_student.telefono,
        indirizzo=updated_student.indirizzo,
        cap=str(updated_student.cap) if updated_student.cap is not None else None,  # Convert to string
        citta=updated_student.citta,
        prov=updated_student.prov,
        cod_fisc=updated_student.cod_fisc,
        lingua_madre=updated_student.lingua_madre,
        lingua_secondaria=updated_student.lingua_secondaria,
        livello_italiano=updated_student.livello_italiano,
        role=role
    )

@app.post("/channels/{channel_id}/rate", response_model=schemas.ChannelResponse)
def rate_channel(
    channel_id: int,
    rating_update: schemas.ChannelRatingUpdate,
    db: Session = Depends(get_db)
):
    db_channel = crud.increment_channel_rating(db, channel_id=channel_id, increment=rating_update.increment)
    if db_channel is None:
        raise HTTPException(status_code=404, detail="Channel not found")
    return db_channel