from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.product import Product
from app.schemas.product import ProductCreate

router = APIRouter()

@router.post("/products/", response_model=Product)
def create_product(product_data: ProductCreate, session: Session = Depends(get_session)):
    product = Product(**product_data.dict())
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

@router.get("/products/", response_model=list[Product])
def list_products(session: Session = Depends(get_session)):
    return session.exec(select(Product)).all()

@router.put("/products/{product_id}", response_model=Product)
def update_product(product_id: int, product_data: ProductCreate, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        return {"error": "Product not found"}
    product.name = product_data.name
    product.description = product_data.description
    product.category = product_data.category
    product.subcategory = product_data.subcategory
    product.age_group = product_data.age_group
    product.mobility_type = product_data.mobility_type
    product.is_real_device = product_data.is_real_device
    product.image_url = product_data.image_url
    session.add(product)
    session.commit()
    session.refresh(product)
    return product
