DEFAULT_TREATMENT = (
    "Remove severely affected leaves, isolate infected plants where possible, and consult a local agricultural expert "
    "for crop-specific pesticide or fungicide use."
)

DEFAULT_PREVENTION = (
    "Use clean tools, maintain proper spacing, avoid overhead watering, rotate crops, and monitor leaves regularly for "
    "early symptoms."
)

GUIDANCE = {
    "healthy": {
        "treatment": "No disease treatment is required. Continue regular watering, nutrition, and field monitoring.",
        "prevention": "Maintain balanced irrigation, remove debris, inspect leaves weekly, and keep plants well-spaced.",
    },
    "Early_blight": {
        "treatment": "Remove infected leaves and apply a recommended copper-based or chlorothalonil fungicide when needed.",
        "prevention": "Avoid overhead irrigation, mulch around plants, rotate crops, and keep foliage dry.",
    },
    "Late_blight": {
        "treatment": "Remove infected plants quickly and apply locally approved fungicide under expert guidance.",
        "prevention": "Use resistant varieties, improve airflow, avoid wet foliage, and destroy infected crop residue.",
    },
    "Bacterial_spot": {
        "treatment": "Remove affected leaves and use copper-based bactericide where recommended by local guidelines.",
        "prevention": "Use certified disease-free seed, avoid working with wet plants, and sanitize tools.",
    },
    "Powdery_mildew": {
        "treatment": "Prune affected growth and apply sulfur, potassium bicarbonate, or an approved fungicide.",
        "prevention": "Improve air circulation, avoid excess nitrogen, and select resistant varieties.",
    },
    "Apple_scab": {
        "treatment": "Remove infected leaves and apply a recommended protective fungicide during risk periods.",
        "prevention": "Prune for airflow, clear fallen leaves, and use resistant apple cultivars when possible.",
    },
    "Black_rot": {
        "treatment": "Prune infected tissue and remove mummified fruit or damaged leaves from the field.",
        "prevention": "Sanitize pruning tools, remove crop debris, and protect plants during warm humid periods.",
    },
    "Cedar_apple_rust": {
        "treatment": "Remove nearby cedar galls where practical and apply a recommended fungicide early in the season.",
        "prevention": "Plant resistant varieties and separate apple trees from alternate cedar hosts when possible.",
    },
    "Common_rust_": {
        "treatment": "Apply a labeled fungicide if infection is severe or appears early in crop development.",
        "prevention": "Choose resistant hybrids, remove volunteer corn, and monitor fields in humid weather.",
    },
    "Tomato_Yellow_Leaf_Curl_Virus": {
        "treatment": "Remove infected plants and manage whitefly populations with integrated pest management.",
        "prevention": "Use resistant varieties, insect netting, weed control, and reflective mulch where suitable.",
    },
    "Tomato_mosaic_virus": {
        "treatment": "Remove infected plants and disinfect tools, hands, trays, and supports.",
        "prevention": "Use virus-free seed, avoid tobacco contamination, and sanitize greenhouse equipment.",
    },
}


def get_guidance(class_name):
    if "healthy" in class_name.lower():
        return GUIDANCE["healthy"]

    for key, guidance in GUIDANCE.items():
        if key in class_name:
            return guidance

    return {
        "treatment": DEFAULT_TREATMENT,
        "prevention": DEFAULT_PREVENTION,
    }
