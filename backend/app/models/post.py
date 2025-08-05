from sqlmodel import SQLModel, Field
from typing import Optional, Dict
from datetime import datetime
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB

class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    image_url: str
    description: str
    matched_products: Optional[Dict] = Field(default=None, sa_column=Column(JSONB))
    created_at: datetime = Field(default_factory=datetime.utcnow)
