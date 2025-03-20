from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pymysql
import os

# Database, default values
User     = "root"
Password = "fermi"
Dbase    = "test"
IP       = "127.0.0.1"
Port     = "3306"

if os.getenv("MYSQL_USER") != None :
    User = os.getenv("MYSQL_USER")

if os.getenv("MYSQL_PASSWORD") != None :
    Password = os.getenv("MYSQL_PASSWORD")

if os.getenv("MYSQL_HOST") != None :
    IP = os.getenv("MYSQL_HOST")

if os.getenv("MYSQL_DB") != None :
    Dbase = os.getenv("MYSQL_DB")

if os.getenv("MYSQL_PORT") != None :
    Port = os.getenv("MYSQL_PORT")


SQLALCHEMY_DATABASE_URL = "mysql+pymysql://" + User + ":" +  Password + "@" + IP + ":" + Port + "/" + Dbase

engine = create_engine(
    # SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}    # SQLite needs {"check_same_thread": False}
    SQLALCHEMY_DATABASE_URL, connect_args={}                                # not mysql.
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
