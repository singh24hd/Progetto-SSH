from pydantic import BaseModel, Field
from typing import Optional

class ChannelBase(BaseModel):
    name: str = Field(..., max_length=100)
    url: str = Field(..., max_length=500)
    level: str = Field(..., regex="^[A-B][1-2]$|^C1$")  # Regex per A1, A2, B1, B2, C1
    rating: int = Field(..., ge=1, le=5)  # 1-5

class ChannelCreate(ChannelBase):
    pass

class ChannelUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    url: Optional[str] = Field(None, max_length=500)
    level: Optional[str] = Field(None, regex="^[A-B][1-2]$|^C1$")
    rating: Optional[int] = Field(None, ge=1, le=5)

class ChannelResponse(ChannelBase):
    id: int
    
    class Config:
        orm_mode = True