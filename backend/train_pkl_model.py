import argparse
import pickle
import random
from pathlib import Path

import numpy as np
from PIL import Image, UnidentifiedImageError
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from image_features import extract_batch_features


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def collect_image_paths(root, max_per_class=None, seed=42):
    root = Path(root)
    samples = []
    class_names = []

    for class_dir in sorted(path for path in root.iterdir() if path.is_dir()):
        paths = sorted(path for path in class_dir.iterdir() if path.suffix.lower() in IMAGE_EXTENSIONS)
        if max_per_class and len(paths) > max_per_class:
            rng = random.Random(seed)
            paths = rng.sample(paths, max_per_class)
        class_index = len(class_names)
        class_names.append(class_dir.name)
        samples.extend((path, class_index) for path in paths)

    if not samples:
        raise ValueError(f"No image files found under {root}")

    random.Random(seed).shuffle(samples)
    return samples, class_names


def batched(items, batch_size):
    for start in range(0, len(items), batch_size):
        yield items[start : start + batch_size]


def load_images(batch):
    images = []
    labels = []
    skipped = 0

    for path, label in batch:
        try:
            with Image.open(path) as image:
                images.append(image.copy())
            labels.append(label)
        except (OSError, UnidentifiedImageError):
            skipped += 1

    return images, np.asarray(labels, dtype=np.int64), skipped


def extract_dataset_features(samples, batch_size, label="images"):
    features = []
    labels = []
    seen = 0
    skipped = 0

    for batch_number, batch in enumerate(batched(samples, batch_size), start=1):
        images, batch_labels, batch_skipped = load_images(batch)
        skipped += batch_skipped
        if not images:
            continue

        features.append(extract_batch_features(images))
        labels.append(batch_labels)
        seen += len(images)

        if batch_number == 1 or batch_number % 20 == 0:
            print(f"extracted {seen}/{len(samples)} {label}")

    if not features:
        raise ValueError(f"No usable {label} were loaded.")

    print(f"feature extraction complete: {seen} {label} used, {skipped} skipped")
    return np.vstack(features), np.concatenate(labels)


def train_model(train_samples, class_names, batch_size, max_iter=25, alpha=0.00001):
    features, labels = extract_dataset_features(train_samples, batch_size, "training images")
    classifier = make_pipeline(
        StandardScaler(),
        SGDClassifier(
            loss="log_loss",
            alpha=alpha,
            penalty="l2",
            max_iter=max_iter,
            tol=0.001,
            learning_rate="optimal",
            average=True,
            random_state=42,
        ),
    )
    classifier.fit(features, labels)
    print(f"training complete: {len(labels)} images used")
    return classifier


def evaluate_model(classifier, valid_samples, class_names, batch_size):
    if not valid_samples:
        return None

    features, truth = extract_dataset_features(valid_samples, batch_size, "validation images")
    predicted = classifier.predict(features)
    accuracy = accuracy_score(truth, predicted)
    print(f"validation accuracy: {accuracy:.4f}")
    print(classification_report(truth, predicted, target_names=class_names, zero_division=0))
    return accuracy


def main():
    parser = argparse.ArgumentParser(description="Train a scikit-learn .pkl plant disease model from image folders.")
    parser.add_argument("--train-dir", required=True)
    parser.add_argument("--valid-dir")
    parser.add_argument("--output", default="models/plant_disease_model.pkl")
    parser.add_argument("--batch-size", type=int, default=128)
    parser.add_argument("--max-per-class", type=int, default=None)
    parser.add_argument("--max-iter", type=int, default=25)
    parser.add_argument("--alpha", type=float, default=0.00001)
    args = parser.parse_args()

    train_samples, class_names = collect_image_paths(args.train_dir, args.max_per_class)
    valid_samples = []
    if args.valid_dir:
        valid_samples, valid_class_names = collect_image_paths(args.valid_dir)
        if valid_class_names != class_names:
            raise ValueError("Validation class folders do not match training class folders.")

    print(f"classes: {len(class_names)}")
    print(f"training images: {len(train_samples)}")
    if valid_samples:
        print(f"validation images: {len(valid_samples)}")

    classifier = train_model(train_samples, class_names, args.batch_size, args.max_iter, args.alpha)
    validation_accuracy = evaluate_model(classifier, valid_samples, class_names, args.batch_size)

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("wb") as file:
        pickle.dump(
            {
                "type": "sklearn_sgd_image_classifier",
                "model": classifier,
                "class_names": class_names,
                "validation_accuracy": validation_accuracy,
            },
            file,
        )
    print(f"saved model: {output}")


if __name__ == "__main__":
    main()
