import os
from flask import Flask, jsonify, request
from flask_cors import CORS

from model_utils import PredictionService


app = Flask(__name__)
CORS(app)

prediction_service = PredictionService(
    model_path=os.environ.get("MODEL_PATH")
)


@app.get("/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": prediction_service.model_loaded,
            "model_error": prediction_service.model_error,
            "validation_accuracy": prediction_service.validation_accuracy,
            "classes": len(prediction_service.class_names),
        }
    )


@app.post("/predict")
def predict():
    if "image" not in request.files:
        return jsonify({"error": "Upload an image file using the 'image' field."}), 400

    image_file = request.files["image"]
    if not image_file.filename:
        return jsonify({"error": "The uploaded image is empty."}), 400

    if not is_allowed_file(image_file.filename):
        return jsonify({"error": "Only JPG and PNG images are supported."}), 400

    try:
        result = prediction_service.predict(image_file)
        return jsonify(result)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception:
        app.logger.exception("Prediction failed")
        return jsonify({"error": "Prediction failed. Check the backend logs for details."}), 500


def is_allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in {"jpg", "jpeg", "png"}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_ENV") == "development")
