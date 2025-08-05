from sqlmodel import SQLModel, Field
from typing import Optional

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    category: str
    subcategory: str
    age_group: str
    mobility_type: str
    is_real_device: bool
    image_url: str