from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date

# Student schemas
class StudentBase(BaseModel):
    email: EmailStr
    nome: str
    cognome: str
    data_nasc: Optional[date] = None
    luogo_nasc: Optional[str] = None
    nazionalita: Optional[str] = None
    telefono: Optional[str] = None
    indirizzo: Optional[str] = None
    cap: Optional[int] = None
    citta: Optional[str] = None
    prov: Optional[str] = None
    cod_fisc: Optional[str] = None
    lingua_madre: Optional[str] = None
    lingua_secondaria: Optional[str] = None
    livello_italiano: Optional[str] = None

class StudentCreate(StudentBase):
    hashed_password: str
    insegnante_id: Optional[int] = None

class StudentUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nome: Optional[str] = None
    cognome: Optional[str] = None
    data_nasc: Optional[date] = None
    luogo_nasc: Optional[str] = None
    nazionalita: Optional[str] = None
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
    insegnante_id: Optional[int] = None

class StudentResponse(StudentBase):
    id: int
    insegnante_id: Optional[int] = None
    class Config:
        orm_mode = True

# Teacher schemas
class TeacherBase(BaseModel):
    email: EmailStr
    nome: str
    cognome: str
    data_nasc: Optional[date] = None
    luogo_nasc: Optional[str] = None
    nazionalita: Optional[str] = None
    telefono: Optional[str] = None
    indirizzo: Optional[str] = None
    cap: Optional[int] = None
    citta: Optional[str] = None
    prov: Optional[str] = None
    cod_fisc: Optional[str] = None
    lingua_madre: Optional[str] = None
    lingua_secondaria: Optional[str] = None
    livello_italiano: Optional[str] = None
    codice_insegnante: Optional[str] = None

class TeacherCreate(TeacherBase):
    hashed_password: str

class TeacherUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nome: Optional[str] = None
    cognome: Optional[str] = None
    data_nasc: Optional[date] = None
    luogo_nasc: Optional[str] = None
    nazionalita: Optional[str] = None
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
    codice_insegnante: Optional[str] = None

class TeacherResponse(TeacherBase):
    id: int
    class Config:
        orm_mode = True

# Channel schemas
class ChannelBase(BaseModel):
    nome: str
    descrizione: str
    lingua: str
    rating: int = 0
    class Config:
        orm_mode = True

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
        orm_mode = True

class ApplicationResponse(ApplicationBase):
    id: int


# Token and Auth schemas
class TokenResponse(BaseModel):
    access_token: str
    role: str

class LoginForm(BaseModel):
    email: EmailStr
    password: str
