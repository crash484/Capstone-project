import os
import json
import pandas as pd
from pattern_analyzer import AttendancePatternAnalyzer


# ---------------------------------------------------------
# Corrected Paths
# ---------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))          # /src/patterns
SRC_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))        # /src
PYTHON_MODULES_DIR = os.path.abspath(os.path.join(SRC_DIR, ".."))  # /python_modules

TRAINING_DATA_DIR = os.path.join(PYTHON_MODULES_DIR, "training_data")
MODELS_DIR = os.path.join(PYTHON_MODULES_DIR, "models")

RAW_CSV_PATH = os.path.join(TRAINING_DATA_DIR, "raw_attendance_demo.csv")
OUTPUT_JSON_PATH = os.path.join(MODELS_DIR, "pattern_rules.json")



# ---------------------------------------------------------
# Ensure output folder exists
# ---------------------------------------------------------
os.makedirs(MODELS_DIR, exist_ok=True)


# ---------------------------------------------------------
# Load training data
# ---------------------------------------------------------
print("📘 Loading raw attendance data...")
print(f"➡ {RAW_CSV_PATH}\n")

df = pd.read_csv(RAW_CSV_PATH, parse_dates=["date"])

print(df.head())
print(f"\nTotal attendance rows: {len(df)}")


# ---------------------------------------------------------
# Fit Analyzer
# ---------------------------------------------------------
print("\n🚀 Running AttendancePatternAnalyzer...\n")

analyzer = AttendancePatternAnalyzer()
analyzer.fit(df)

patterns_dict = analyzer.export_patterns()


# ---------------------------------------------------------
# Save JSON output
# ---------------------------------------------------------
with open(OUTPUT_JSON_PATH, "w") as f:
    json.dump(patterns_dict, f, indent=4)

print("✅ Pattern analysis complete!")
print(f"\n💾 Patterns saved to:")
print(f"➡ {OUTPUT_JSON_PATH}\n")


# ---------------------------------------------------------
# Pretty terminal output
# ---------------------------------------------------------
print("🔍 Detected Patterns:\n")
for key, value in patterns_dict["patterns"].items():
    print(f"• {key}: {value}")

print("\n📊 Overall Mean Attendance:", patterns_dict["overall_mean_attendance"])
