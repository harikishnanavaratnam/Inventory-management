from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlmodel import Session, select
from app.services.firebaseclient import upload_image_stream
from app.db.session import get_session
from app.models.post import Post
from uuid import uuid4

router = APIRouter()

@router.post("/posts/", response_model=Post)
async def create_post(
    description: str = Form(...),
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    try:
        file_bytes = await file.read()
        firebase_path = f"posts/{uuid4()}_{file.filename}"
        image_url = upload_image_stream(file_bytes, firebase_path)

        post = Post(description=description, image_url=image_url, matched_products=None)
        session.add(post)
        session.commit()
        session.refresh(post)

        return post

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/posts/", response_model=list[Post])
def list_posts(session: Session = Depends(get_session)):
    return session.exec(select(Post)).all()