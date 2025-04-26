from sqlalchemy.orm import Session
from . import models, schemas

def create_channel(db: Session, channel: schemas.ChannelCreate):
    # Validazione aggiuntiva
    if channel.rating < 1 or channel.rating > 5:
        raise ValueError("Rating must be between 1 and 5")
    
    db_channel = models.ChannelDB(
        name=channel.name,
        url=channel.url,
        level=channel.level.upper(),  # Converti in maiuscolo
        rating=channel.rating
    )
    
    db.add(db_channel)
    db.commit()
    db.refresh(db_channel)
    return db_channel

def get_channel(db: Session, channel_id: int):
    return db.query(models.ChannelDB).filter(models.ChannelDB.id == channel_id).first()

def get_channels(db: Session, skip: int = 0, limit: int = 100, level: str = None, min_rating: int = None):
    query = db.query(models.ChannelDB)
    
    if level:
        query = query.filter(models.ChannelDB.level == level.upper())
    
    if min_rating:
        query = query.filter(models.ChannelDB.rating >= min_rating)
        
    return query.offset(skip).limit(limit).all()

def update_channel(db: Session, channel_id: int, channel: schemas.ChannelUpdate):
    db_channel = get_channel(db, channel_id)
    if not db_channel:
        return None
    
    for key, value in channel.dict(exclude_unset=True).items():
        setattr(db_channel, key, value)
    
    db.commit()
    db.refresh(db_channel)
    return db_channel