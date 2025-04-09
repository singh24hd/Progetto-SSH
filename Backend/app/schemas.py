from pydantic import BaseModel
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
    ruolo: str  # 'studente' o 'insegnante'

class UserCreate(UserBase):
    hashed_password: str  # This should ideally be renamed to 'password'

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True

class LoginForm(BaseModel):
    username: str  # Using email as username
    password: str

class TokenResponse(BaseModel):
    access_token: str
    role: str