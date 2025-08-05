from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Feedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    feedback: str
    image_url: Optional[str] = None
    inferred_labels: Optional[str] = None  # Store as comma-separated string or JSON
    attributes: Optional[str] = None       # Store as JSON string
    timestamp: datetime = Field(default_factory=datetime.utcnow) 