from pydantic import BaseModel
from datetime import date
from typing import Optional, List

# Base schema with all common fields shared between create and update operations
class StudenteBase(BaseModel):
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
    hashed_password: str

# Schema used when creating a new student. Inherits all fields from StudenteBase.
class StudenteCreate(StudenteBase):
    pass

# Schema for updating a student. All fields are optional so that the client can provide only the fields to update.
class StudenteUpdate(BaseModel):
    nome: Optional[str] = None
    cognome: Optional[str] = None
    data_nasc: Optional[date] = None
    luogo_nasc: Optional[str] = None
    nazionalità: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    indirizzo: Optional[str] = None
    cap: Optional[int] = None
    citta: Optional[str] = None
    prov: Optional[str] = None
    cod_fisc: Optional[str] = None
    hashed_password: Optional[str] = None
    # You can add other optional fields like is_active if needed
    is_active: Optional[bool] = None

    class Config:
        orm_mode = True

# Schema for sending student responses to the client
class StudenteResponse(StudenteBase):
    id: int
    # Adding an active flag or any other additional information
    is_active: bool = True
    # If there are any related items, they can be represented as a list. Adjust as needed.
    items: Optional[List] = []

    class Config:
        orm_mode = True
