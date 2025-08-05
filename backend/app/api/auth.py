from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.admin_user import AdminUser
from app.schemas.admin_user import AdminLogin
from app.utils.auth import verify_password, create_jwt

router = APIRouter()

@router.post("/admin/login")
def login_admin(data: AdminLogin, session: Session = Depends(get_session)):
    admin = session.exec(select(AdminUser).where(AdminUser.email == data.email)).first()
    if not admin or not verify_password(data.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_jwt(data.email)
    return {"access_token": token}
