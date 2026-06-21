# Plant Disease Detection System

<p align="center">
  <strong>PlantDx</strong> is a full-stack machine learning web platform that predicts plant leaf diseases from uploaded images and returns actionable treatment and prevention guidance.
</p>

<p align="center">
  <img alt="Python" src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white">
  <img alt="Flask" src="https://img.shields.io/badge/Flask-API-000000?style=for-the-badge&logo=flask&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111111">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img alt="scikit-learn" src="https://img.shields.io/badge/scikit--learn-Model-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white">
</p>

---

## GitHub Repository Link

> Add your public GitHub repository URL here after uploading the project.

```text
https://github.com/RIT8603/Plant-Disease-Detection-System
```

## Dataset Link

This project uses the New Plant Diseases Dataset from Kaggle:

[New Plant Diseases Dataset - Kaggle](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset)

## Demo Website Link

> Add your deployed website URL here after hosting the frontend and backend.

[Project Preview](https://plant-disease-frontend-9zza.onrender.com/)


---

## Overview

Plant diseases can reduce crop quality and yield when symptoms are not identified early. PlantDx helps users upload a leaf image, run disease detection through a Flask prediction API, and receive a readable diagnosis with confidence, disease category, treatment guidance, and prevention tips.

The platform includes a modern React interface, local prediction history, a trained machine learning model, and a backend API designed for image upload inference.

## Features

- Image upload with drag-and-drop support
- Leaf preview before prediction
- Flask `/predict` API for real-time model inference
- Disease name, health category, and confidence score
- Treatment and prevention recommendations
- Local browser prediction history
- Responsive React and Tailwind CSS interface
- Model health endpoint for backend diagnostics
- Graceful uncertainty messaging for low-confidence predictions
- Reproducible training workflow from the Kaggle dataset

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Lucide React |
| Backend | Python, Flask, Flask-CORS |
| Machine Learning | scikit-learn, NumPy, Pillow |
| Model Artifact | Pickle model stored at `backend/models/plant_disease_model.pkl` |
| Dataset | Kaggle New Plant Diseases Dataset |

## Project Structure

```text
Plant-Disease-Detection-System/
|-- backend/
|   |-- app.py
|   |-- image_features.py
|   |-- model_utils.py
|   |-- train_pkl_model.py
|   |-- treatments.py
|   |-- requirements.txt
|   `-- models/
|       `-- plant_disease_model.pkl
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   `-- services/
|   |-- package.json
|   `-- vite.config.js
|-- Dataset/
|-- Week 1/
|-- Week 2/
|   `-- Plant_Disease_Detection_System.ipynb
`-- README.md
```

## Dataset

The dataset is organized into class folders where each folder represents a plant disease or healthy class.

Expected dataset layout:

```text
Dataset/
`-- New Plant Diseases Dataset(Augmented)/
    `-- New Plant Diseases Dataset(Augmented)/
        |-- train/
        |   |-- Apple___Apple_scab/
        |   |-- Tomato___Early_blight/
        |   `-- ...
        `-- valid/
            |-- Apple___Apple_scab/
            |-- Tomato___Early_blight/
            `-- ...
```

Dataset details used during the latest training run:

| Split | Images |
| --- | ---: |
| Training | 70,295 |
| Validation | 17,572 |
| Classes | 38 |

Note: The Kaggle archive may contain duplicate paths that differ only by letter case. On Windows, those paths are merged during extraction because the filesystem is case-insensitive. This is expected and does not remove useful unique training data.

## Model Details

The current deployed model is a scikit-learn pipeline trained on handcrafted image features extracted from each leaf image.

Feature extraction includes:

- Downsampled RGB thumbnail features
- RGB color histograms
- HSV color histograms
- Mean and standard deviation color statistics
- Histogram of oriented gradients style texture features
- Edge density statistics

Classifier:

- `StandardScaler`
- `SGDClassifier`
- Multiclass disease classification across 38 classes

Latest validation result:

```text
Validation accuracy: 84.77%
```

The model file is saved at:

```text
backend/models/plant_disease_model.pkl
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Plant-Disease-Detection-System.git
cd Plant-Disease-Detection-System
```

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

```bash
# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask API:

```bash
python app.py
```

The backend runs at:

```text
http://127.0.0.1:5000
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://127.0.0.1:5173
```

If your backend runs on a different URL, create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://127.0.0.1:5000
```

## Usage

1. Start the Flask backend.
2. Start the React frontend.
3. Open the app in your browser.
4. Go to the prediction page.
5. Upload a clear plant leaf image.
6. Click `Detect Disease`.
7. Review the predicted disease, confidence score, treatment, and prevention guidance.

For best results, use a clear, well-lit image with one leaf in focus and minimal background clutter.

## API Documentation

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "model_loaded": true,
  "model_error": null,
  "validation_accuracy": 0.8476553608012748,
  "classes": 38
}
```

### Predict Disease

```http
POST /predict
```

Request type:

```text
multipart/form-data
```

Form field:

```text
image: JPG, JPEG, or PNG file
```

Example response:

```json
{
  "disease": "Apple Cedar apple rust",
  "confidence": 51.79,
  "category": "Disease",
  "treatment": "Remove nearby cedar galls where practical and apply a recommended fungicide early in the season.",
  "prevention": "Plant resistant varieties and separate apple trees from alternate cedar hosts when possible.",
  "raw_class": "Apple___Cedar_apple_rust",
  "modelLoaded": true,
  "note": "The model is uncertain about this image. Try a sharper, well-lit leaf photo on a plain background."
}
```

## Retraining the Model

Make sure the Kaggle dataset is extracted under the `Dataset` folder, then run:

```bash
python backend/train_pkl_model.py ^
  --train-dir "Dataset\New Plant Diseases Dataset(Augmented)\New Plant Diseases Dataset(Augmented)\train" ^
  --valid-dir "Dataset\New Plant Diseases Dataset(Augmented)\New Plant Diseases Dataset(Augmented)\valid" ^
  --output "backend\models\plant_disease_model.pkl" ^
  --batch-size 512 ^
  --max-iter 25 ^
  --alpha 0.00001
```

For macOS/Linux, use backslashes only inside folder names and replace `^` with `\` for line continuation.

You can also use the notebook:

```text
Week 2/Plant_Disease_Detection_System.ipynb
```

After retraining, restart the Flask backend so it loads the new model file.

## Results

| Metric | Value |
| --- | ---: |
| Classes | 38 |
| Training images | 70,295 |
| Validation images | 17,572 |
| Validation accuracy | 84.77% |

Sample verified predictions:

| Image | Prediction |
| --- | --- |
| `AppleCedarRust2.JPG` | `Apple___Cedar_apple_rust` |
| `AppleScab2.JPG` | `Apple___Apple_scab` |
| `PotatoEarlyBlight1.JPG` | `Potato___Early_blight` |
| `CornCommonRust1.JPG` | `Corn_(maize)___Common_rust_` |

## Limitations

- The model is intended for educational and prototype use.
- Predictions depend heavily on image quality, lighting, angle, and background.
- Some visually similar diseases can still be confused.
- The result should not replace expert agricultural advice.
- For production-grade accuracy, a transfer-learning CNN or vision transformer model would be recommended.

## Roadmap

- Add user authentication
- Store prediction history in a database
- Add Grad-CAM or visual explanation overlays
- Deploy frontend and backend to a cloud platform
- Add mobile camera capture support
- Train a deep learning model for higher real-world accuracy

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request with a clear description.

## License

This project is currently provided for educational use. Add a license file such as `MIT`, `Apache-2.0`, or another license before publishing if you want others to reuse or contribute to the project.

## Acknowledgements

- Kaggle dataset by `vipoooool`
- PlantVillage-style plant disease image classes
- Flask, React, Vite, Tailwind CSS, and scikit-learn open-source communities
