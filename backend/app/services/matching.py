from typing import List, Dict
from app.models.product import Product
from sqlmodel import Session, select

YOLO_LABEL_MAPPING = {
    "bicycle": {"category": "vehicle", "subcategory": "bicycle", "mobilitytype": "pedal", "isrealdevice": True},
    "tricycle": {"category": "vehicle", "subcategory": "tricycle", "mobilitytype": "pedal", "isrealdevice": True},
    "motorcycle": {"category": "vehicle", "subcategory": "motorcycle", "mobilitytype": "motor", "isrealdevice": True},
    "scooter": {"category": "vehicle", "subcategory": "scooter", "mobilitytype": "motor", "isrealdevice": True},
    "car": {"category": "vehicle", "subcategory": "car", "mobilitytype": "motor", "isrealdevice": True},
    "doll": {"category": "toy", "subcategory": "doll", "mobilitytype": "toy", "isrealdevice": False},
    "teddy bear": {"category": "toy", "subcategory": "teddy bear", "mobilitytype": "toy", "isrealdevice": False}
}

def infer_product_intent(yolo_labels: List[str]) -> Dict:
    for label in yolo_labels:
        mapped = YOLO_LABEL_MAPPING.get(label.lower())
        if mapped:
            return mapped
    return {"category": "misc", "subcategory": "unknown", "mobilitytype": "unknown", "isrealdevice": None}

def search_inventory(attributes: Dict, session: Session) -> Dict:
    category = attributes.get("category")
    subcategory = attributes.get("subcategory")
    mobilitytype = attributes.get("mobilitytype")
    isrealdevice = attributes.get("isrealdevice")

    def serialize(p: Product):
        return {
            "id": p.id,
            "name": p.name,
            "image_url": p.image_url,
            "description": p.description,
            "category": p.category,
            "subcategory": p.subcategory,
            "agegroup": p.age_group,
            "mobilitytype": p.mobility_type,
            "isrealdevice": p.is_real_device
        }

    # Full match: category, subcategory, mobilitytype, isrealdevice
    full = session.exec(select(Product).where(
        Product.category == category,
        Product.subcategory == subcategory,
        Product.mobility_type == mobilitytype,
        Product.is_real_device == isrealdevice
    )).all()
    if full:
        return {"matched_type": "full", "message": "Exact matches found", "matches": [serialize(p) for p in full]}

    # Partial: category, subcategory, mobilitytype
    partial = session.exec(select(Product).where(
        Product.category == category,
        Product.subcategory == subcategory,
        Product.mobility_type == mobilitytype
    )).all()
    if partial:
        return {"matched_type": "partial", "message": "Related products found", "matches": [serialize(p) for p in partial]}

    # Fallback: category, subcategory
    fallback = session.exec(select(Product).where(
        Product.category == category,
        Product.subcategory == subcategory
    )).all()
    if fallback:
        return {"matched_type": "partial", "message": "Some subcategory matches found", "matches": [serialize(p) for p in fallback]}

    # Fallback: category only
    fallback_cat = session.exec(select(Product).where(Product.category == category)).all()
    if fallback_cat:
        return {"matched_type": "partial", "message": "Some category matches found", "matches": [serialize(p) for p in fallback_cat]}

    return {"matched_type": "none", "message": "No matches found", "matches": []}
