from sqlalchemy import Column, Integer, String, Date, Boolean
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(20))
    cognome = Column(String(20))
    data_nasc = Column(Date)
    luogo_nasc = Column(String(50))
    nazionalità = Column(String(50))
    telefono = Column(String(12))
    email = Column(String(50), unique=True, index=True)
    indirizzo = Column(String(50))
    cap = Column(Integer)
    citta = Column(String(50))
    prov = Column(String(50))
    cod_fisc = Column(String(50), unique=True)
    hashed_password = Column(String(72))
    ruolo = Column(String(10))  # 'studente' o 'insegnante'
class Channels(Base):
    __tablename__ = "channels"
    id = Column(Integer, primary_key=True, index=True)
    link = Column(String(50), unique=True, index=True)
    descrizione = Column(String(200))
    rating = Column(Integer)
    native_language = Column(String(50))
class Applications(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    link = Column(String(50), unique=True, index=True)
    descrizione = Column(String(200))
    rating = Column(Integer)
    native_language = Column(String(50))