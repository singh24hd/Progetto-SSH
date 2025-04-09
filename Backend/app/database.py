from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database configuration, adjust as needed
User     = os.getenv("MYSQL_USER", "root")
Password = os.getenv("MYSQL_PASSWORD", "fermi")
Dbase    = os.getenv("MYSQL_DB", "test")
IP       = os.getenv("MYSQL_HOST", "127.0.0.1")
Port     = os.getenv("MYSQL_PORT", "3306")

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{User}:{Password}@{IP}:{Port}/{Dbase}"

engine = create_engine(
    # SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}    # SQLite needs {"check_same_thread": False}
    SQLALCHEMY_DATABASE_URL, connect_args={}                                # not mysql.
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()