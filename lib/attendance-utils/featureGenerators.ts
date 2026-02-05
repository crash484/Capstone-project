import {
  RawAttendanceRow,
  DailyAttendanceRow,
  StudentRiskRow,
} from "./types";

/* ---------- DAILY ATTENDANCE ---------- */
export function generateDailyAttendance(
  raw: RawAttendanceRow[]
): DailyAttendanceRow[] {
  const grouped: Record<string, RawAttendanceRow[]> = {};

  raw.forEach((r) => {
    grouped[r.date] ??= [];
    grouped[r.date].push(r);
  });

  return Object.entries(grouped)
    .map(([date, records]) => {
      const presentCount = records.filter(r => r.present === "Yes").length;
      const total = records.length;

      const attendance_pct = Math.round((presentCount / total) * 100);

      const d = new Date(date);
      const weekday = (d.getDay() + 6) % 7; // Monday = 0

      return {
  date,
  attendance_pct,
  weekday,
  month: d.getMonth() + 1,
  is_weekend: (weekday >= 5 ? 1 : 0) as 0 | 1,
};

    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

/* ---------- STUDENT RISK FEATURES ---------- */
export function generateStudentRiskFeatures(
  raw: RawAttendanceRow[]
): StudentRiskRow[] {
  const byStudent: Record<string, RawAttendanceRow[]> = {};

  raw.forEach(r => {
    byStudent[r.student_id] ??= [];
    byStudent[r.student_id].push(r);
  });

  return Object.entries(byStudent).map(([student_id, records]) => {
    records.sort((a, b) => a.date.localeCompare(b.date));

    // Use last 30 records max
    const last30 = records.slice(-30);

    const attendance: number[] =
      last30.map(r => (r.present === "Yes" ? 1 : 0));

    const totalPresent = attendance.reduce<number>((a, b) => a + b, 0);

    const overall_attendance_30d =
      Math.round((totalPresent / attendance.length) * 100);

    let max_absence_streak = 0;
    let current = 0;

    attendance.forEach(v => {
      if (v === 0) {
        current++;
        max_absence_streak = Math.max(max_absence_streak, current);
      } else {
        current = 0;
      }
    });

    let num_sudden_drops = 0;
    for (let i = 1; i < attendance.length; i++) {
      if (attendance[i - 1] === 1 && attendance[i] === 0) {
        num_sudden_drops++;
      }
    }

    const mean = totalPresent / attendance.length;

    const variance_30d =
      attendance.reduce<number>(
        (a, b) => a + Math.pow(b - mean, 2),
        0
      ) / attendance.length;

    const weekday_miss_friday = last30.filter(r => {
      const d = new Date(r.date);
      return d.getDay() === 5 && r.present === "No";
    }).length;

    return {
      student_id,
      overall_attendance_30d,
      max_absence_streak,
      num_sudden_drops,
      variance_30d: Number(variance_30d.toFixed(5)),
      weekday_miss_friday,
    };
  });
}
