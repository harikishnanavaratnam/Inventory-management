from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str
    category: str
    subcategory: str
    age_group: str
    mobility_type: str
    is_real_device: bool
    image_url: str
