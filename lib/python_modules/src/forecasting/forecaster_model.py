import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor


class DailyAttendanceForecaster:
    """
    Model 1: Cohort-Level Daily Attendance Forecasting
    """

    def __init__(self):
        self.model = None
        self.feature_cols = [
            "weekday",
            "month",
            "is_weekend",
            "attendance_lag1",
            "attendance_lag2",
            "rolling_mean_7"
        ]

    def add_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.sort_values("date").copy()
        df["attendance_lag1"] = df["attendance_pct"].shift(1)
        df["attendance_lag2"] = df["attendance_pct"].shift(2)
        df["rolling_mean_7"] = (
            df["attendance_pct"].rolling(window=7, min_periods=1).mean()
        )
        return df

    def fit(self, df: pd.DataFrame):
        df = self.add_features(df)
        df = df.dropna()

        X = df[self.feature_cols]
        y = df["attendance_pct"]

        self.model = RandomForestRegressor(n_estimators=250, random_state=42)
        self.model.fit(X, y)
        return self.model

    def predict_next_day(self, df: pd.DataFrame, next_day_info: dict) -> float:
        df = df.sort_values("date").copy()
        df = self.add_features(df)

        last = df.iloc[-1]

        # ── Fallback for when there is only 1 row of history ──────────────────
        # attendance_lag2 needs a second-to-last row.
        # If only 1 row exists, reuse attendance_lag1 as a safe approximation.
        if len(df) >= 2:
            second_last = df.iloc[-2]
            lag2_value = second_last["attendance_pct"]
        else:
            lag2_value = last["attendance_pct"]  # reuse lag1 as fallback

        input_row = pd.DataFrame([{
            "weekday":          next_day_info["weekday"],
            "month":            next_day_info["month"],
            "is_weekend":       next_day_info["is_weekend"],
            "attendance_lag1":  last["attendance_pct"],
            "attendance_lag2":  lag2_value,
            "rolling_mean_7":   last["rolling_mean_7"],
        }])

        prediction = float(self.model.predict(input_row)[0])
        return prediction