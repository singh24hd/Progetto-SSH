from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date
from sqlalchemy.orm import relationship

from .database import Base


class Studente(Base):
    __tablename__ = "studenti"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(20), unique=False, index=True)
    cognome = Column(String(20), unique=False, index=True)
    data_nasc = Column(Date(50), unique=False, index=True)
    luogo_nasc = Column(String(50), unique=False, index=True)
    nazionalità = Column(String(50), unique=False, index=True)
    telefono = Column(String(12), unique=True, index=True)
    email = Column(String(50), unique=True, index=True)     # Mysql dialect needs VARCHAR length. Added length to String column
    indirizzo = Column(String(50), unique=False, index=True)
    cap = Column(Integer, unique=False, index=True)
    citta = Column(String(50), unique=False, index=True)
    prov = Column(String(50), unique=False, index=True)
    cod_fisc = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(50))

    #items = relationship("Item", back_populates="owner")


class Professore(Base):
    __tablename__ = "professori"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), index=True)
    description = Column(String(50), index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")
