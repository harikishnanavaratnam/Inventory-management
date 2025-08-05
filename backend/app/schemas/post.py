from pydantic import BaseModel
from typing import Optional, Dict

class PostCreate(BaseModel):
    image_url: str
    description: str
    matched_products: Optional[Dict] = None
