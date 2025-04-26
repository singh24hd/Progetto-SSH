

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configurazione database
SQLALCHEMY_DATABASE_URL = "sqlite:///./channels.db"
# Per PostgreSQL: "postgresql://user:password@localhost/dbname"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}  # Solo per SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dipendenza per ottenere la sessione DB"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()