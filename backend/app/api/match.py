from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session
from app.db.session import get_session
from app.services.yoloinference import detect_objects
from app.services.matching import infer_product_intent, search_inventory
import requests

router = APIRouter()

class MatchRequest(BaseModel):
    image_url: str

@router.post("/match/")
async def match_product(
    data: MatchRequest,
    session: Session = Depends(get_session)
):
    try:
        # Download the image from the URL
        response = requests.get(data.image_url)
        response.raise_for_status()
        file_bytes = response.content

        labels = detect_objects(file_bytes)
        attributes = infer_product_intent(labels)
        match_result = search_inventory(attributes, session)

        return {
            "inferred_labels": labels,
            "attributes": attributes,
            "match_result": match_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))