import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier


class StudentRiskClassifier:
    """
    Model 2: Student Health Risk Classification
    --------------------------------------------
    Uses engineered features to classify students into
    Low, Medium, or High risk categories.
    """

    def __init__(self):
        self.model = None
        self.feature_cols = [
            "overall_attendance_30d",
            "max_absence_streak",
            "num_sudden_drops",
            "variance_30d",
            "weekday_miss_friday"
        ]

    # ---------------------------------------------------
    # Training
    # ---------------------------------------------------
    def fit(self, df: pd.DataFrame):
        """
        df must include:
        student_id, overall_attendance_30d, max_absence_streak,
        num_sudden_drops, variance_30d, weekday_miss_friday, label
        """

        X = df[self.feature_cols]
        y = df["label"]

        # RandomForestClassifier for robustness
        self.model = RandomForestClassifier(
            n_estimators=250,
            random_state=42,
            class_weight="balanced"
        )

        self.model.fit(X, y)
        return self.model

    # ---------------------------------------------------
    # Predict a single student risk
    # ---------------------------------------------------
    def predict_single(self, features: dict) -> str:
        """
        Predict risk label for a single student.
        
        features must include keys from self.feature_cols:
          {
            "overall_attendance_30d": 74,
            "max_absence_streak": 2,
            "num_sudden_drops": 1,
            "variance_30d": 0.0124,
            "weekday_miss_friday": 0
          }
        """

        X = pd.DataFrame([features])[self.feature_cols]
        return self.model.predict(X)[0]

    # ---------------------------------------------------
    # Predict with probabilities (for explanation)
    # ---------------------------------------------------
    def predict_single_with_proba(self, features: dict) -> dict:
        """
        Returns: {
            "label": "High",
            "probabilities": { "Low": 0.12, "Medium": 0.30, "High": 0.58 }
        }
        """

        X = pd.DataFrame([features])[self.feature_cols]

        label = self.model.predict(X)[0]
        proba = self.model.predict_proba(X)[0]
        labels = self.model.classes_

        return {
            "label": label,
            "probabilities": {
                labels[i]: float(proba[i])
                for i in range(len(labels))
            }
        }
