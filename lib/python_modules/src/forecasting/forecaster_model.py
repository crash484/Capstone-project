import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor


class DailyAttendanceForecaster:
    """
    Model 1: Cohort-Level Daily Attendance Forecasting
    ---------------------------------------------------
    This class handles:
      - feature engineering (lags, rolling averages)
      - training the forecasting model
      - predicting next day's attendance
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

    # ---------------------------------------------------
    # Feature engineering
    # ---------------------------------------------------
    def add_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add lag & rolling features required for the model."""
        df = df.sort_values("date").copy()

        df["attendance_lag1"] = df["attendance_pct"].shift(1)
        df["attendance_lag2"] = df["attendance_pct"].shift(2)

        df["rolling_mean_7"] = (
            df["attendance_pct"].rolling(window=7, min_periods=1).mean()
        )

        return df

    # ---------------------------------------------------
    # Training
    # ---------------------------------------------------
    def fit(self, df: pd.DataFrame):
        """
        Train the RandomForestRegressor using the preprocessed daily DataFrame.
        DataFrame must contain:
            date, attendance_pct, weekday, month, is_weekend
        """

        df = self.add_features(df)
        df = df.dropna()  # drop initial lag rows

        X = df[self.feature_cols]
        y = df["attendance_pct"]

        self.model = RandomForestRegressor(
            n_estimators=250,
            random_state=42
        )

        self.model.fit(X, y)

        return self.model

    # ---------------------------------------------------
    # Predict next day attendance
    # ---------------------------------------------------
    def predict_next_day(self, df: pd.DataFrame, next_day_info: dict) -> float:
        """
        Predict attendance for the NEXT day.

        Parameters:
            df: DataFrame with historical daily attendance
            next_day_info: dict containing:
                weekday, month, is_weekend

        Returns:
            Predicted attendance percentage (float)
        """

        df = df.sort_values("date").copy()
        df = self.add_features(df)

        # Last known row used for lag features
        last = df.iloc[-1]
        second_last = df.iloc[-2]

        input_row = pd.DataFrame([{
            "weekday": next_day_info["weekday"],
            "month": next_day_info["month"],
            "is_weekend": next_day_info["is_weekend"],

            # LAG features taken from history
            "attendance_lag1": last["attendance_pct"],
            "attendance_lag2": second_last["attendance_pct"],
            "rolling_mean_7": last["rolling_mean_7"],
        }])

        prediction = float(self.model.predict(input_row)[0])
        return prediction
