from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Configurazione Database
SQLALCHEMY_DATABASE_URL = "sqlite:///./channels.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modello DB
class ChannelDB(Base):
    __tablename__ = "channels"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True)
    url = Column(String(500))
    level = Column(String(3))  # A1, A2, B1, B2, C1, C2
    rating = Column(Integer)  # 1-5 stelle

Base.metadata.create_all(bind=engine)

# Modelli Pydantic
class ChannelCreate(BaseModel):
    name: str
    url: str
    level: str
    rating: int

class ChannelResponse(ChannelCreate):
    id: int

    class Config:
        orm_mode = True

# Inizializzazione App
app = FastAPI(title="Channel Manager API")

# Dipendenze
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints
@app.post("/channels/", response_model=ChannelResponse)
def create_channel(channel: ChannelCreate, db: Session = Depends(get_db)):
    # Validazione livello
    valid_levels = ["A1", "A2", "B1", "B2", "C1", "C2"]
    if channel.level not in valid_levels:
        raise HTTPException(status_code=400, detail=f"Level must be one of {valid_levels}")
    
    # Validazione rating
    if not 1 <= channel.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    db_channel = ChannelDB(**channel.dict())
    db.add(db_channel)
    db.commit()
    db.refresh(db_channel)
    return db_channel

@app.get("/channels/", response_model=List[ChannelResponse])
def read_channels(level: str = None, min_rating: int = None, db: Session = Depends(get_db)):
    query = db.query(ChannelDB)
    
    if level:
        query = query.filter(ChannelDB.level == level)
    
    if min_rating:
        query = query.filter(ChannelDB.rating >= min_rating)
    
    return query.all()

@app.get("/channels/{channel_id}", response_model=ChannelResponse)
def read_channel(channel_id: int, db: Session = Depends(get_db)):
    channel = db.query(ChannelDB).filter(ChannelDB.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    return channel

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)