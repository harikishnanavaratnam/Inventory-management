from ultralytics import YOLO
from PIL import Image
import io

model = YOLO("yolov8n.pt")

def detect_objects(file_bytes: bytes):
    image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    results = model(image)
    labels = []
    if results and results[0].boxes:
        for box in results[0].boxes:
            class_id = int(box.cls[0].item())
            label = model.names[class_id]
            labels.append(label)
    return labels
