# crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import logging
from typing import Optional, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Utility

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Student CRUD

def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def get_student_by_email(db: Session, email: str):
    return db.query(models.Student).filter(models.Student.email == email).first()

def get_students(db: Session, teacher_id: Optional[int] = None):
    q = db.query(models.Student)
    if teacher_id:
        q = q.filter(models.Student.insegnante_id == teacher_id)
    return q.all()

def create_student(db: Session, student: schemas.StudentCreate):
    data = student.dict(exclude_unset=True)
    # Remove fields not in Student model
    data.pop("ruolo", None)
    # insegnante_id ok
    data['hashed_password'] = get_password_hash(data.get('hashed_password', ''))
    if data.get('insegnante_id'):
        teacher = get_teacher(db, data['insegnante_id'])
        if not teacher:
            data['insegnante_id'] = None
    db_obj = models.Student(**data)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_student(db: Session, student_id: int, student_update: schemas.StudentUpdate):
    db_obj = get_student(db, student_id)
    if not db_obj:
        return None
    upd = student_update.dict(exclude_unset=True)
    if 'hashed_password' in upd:
        upd['hashed_password'] = get_password_hash(upd['hashed_password'])
    if 'insegnante_id' in upd and upd['insegnante_id']:
        if not get_teacher(db, upd['insegnante_id']):
            upd['insegnante_id'] = None
    for k,v in upd.items(): setattr(db_obj, k, v)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_student(db: Session, student_id: int):
    obj = get_student(db, student_id)
    if obj:
        db.delete(obj)
        db.commit()
        return True
    return False

# Teacher CRUD

def get_teacher(db: Session, teacher_id: int):
    return db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()

def get_teacher_by_email(db: Session, email: str):
    return db.query(models.Teacher).filter(models.Teacher.email == email).first()

def get_teachers(db: Session):
    return db.query(models.Teacher).all()

def create_teacher(db: Session, teacher: schemas.TeacherCreate):
    data = teacher.dict(exclude_unset=True)
    # Remove fields not in Teacher model
    data.pop("ruolo", None)
    data.pop("insegnante_id", None)
    data['hashed_password'] = get_password_hash(data.get('hashed_password', ''))
    db_obj = models.Teacher(**data)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_teacher(db: Session, teacher_id: int, teacher_update: schemas.TeacherUpdate):
    db_obj = get_teacher(db, teacher_id)
    if not db_obj:
        return None
    upd = teacher_update.dict(exclude_unset=True)
    if 'hashed_password' in upd:
        upd['hashed_password'] = get_password_hash(upd['hashed_password'])
    for k,v in upd.items(): setattr(db_obj, k, v)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_teacher(db: Session, teacher_id: int):
    obj = get_teacher(db, teacher_id)
    if obj:
        for s in obj.studenti:
            s.insegnante_id = None
        db.delete(obj)
        db.commit()
        return True
    return False

# Channel & Application

def get_channels(db: Session, lingua: str):
    return db.query(models.Channel).filter(models.Channel.lingua == lingua).all()


def increment_channel_rating(db: Session, channel_id: int, increment: int):
    ch = db.query(models.Channel).filter(models.Channel.id == channel_id).first()
    if ch:
        ch.rating += increment
        db.commit()
        db.refresh(ch)
    return ch

def get_applications(db: Session, lingua: str):
    return db.query(models.Application).filter(models.Application.lingua == lingua).all()

# Authentication

def authenticate_student(db: Session, email: str, password: str):
    stu = get_student_by_email(db, email)
    if stu and verify_password(password, stu.hashed_password): return stu
    return None

def authenticate_teacher(db: Session, email: str, password: str):
    tea = get_teacher_by_email(db, email)
    if tea and verify_password(password, tea.hashed_password): return tea
    return None

# Token creation

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
