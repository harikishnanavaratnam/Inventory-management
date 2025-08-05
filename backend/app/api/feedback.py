from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.db.session import get_session
from app.models.feedback import Feedback
from pydantic import BaseModel
import json
from datetime import datetime

router = APIRouter()

class FeedbackRequest(BaseModel):
    feedback: str
    image_url: str = None
    inferred_labels: list = []
    attributes: dict = None
    timestamp: str = None

@router.post('/feedback/')
async def receive_feedback(data: FeedbackRequest, session: Session = Depends(get_session)):
    feedback = Feedback(
        feedback=data.feedback,
        image_url=data.image_url,
        inferred_labels=','.join(data.inferred_labels) if data.inferred_labels else None,
        attributes=json.dumps(data.attributes) if data.attributes else None,
        timestamp=datetime.fromisoformat(data.timestamp) if data.timestamp else datetime.utcnow()
    )
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    return {'message': 'Feedback received', 'id': feedback.id} 