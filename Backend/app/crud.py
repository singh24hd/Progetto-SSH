from sqlalchemy.orm import Session
from .models import User
from . import schemas
import bcrypt
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional
from . import models

# Secret key for JWT tokens - in production, use a secure environment variable
SECRET_KEY = "your-secret-key-put-in-env-variable-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = hash_password(user.hashed_password)  # oppure, idealmente, user.password se lo rinomini
    user_data = user.dict()
    # Rimuove il campo che verrebbe fornito due volte:
    user_data.pop("hashed_password", None)
    user_data["hashed_password"] = hashed_pw
    db_user = User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    # Recupera l'utente tramite email
    user = get_user_by_email(db, email)
    if not user:
        return False  # Utente non trovato
    
    # Verifica se la password fornita corrisponde all'hash salvato
    if not verify_password(password, user.hashed_password):
        return False  # La password non è corretta
    
    return user  # Ritorna l'utente autenticato

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()