export type RawAttendanceRow = {
  date: string; // YYYY-MM-DD
  student_id: string;
  present: "Yes" | "No";
};

export type DailyAttendanceRow = {
  date: string;
  attendance_pct: number;
  weekday: number;
  month: number;
  is_weekend: 0 | 1;
};

export type StudentRiskRow = {
  student_id: string;
  overall_attendance_30d: number;
  max_absence_streak: number;
  num_sudden_drops: number;
  variance_30d: number;
  weekday_miss_friday: number;
};
