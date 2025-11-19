import sys
import os

# ---------------------------------------------------------
# JOBLIB FIX — Alias old module paths to new module paths
# ---------------------------------------------------------

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# Add forecasting, risk, patterns to import path
sys.path.append(os.path.join(CURRENT_DIR, "forecasting"))
sys.path.append(os.path.join(CURRENT_DIR, "risk"))
sys.path.append(os.path.join(CURRENT_DIR, "patterns"))

# Import modules under their new paths
import forecasting.forecaster_model as forecaster_model_module
import risk.risk_model as risk_model_module
import patterns.pattern_analyzer as pattern_analyzer_module

# Create aliases so joblib can find old module names
sys.modules["forecaster_model"] = forecaster_model_module
sys.modules["risk_model"] = risk_model_module
sys.modules["pattern_analyzer"] = pattern_analyzer_module

# ---------------------------------------------------------
# Continue with your REAL imports now
# ---------------------------------------------------------
import json
import pandas as pd
import joblib

from forecasting.forecaster_model import DailyAttendanceForecaster
from risk.risk_model import StudentRiskClassifier
from patterns.pattern_analyzer import AttendancePatternAnalyzer


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))          # /src/
PYTHON_MODULES_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))

INPUT_DIR = os.path.join(PYTHON_MODULES_DIR, "inputs")
OUTPUT_DIR = os.path.join(PYTHON_MODULES_DIR, "outputs")
MODELS_DIR = os.path.join(PYTHON_MODULES_DIR, "models")

# Input files
DAILY_INPUT_PATH = os.path.join(INPUT_DIR, "input_daily.csv")
RISK_INPUT_PATH = os.path.join(INPUT_DIR, "input_student_risk.csv")
RAW_ATTENDANCE_PATH = os.path.join(INPUT_DIR, "input_raw_attendance.csv")

# Model files
FORECASTER_MODEL_PATH = os.path.join(MODELS_DIR, "daily_forecaster.joblib")
RISK_MODEL_PATH = os.path.join(MODELS_DIR, "student_risk_classifier.joblib")
PATTERN_RULES_PATH = os.path.join(MODELS_DIR, "pattern_rules.json")

# Output files
FORECAST_OUTPUT_PATH = os.path.join(OUTPUT_DIR, "forecast_output.json")
RISK_OUTPUT_PATH = os.path.join(OUTPUT_DIR, "risk_output.json")
PATTERN_OUTPUT_PATH = os.path.join(OUTPUT_DIR, "pattern_output.json")

# Ensure outputs folder exists
os.makedirs(OUTPUT_DIR, exist_ok=True)


# ---------------------------------------------------------
# Load Models
# ---------------------------------------------------------
print("📦 Loading models...")

forecaster: DailyAttendanceForecaster = joblib.load(FORECASTER_MODEL_PATH)
risk_model: StudentRiskClassifier = joblib.load(RISK_MODEL_PATH)

with open(PATTERN_RULES_PATH, "r") as f:
    pattern_rules = json.load(f)

print("✅ Models loaded successfully!\n")


# ---------------------------------------------------------
# 1️⃣ FORECASTING — Next-day or multi-day predictions
# ---------------------------------------------------------
print("📘 Loading daily input for forecasting...")
daily_df = pd.read_csv(DAILY_INPUT_PATH, parse_dates=["date"])

print("➡ Generating next 7-day forecast...\n")

forecast_results = []
last_date = daily_df["date"].max()

current_df = daily_df.copy()

for i in range(1, 8):
    next_date = last_date + pd.Timedelta(days=i)

    next_info = {
        "weekday": next_date.weekday(),
        "month": next_date.month,
        "is_weekend": 1 if next_date.weekday() >= 5 else 0
    }

    predicted = forecaster.predict_next_day(current_df, next_info)

    forecast_results.append({
        "date": next_date.strftime("%Y-%m-%d"),
        "predicted_attendance": round(predicted, 2),
        "confidence": 0.95  # static demo confidence
    })

    # Append predicted day to history so rolling/lag features work
    current_df = pd.concat([
        current_df,
        pd.DataFrame([{
            "date": next_date,
            "attendance_pct": predicted,
            "weekday": next_info["weekday"],
            "month": next_info["month"],
            "is_weekend": next_info["is_weekend"]
        }])
    ], ignore_index=True)


# Save forecast output
with open(FORECAST_OUTPUT_PATH, "w") as f:
    json.dump(forecast_results, f, indent=4)

print("✅ Forecasting complete!")
print(f"💾 Saved to {FORECAST_OUTPUT_PATH}\n")


# ---------------------------------------------------------
# 2️⃣ STUDENT RISK ANALYSIS
# ---------------------------------------------------------
print("📘 Loading student risk input...")
risk_df = pd.read_csv(RISK_INPUT_PATH)

print("➡ Predicting student risk levels...\n")

risk_outputs = []
for _, row in risk_df.iterrows():
    features = {
        "overall_attendance_30d": row["overall_attendance_30d"],
        "max_absence_streak": row["max_absence_streak"],
        "num_sudden_drops": row["num_sudden_drops"],
        "variance_30d": row["variance_30d"],
        "weekday_miss_friday": row["weekday_miss_friday"]
    }

    result = risk_model.predict_single_with_proba(features)

    risk_outputs.append({
        "student_id": row["student_id"],
        "risk_level": result["label"],
        "probabilities": result["probabilities"]
    })

with open(RISK_OUTPUT_PATH, "w") as f:
    json.dump(risk_outputs, f, indent=4)

print("✅ Student risk analysis done!")
print(f"💾 Saved to {RISK_OUTPUT_PATH}\n")


# ---------------------------------------------------------
# 3️⃣ PATTERN ANALYSIS
# ---------------------------------------------------------
print("📘 Loading raw attendance input for pattern analysis...")
raw_df = pd.read_csv(RAW_ATTENDANCE_PATH, parse_dates=["date"])

print("➡ Running pattern analyzer...\n")

pattern_analyzer = AttendancePatternAnalyzer()
pattern_analyzer.fit(raw_df)
patterns = pattern_analyzer.export_patterns()

with open(PATTERN_OUTPUT_PATH, "w") as f:
    json.dump(patterns, f, indent=4)

print("✅ Pattern analysis complete!")
print(f"💾 Saved to {PATTERN_OUTPUT_PATH}\n")


# ---------------------------------------------------------
# TERMINAL OUTPUT
# ---------------------------------------------------------
print("\n========================= 📊 FINAL OUTPUTS =========================\n")

# Forecast summary
print("📅 Next 7 Days Forecast:")
for fday in forecast_results:
    print(f"  - {fday['date']}: {fday['predicted_attendance']}%  (conf: {fday['confidence']})")

print("\n🧑‍🎓 Student Risk Levels:")
for r in risk_outputs:
    print(f"  - {r['student_id']}: {r['risk_level']}  ({r['probabilities']})")

print("\n🔍 Pattern Insights:")
for k, v in patterns["patterns"].items():
    print(f"  - {k}: {v}")

print("\n====================================================================\n")
