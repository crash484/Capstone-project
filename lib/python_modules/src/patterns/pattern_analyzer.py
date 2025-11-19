import pandas as pd
import numpy as np

class AttendancePatternAnalyzer:
    """
    Model 3: Pattern Analyzer (Rule + Statistics Based)
    ---------------------------------------------------
    Detects:
      - Weekend effect (Friday dips)
      - Midweek dips (e.g., Wednesday)
      - Holiday-like attendance drops
    """

    def __init__(self):
        self.weekday_stats = None
        self.overall_mean = None

    # ---------------------------------------------------
    # Preprocessing: convert raw attendance -> daily %
    # ---------------------------------------------------
    def compute_daily_stats(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        df must contain:
        date, student_id, present (Yes/No)

        Returns a daily dataframe:
            date, present_pct, weekday
        """

        # Convert yes/no to 1/0
        df["present_flag"] = df["present"].apply(lambda x: 1 if x == "Yes" else 0)

        daily = (
            df.groupby("date")["present_flag"]
              .mean()
              .reset_index()
              .rename(columns={"present_flag": "present_pct"})
        )

        # Convert to percentage
        daily["present_pct"] = daily["present_pct"] * 100
        daily["weekday"] = pd.to_datetime(daily["date"]).dt.weekday  # 0=Mon,6=Sun

        return daily

    # ---------------------------------------------------
    # Fit analyzer (calculate statistics)
    # ---------------------------------------------------
    def fit(self, df: pd.DataFrame):
        """
        Receives the raw attendance DataFrame (date, student_id, present)
        and computes weekday averages + global mean.
        """

        daily = self.compute_daily_stats(df)

        # Weekday-wise average attendance
        self.weekday_stats = (
            daily.groupby("weekday")["present_pct"]
            .agg(["mean", "std", "count"])
            .reset_index()
        )

        # Global attendance level
        self.overall_mean = daily["present_pct"].mean()

        return self

    # ---------------------------------------------------
    # Pattern detection
    # ---------------------------------------------------
    def analyze_patterns(self) -> dict:
        """
        Returns a dictionary of detected patterns, e.g.:

        {
            "weekend_effect": "Absences spike ~18% on Fridays.",
            "midweek_dip": "Wednesday attendance is ~9% below normal.",
            "holiday_effect": "Detected clusters of low-attendance days around holidays."
        }
        """

        patterns = {}

        # ---------- Weekend effect (Friday = 4) ----------
        fri = self.weekday_stats[self.weekday_stats["weekday"] == 4]
        if not fri.empty:
            friday_mean = float(fri["mean"].iloc[0])
            diff = self.overall_mean - friday_mean

            if diff > 5:  # significant dip
                patterns["weekend_effect"] = (
                    f"Absences spike ~{diff:.1f}% on Fridays compared to normal."
                )

        # ---------- Midweek dips (Wednesday = 2) ----------
        wed = self.weekday_stats[self.weekday_stats["weekday"] == 2]
        if not wed.empty:
            wed_mean = float(wed["mean"].iloc[0])
            diff = self.overall_mean - wed_mean

            if diff > 5:
                patterns["midweek_dip"] = (
                    f"Wednesday attendance is ~{diff:.1f}% lower than average."
                )

        # ---------- Holiday-like dips ----------
        # Identify days with unusually LOW attendance
        # Using > 1 std dev below global mean
        low_attendance_threshold = self.overall_mean - 1.0 * self.weekday_stats["std"].mean()

        # if there's any weekday with high std -> strong variability (holiday-like)
        high_var_days = self.weekday_stats[self.weekday_stats["std"] > 10]

        if not high_var_days.empty:
            patterns["holiday_effect"] = (
                "Detected clusters of low-attendance days likely due to holidays or events."
            )

        return patterns

    # ---------------------------------------------------
    # Export pattern data for saving as JSON
    # ---------------------------------------------------
    def export_patterns(self) -> dict:
        """Return all pattern insights as a final JSON-friendly dict."""
        return {
            "overall_mean_attendance": float(self.overall_mean),
            "weekday_stats": self.weekday_stats.to_dict(orient="records"),
            "patterns": self.analyze_patterns()
        }
