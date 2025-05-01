from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, crud, schemas
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Optional
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
    allow_origins=["http://localhost:3000"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Authorization"],  # Important for frontend to access token
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

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        logger.info(f"Attempting to decode token")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.info(f"Token payload: {payload}")
        
        user_id = payload.get("user_id")
        if user_id is None:
            logger.warning("No user_id in token")
            raise credentials_exception
            
        user = crud.get_user_by_id(db, user_id=user_id)
        if user is None:
            logger.warning(f"User with id {user_id} not found in database")
            raise credentials_exception
            
        logger.info(f"User authenticated: {user.email}, Role: {user.ruolo}")
        return user
        
    except JWTError as e:
        logger.error(f"JWT validation failed: {str(e)}")
        raise credentials_exception
    except Exception as e:
        logger.error(f"Unexpected error in authentication: {str(e)}")
        raise credentials_exception

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

# Profile endpoint
@app.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    logger.info(f"Profile request for user: {current_user.email}")
    
    # Map user role to standardized format
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
        cap=current_user.cap,
        citta=current_user.citta,
        prov=current_user.prov,
        cod_fisc=current_user.cod_fisc,
        role=role
    )

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
@app.get("/channels/{native_language}", response_model=list[schemas.ChannelResponse])
def get_channel(native_language: str, db: Session = Depends(get_db)):
    return crud.get_channel(db, native_language)

@app.get("/applications/{native_language}", response_model=list[schemas.ApplicationResponse])
def get_application(native_language: str, db: Session = Depends(get_db)):
    return crud.get_application(db, native_language)