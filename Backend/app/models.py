from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, Text
from sqlalchemy.orm import relationship
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    nome = Column(String(100), nullable=False)
    cognome = Column(String(100), nullable=False)
    data_nasc = Column(Date, nullable=False)
    luogo_nasc = Column(String(100))
    nazionalità = Column(String(100))
    telefono = Column(String(20))
    indirizzo = Column(String(255))
    cap = Column(Integer)
    citta = Column(String(100))
    prov = Column(String(100))
    cod_fisc = Column(String(50))
    hashed_password = Column(String(255), nullable=False)
    lingua_madre = Column(String(50))
    lingua_secondaria = Column(String(50))
    livello_italiano = Column(String(50))
    insegnante_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)

    insegnante = relationship("Teacher", back_populates="studenti")


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    nome = Column(String(100), nullable=False)
    cognome = Column(String(100), nullable=False)
    data_nasc = Column(Date, nullable=False)
    luogo_nasc = Column(String(100))
    nazionalità = Column(String(100))
    telefono = Column(String(20))
    indirizzo = Column(String(255))
    cap = Column(Integer)
    citta = Column(String(100))
    prov = Column(String(100))
    cod_fisc = Column(String(50))
    hashed_password = Column(String(255), nullable=False)
    lingua_madre = Column(String(50))
    lingua_secondaria = Column(String(50))
    livello_italiano = Column(String(50))
    codice_insegnante = Column(String(100), nullable=True)

    studenti = relationship("Student", back_populates="insegnante")


class Channel(Base):
    __tablename__ = "channels"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    link = Column(String(255), nullable=False)
    descrizione = Column(Text, nullable=True)
    lingua = Column(String(50))
    rating = Column(Integer, default=0)


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    link = Column(String(255), nullable=False)
    descrizione = Column(Text, nullable=True)
    lingua = Column(String(50))
