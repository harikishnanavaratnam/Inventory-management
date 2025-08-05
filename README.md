# Project Overview

This project is a full-stack web application for product and post management, featuring:
- A React frontend for user/admin interaction
- A FastAPI backend with endpoints for products, posts, matching, feedback, and authentication
- YOLOv8-based image inference for product recognition
- Firebase integration for image storage
- PostgreSQL database via SQLModel/SQLAlchemy

---

## Directory Structure

```
Pro/
  backend/           # FastAPI backend
    app/
      api/           # API route handlers
      config.py      # Configuration
      db/            # Database session/init
      models/        # ORM models
      schemas/       # Pydantic schemas
      services/      # YOLO, Firebase, Matching logic
      utils/         # Utility functions
    requirements.txt # Backend dependencies
    main.py          # FastAPI entrypoint
  frontend-react/    # React frontend
    src/             # React source code
    package.json     # Frontend dependencies
```

---

## Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set environment variables:**
   - Create a `.env` file in `backend/app/` with:
     ```env
     JWT_SECRET=your_jwt_secret
     DATABASE_URL=postgresql://user:password@localhost/dbname
     ```
   - Place your Firebase service account JSON as `backend/firebase_adminsdk.json`.

3. **Run database migrations/init:**
   ```bash
   python -m app.db.init_db
   ```

4. **Start the backend server:**
   ```bash
   uvicorn main:app --reload
   ```

---

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend-react
   npm install
   ```

2. **Start the frontend:**
   ```bash
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000)

---

## API Endpoints (Backend)

### Auth
- `POST /admin/login` — Admin login, returns JWT

### Products
- `POST /products/` — Create a product
- `GET /products/` — List all products
- `PUT /products/{product_id}` — Update a product

### Posts
- `POST /posts/` — Create a post (with image upload)
- `GET /posts/` — List all posts

### Match
- `POST /match/` — Match a product from an image URL (YOLO inference + matching)

### Feedback
- `POST /feedback/` — Submit user feedback (with optional image, labels, attributes)

---

## Services

### YOLO Inference
- Uses `ultralytics` YOLOv8 for object detection on uploaded images.
- Model weights: `backend/yolov8n.pt`

### Firebase Integration
- Stores uploaded images in Firebase Storage using `firebase-admin`.

### Product Matching
- Matches detected objects to products in the database using category, subcategory, and attributes.

### Feedback
- Stores user feedback, including optional image, inferred labels, and attributes.

---

## Backend Dependencies

See `backend/requirements.txt` for the full list. Key packages:
- fastapi, uvicorn, python-dotenv, sqlmodel, sqlalchemy, psycopg2-binary
- pydantic, passlib[bcrypt], python-jose, requests
- ultralytics, pillow, firebase-admin

---

## Environment Variables
- `JWT_SECRET` — Secret for JWT token signing
- `DATABASE_URL` — PostgreSQL connection string
- Firebase service account JSON at `backend/firebase_adminsdk.json`

---

## Running the Full Stack
1. Start the backend (see above)
2. Start the frontend (see above)
3. Access the app at [http://localhost:3000](http://localhost:3000)

---

## Notes
- Ensure PostgreSQL is running and accessible.
- YOLO model weights (`yolov8n.pt`) must be present in `backend/`.
- For production, configure CORS, secrets, and database securely. 