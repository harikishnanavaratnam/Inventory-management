from sqlmodel import SQLModel
from app.db.session import engine
from app.models import product, post, admin_user
from app.models import feedback
from app.models.product import Product
from sqlmodel import Session
from sqlalchemy import select

def init_db():
    SQLModel.metadata.create_all(engine)
    # Add demo products if not already present
    with Session(engine) as session:
        if not session.exec(select(Product)).first():
            demo_products = [
                Product(name="Kids Bicycle", description="A small pedal bicycle for kids.", category="vehicle", subcategory="bicycle", age_group="kids", mobility_type="pedal", is_real_device=True, image_url="https://via.placeholder.com/150?text=Kids+Bicycle"),
                Product(name="Kids Tricycle", description="A tricycle for toddlers.", category="vehicle", subcategory="tricycle", age_group="toddlers", mobility_type="pedal", is_real_device=True, image_url="https://via.placeholder.com/150?text=Kids+Tricycle"),
                Product(name="Electric Scooter", description="A motorized scooter.", category="vehicle", subcategory="scooter", age_group="teens", mobility_type="motor", is_real_device=True, image_url="https://via.placeholder.com/150?text=Electric+Scooter"),
                Product(name="Toy Car", description="A small toy car.", category="toy", subcategory="car", age_group="kids", mobility_type="toy", is_real_device=False, image_url="https://via.placeholder.com/150?text=Toy+Car"),
                Product(name="Doll", description="A classic doll toy.", category="toy", subcategory="doll", age_group="kids", mobility_type="toy", is_real_device=False, image_url="https://via.placeholder.com/150?text=Doll"),
                Product(name="Teddy Bear", description="A soft teddy bear.", category="toy", subcategory="teddy bear", age_group="kids", mobility_type="toy", is_real_device=False, image_url="https://via.placeholder.com/150?text=Teddy+Bear"),
                Product(name="Motorcycle", description="A real motorcycle for adults.", category="vehicle", subcategory="motorcycle", age_group="adults", mobility_type="motor", is_real_device=True, image_url="https://via.placeholder.com/150?text=Motorcycle"),
            ]
            session.add_all(demo_products)
            session.commit()

if __name__ == "__main__":
    init_db()
