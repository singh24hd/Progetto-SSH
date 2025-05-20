# schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date

# Unified User base for registration
class UserBase(BaseModel):
    email: EmailStr
    nome: str
    cognome: str
    data_nasc: Optional[date] = None
    luogo_nasc: Optional[str] = None
    nazionalità: Optional[str] = None
    telefono: Optional[str] = None
    indirizzo: Optional[str] = None
    cap: Optional[int] = None
    citta: Optional[str] = None
    prov: Optional[str] = None
    cod_fisc: Optional[str] = None
    lingua_madre: Optional[str] = None
    lingua_secondaria: Optional[str] = None
    livello_italiano: Optional[str] = None
    ruolo: Optional[str] = 'student' "either 'student' or 'teacher'"
    insegnante_id: Optional[int] = None

# Unified User schemas
class UserCreate(UserBase):
    hashed_password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nome: Optional[str] = None
    cognome: Optional[str] = None
    data_nasc: Optional[date] = None
    luogo_nasc: Optional[str] = None
    nazionalità: Optional[str] = None
    telefono: Optional[str] = None
    indirizzo: Optional[str] = None
    cap: Optional[int] = None
    citta: Optional[str] = None
    prov: Optional[str] = None
    cod_fisc: Optional[str] = None
    lingua_madre: Optional[str] = None
    lingua_secondaria: Optional[str] = None
    livello_italiano: Optional[str] = None
    hashed_password: Optional[str] = None
    ruolo: Optional[str] = None
    insegnante_id: Optional[int] = None

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

# Channel schemas
class ChannelBase(BaseModel):
    nome: str
    descrizione: str
    lingua: str
    rating: int = 0
    class Config:
        from_attributes = True

class ChannelResponse(ChannelBase):
    id: int

class ChannelRatingUpdate(BaseModel):
    increment: int = Field(..., ge=-5, le=5)

# Application schemas
class ApplicationBase(BaseModel):
    nome: str
    descrizione: str  
    link: str
    lingua: str
    class Config:
        from_attributes = True

class ApplicationResponse(ApplicationBase):
    id: int

# Aliases for backward compatibility
StudentCreate = UserCreate
TeacherCreate = UserCreate
StudentUpdate = UserUpdate
TeacherUpdate = UserUpdate

# Auth schemas
class TokenResponse(BaseModel):
    access_token: str
    role: str

class LoginForm(BaseModel):
    email: EmailStr
    password: str
