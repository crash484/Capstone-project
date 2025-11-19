import os
import pandas as pd
import joblib
from forecaster_model import DailyAttendanceForecaster


# ---------------------------------------------------------
# Paths (Fixed)
# ---------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))          # /src/forecasting
SRC_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))        # /src
PYTHON_MODULES_DIR = os.path.abspath(os.path.join(SRC_DIR, ".."))  # /python_modules

TRAINING_DATA_DIR = os.path.join(PYTHON_MODULES_DIR, "training_data")
MODELS_DIR = os.path.join(PYTHON_MODULES_DIR, "models")

TRAIN_CSV_PATH = os.path.join(TRAINING_DATA_DIR, "daily_attendance_train.csv")
MODEL_OUTPUT_PATH = os.path.join(MODELS_DIR, "daily_forecaster.joblib")



# ---------------------------------------------------------
# Ensure output folder exists
# ---------------------------------------------------------
os.makedirs(MODELS_DIR, exist_ok=True)


# ---------------------------------------------------------
# Load training data
# ---------------------------------------------------------
print("📘 Loading training data...")
df = pd.read_csv(TRAIN_CSV_PATH, parse_dates=["date"])

print(df.head())
print(f"Loaded {len(df)} training rows.")


# ---------------------------------------------------------
# Train model
# ---------------------------------------------------------
print("\n🚀 Training DailyAttendanceForecaster...")
forecaster = DailyAttendanceForecaster()
model = forecaster.fit(df)

print("✅ Training complete!")


# ---------------------------------------------------------
# Save model
# ---------------------------------------------------------
joblib.dump(forecaster, MODEL_OUTPUT_PATH)
print(f"\n💾 Model saved to: {MODEL_OUTPUT_PATH}")
