from sqlalchemy.orm import Session
from . import models
from . import schemas
import bcrypt
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Secret key for JWT tokens - in production, use a secure environment variable
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_user(db: Session, user: schemas.UserCreate):
    try:
        hashed_pw = hash_password(user.password)
        
        # Create a dictionary from the user object and remove the password field
        user_data = user.dict()
        user_data.pop("password", None)
        
        # Add the hashed password
        user_data["hashed_password"] = hashed_pw
        
        # Create user object and add to DB
        db_user = models.User(**user_data)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"User created successfully: {user.email}")
        return db_user
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating user: {str(e)}")
        raise

def get_user_by_email(db: Session, email: str):
    try:
        return db.query(models.User).filter(models.User.email == email).first()
    except Exception as e:
        logger.error(f"Error fetching user by email: {str(e)}")
        return None

def get_user_by_id(db: Session, user_id: int):
    try:
        return db.query(models.User).filter(models.User.id == user_id).first()
    except Exception as e:
        logger.error(f"Error fetching user by ID: {str(e)}")
        return None

def authenticate_user(db: Session, email: str, password: str):
    # Get user by email
    user = get_user_by_email(db, email)
    if not user:
        logger.warning(f"Authentication failed: User {email} not found")
        return False  # User not found
    
    # Verify password
    if not verify_password(password, user.hashed_password):
        logger.warning(f"Authentication failed: Invalid password for {email}")
        return False  # Password is incorrect
    
    logger.info(f"User {email} authenticated successfully")
    return user  # Return authenticated user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    try:
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error creating access token: {str(e)}")
        raise
def get_channel(db: Session, native_language: str):  
    lista = db.query(models.Channels).filter(models.Channels.native_language == native_language).all()
    lista_canali=[]
    rating=-100
    for canale in lista:
        if canale.rating > rating:
            rating = canale.rating
            lista.remove(canale)
            lista_canali.append(canale)
    return lista_canali

def get_application(db: Session, native_language: str):
    lista = db.query(models.Applications).filter(models.Applications.native_language == native_language).all()
    lista_applicazioni=[]
    rating=-100
    for applicazione in lista:
        if applicazione.rating > rating:
            rating = applicazione.rating
            lista.remove(applicazione)
            lista_applicazioni.append(applicazione)
    return lista_applicazioni
def increment_channel_rating(db: Session, channel_id: int, increment: int = 1):
    db_channel = db.query(models.Channels).filter(models.Channels.id == channel_id).first()
    if not db_channel:
        return None
    
    # Se il rating è None, impostalo a 1, altrimenti incrementa
    if db_channel.rating is None:
        db_channel.rating = increment
    else:
        db_channel.rating += increment
    
    db.commit()
    db.refresh(db_channel)
    return db_channel