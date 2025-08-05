from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import products, posts, auth, match
from app.api import feedback
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, tags=["Products"])
app.include_router(posts.router, tags=["Posts"])
app.include_router(auth.router, tags=["Auth"])
app.include_router(match.router, tags=["Match"])
app.include_router(feedback.router, tags=["Feedback"])