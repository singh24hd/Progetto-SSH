from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class UserBase(BaseModel):
    nome: str
    cognome: str
    data_nasc: date
    luogo_nasc: str
    nazionalità: str
    telefono: str
    email: str
    indirizzo: str
    cap: int
    citta: str
    prov: str
    cod_fisc: str
    ruolo: str  # 'studente' or 'insegnante'

class UserCreate(BaseModel):
    nome: str
    cognome: str
    data_nasc: date
    luogo_nasc: str
    nazionalità: str
    telefono: str
    email: str
    indirizzo: str
    cap: int
    citta: str
    prov: str
    cod_fisc: str
    ruolo: str  # 'studente' or 'insegnante'
    password: str  # Plain password that will be hashed

class UserResponse(BaseModel):
    id: int
    nome: str
    cognome: str
    data_nasc: date
    luogo_nasc: str
    nazionalità: str
    telefono: str
    email: str
    indirizzo: str
    cap: int
    citta: str
    prov: str
    cod_fisc: str
    role: str  # Standardized role format: 'student' or 'teacher'
    
    class Config:
        orm_mode = True

class LoginForm(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    role: str  # Standardized role