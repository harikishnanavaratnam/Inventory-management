import firebase_admin
from firebase_admin import credentials, storage
import os

if not firebase_admin._apps:
    cred_path = os.path.join(os.path.dirname(__file__), "../../firebase_adminsdk.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'thivithan-now.firebasestorage.app'
    })

bucket = storage.bucket()

def upload_image_stream(file_data: bytes, destination_blob_name: str) -> str:
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_string(file_data, content_type="image/jpeg")
    blob.make_public()
    return blob.public_url