from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, Text
from sqlalchemy.orm import relationship

from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    nome = Column(String)
    cognome = Column(String)
    data_nasc = Column(Date)
    luogo_nasc = Column(String)
    nazionalità = Column(String)
    telefono = Column(String)
    indirizzo = Column(String)
    cap = Column(Integer)
    citta = Column(String)
    prov = Column(String)
    cod_fisc = Column(String)
    hashed_password = Column(String)
    lingua_madre = Column(String)
    lingua_secondaria = Column(String)
    livello_italiano = Column(String)
    insegnante_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)

    insegnante = relationship("Teacher", backref="studenti")


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    nome = Column(String)
    cognome = Column(String)
    data_nasc = Column(Date)
    luogo_nasc = Column(String)
    nazionalità = Column(String)
    telefono = Column(String)
    indirizzo = Column(String)
    cap = Column(Integer)
    citta = Column(String)
    prov = Column(String)
    cod_fisc = Column(String)
    hashed_password = Column(String)
    lingua_madre = Column(String)
    lingua_secondaria = Column(String)
    livello_italiano = Column(String)
    codice_insegnante = Column(String, nullable=True)


class Channel(Base):
    __tablename__ = "channels"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    link = Column(String)
    descrizione = Column(Text)
    lingua = Column(String)
    rating = Column(Integer, default=0)


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    link = Column(String(200))
    descrizione = Column(Text)
    lingua = Column(String)
