import path from "path";
import { parseAttendanceExcel } from "./excelParser";
import { generateDailyAttendance, generateStudentRiskFeatures } from "./featureGenerators";
import { writeCSV } from "./csvWriter";

export async function runAttendancePipeline(
  excelBuffer: Buffer,
  pythonInputDir: string
) {
  const rawAttendance = parseAttendanceExcel(excelBuffer);

  const daily = generateDailyAttendance(rawAttendance);
  const risk = generateStudentRiskFeatures(rawAttendance);

  writeCSV(
    rawAttendance,
    path.join(pythonInputDir, "input_raw_attendance.csv")
  );
  writeCSV(
    daily,
    path.join(pythonInputDir, "input_daily.csv")
  );
  writeCSV(
    risk,
    path.join(pythonInputDir, "input_student_risk.csv")
  );

  return {
    students: new Set(rawAttendance.map(r => r.student_id)).size,
    days: new Set(rawAttendance.map(r => r.date)).size,
  };
}
