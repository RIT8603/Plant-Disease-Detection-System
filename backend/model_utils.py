import hashlib
import pickle
from pathlib import Path

import numpy as np
from PIL import Image, UnidentifiedImageError

from image_features import extract_image_features
from treatments import get_guidance


CLASS_NAMES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
]


class PredictionService:
    def __init__(self, model_path):
        self.model_path = Path(model_path) if model_path else self._default_model_path()
        self.class_names = CLASS_NAMES
        self.model_error = None
        self.model_kind = None
        self.validation_accuracy = None
        self.model = self._load_model()

    @property
    def model_loaded(self):
        return self.model is not None

    def predict(self, image_file):
        image = self._read_image(image_file)
        if self.model_loaded:
            class_index, confidence = self._predict_with_model(image)
            note = (
                "The model is uncertain about this image. Try a sharper, well-lit leaf photo on a plain background."
                if confidence < 55
                else None
            )
        else:
            class_index, confidence = self._demo_prediction(image_file.filename)
            note = (
                "Demo prediction shown because no trained model file was found. "
                "Train a .pkl model or set MODEL_PATH to enable live inference."
            )

        raw_label = self.class_names[class_index]
        guidance = get_guidance(raw_label)

        return {
            "disease": format_label(raw_label),
            "confidence": round(confidence, 2),
            "category": "Healthy" if "healthy" in raw_label.lower() else "Disease",
            "treatment": guidance["treatment"],
            "prevention": guidance["prevention"],
            "raw_class": raw_label,
            "modelLoaded": self.model_loaded,
            "note": note,
        }

    def _load_model(self):
        if not self.model_path.exists():
            return None

        if self.model_path.suffix.lower() == ".pkl":
            return self._load_pickle_model()

        try:
            from tensorflow.keras.models import load_model

            self.model_kind = "keras"
            return load_model(self.model_path)
        except Exception as exc:
            self.model_error = f"Could not load model at {self.model_path}: {exc}"
            return None

    def _load_pickle_model(self):
        try:
            with self.model_path.open("rb") as file:
                payload = pickle.load(file)
            self.class_names = payload.get("class_names", self.class_names)
            self.validation_accuracy = payload.get("validation_accuracy")
            self.model_kind = "sklearn"
            return payload["model"]
        except Exception as exc:
            self.model_error = f"Could not load pickle model at {self.model_path}: {exc}"
            return None

    def _read_image(self, image_file):
        try:
            stream = getattr(image_file, "stream", image_file)
            return Image.open(stream).convert("RGB")
        except UnidentifiedImageError as exc:
            raise ValueError("The uploaded file is not a valid image.") from exc

    def _predict_with_model(self, image):
        if self.model_kind == "sklearn":
            features = extract_image_features(image).reshape(1, -1)
            class_index = int(self.model.predict(features)[0])
            if hasattr(self.model, "decision_function"):
                scores = np.asarray(self.model.decision_function(features)[0], dtype=np.float64)
                confidence = confidence_from_scores(scores, class_index)
            elif hasattr(self.model, "predict_proba"):
                probabilities = self.model.predict_proba(features)[0]
                confidence = float(np.max(probabilities) * 100)
            else:
                confidence = 100.0
            return class_index, confidence

        image = image.resize((224, 224))
        array = np.asarray(image, dtype=np.float32) / 255.0
        probabilities = self.model.predict(np.expand_dims(array, axis=0), verbose=0)[0]
        class_index = int(np.argmax(probabilities))
        confidence = float(probabilities[class_index] * 100)
        return class_index, confidence

    def _default_model_path(self):
        model_dir = Path(__file__).resolve().parent / "models"
        pickle_model = model_dir / "plant_disease_model.pkl"
        if pickle_model.exists():
            return pickle_model
        return model_dir / "plant_disease_model.keras"

    def _demo_prediction(self, filename):
        digest = hashlib.sha256(filename.encode("utf-8")).hexdigest()
        index = int(digest[:8], 16) % len(self.class_names)
        confidence = 82 + (int(digest[8:10], 16) % 1700) / 100
        return index, min(confidence, 98.8)


def format_label(label):
    crop, _, disease = label.partition("___")
    readable_crop = crop.replace("_", " ").replace(",", "")
    readable_disease = disease.replace("_", " ").replace("(", "").replace(")", "")
    if readable_disease.lower() == "healthy":
        return f"{readable_crop} Healthy"
    return f"{readable_crop} {readable_disease}"


def confidence_from_scores(scores, class_index):
    sorted_scores = np.sort(scores)
    if len(sorted_scores) < 2:
        return 100.0

    margin = float(scores[class_index] - sorted_scores[-2])
    confidence = 100.0 / (1.0 + np.exp(-(margin - 250.0) / 900.0))
    return float(np.clip(confidence, 1.0, 99.0))
