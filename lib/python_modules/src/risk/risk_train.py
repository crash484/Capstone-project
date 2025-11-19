import os
import pandas as pd
import joblib
from risk_model import StudentRiskClassifier

# ---------------------------------------------------------
# Corrected Paths
# ---------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))          # /src/risk
SRC_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))        # /src
PYTHON_MODULES_DIR = os.path.abspath(os.path.join(SRC_DIR, ".."))  # /python_modules

TRAINING_DATA_DIR = os.path.join(PYTHON_MODULES_DIR, "training_data")
MODELS_DIR = os.path.join(PYTHON_MODULES_DIR, "models")

TRAIN_CSV_PATH = os.path.join(TRAINING_DATA_DIR, "student_risk_train.csv")
MODEL_OUTPUT_PATH = os.path.join(MODELS_DIR, "student_risk_classifier.joblib")



# ---------------------------------------------------------
# Ensure model directory exists
# ---------------------------------------------------------
os.makedirs(MODELS_DIR, exist_ok=True)


# ---------------------------------------------------------
# Load training data
# ---------------------------------------------------------
print("📘 Loading student risk training data from:")
print(f"➡ {TRAIN_CSV_PATH}\n")

df = pd.read_csv(TRAIN_CSV_PATH)

print(df.head())
print(f"\nTotal training rows: {len(df)}")


# ---------------------------------------------------------
# Train model
# ---------------------------------------------------------
print("\n🚀 Training StudentRiskClassifier...\n")

risk_model = StudentRiskClassifier()
model = risk_model.fit(df)

print("✅ Training complete!")


# ---------------------------------------------------------
# Save trained model
# ---------------------------------------------------------
joblib.dump(risk_model, MODEL_OUTPUT_PATH)
print(f"\n💾 Model saved to:")
print(f"➡ {MODEL_OUTPUT_PATH}")
