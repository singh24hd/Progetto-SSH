from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship

from .database import Base



class Studente(Base):
    __tablename__ = "studenti"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(20), index=True)
    cognome = Column(String(20), index=True)
    data_nasc = Column(Date, index=True)
    luogo_nasc = Column(String(50), index=True)
    nazionalità = Column(String(50), index=True)
    telefono = Column(String(12), index=True)
    email = Column(String(50), unique=True, index=True)
    indirizzo = Column(String(50), index=True)
    cap = Column(Integer, index=True)
    citta = Column(String(50), index=True)
    prov = Column(String(50), index=True)
    cod_fisc = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(72))

    # Optional: If you have a relationship, you can define it here
    # items = relationship("Item", back_populates="owner")
