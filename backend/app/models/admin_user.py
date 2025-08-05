from sqlmodel import SQLModel, Field
from typing import Optional

class AdminUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    password_hash: str
