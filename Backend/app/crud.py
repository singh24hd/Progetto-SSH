import bcrypt
from sqlalchemy.orm import Session
from .models import Studente
from . import schemas

# Hashing function for passwords
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# CRUD function to create a student
def create_studente(db: Session, user: schemas.StudenteCreate):
    hashed_password = hash_password(user.hashed_password)
    db_studente = Studente(
        nome=user.nome,
        cognome=user.cognome,
        data_nasc=user.data_nasc,
        luogo_nasc=user.luogo_nasc,
        nazionalità=user.nazionalità,
        telefono=user.telefono,
        email=user.email,
        indirizzo=user.indirizzo,
        cap=user.cap,
        citta=user.citta,
        prov=user.prov,
        cod_fisc=user.cod_fisc,
        hashed_password=hashed_password
    )
    db.add(db_studente)
    db.commit()  # Save changes to the database
    db.refresh(db_studente)  # Refresh the instance with updated data
    return db_studente
