import * as XLSX from "xlsx";
import { RawAttendanceRow } from "./types";

export function parseAttendanceExcel(
  fileBuffer: Buffer
): RawAttendanceRow[] {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheet = workbook.Sheets["attendance"];

  if (!sheet) {
    throw new Error("Sheet 'attendance' not found");
  }

  const rows = XLSX.utils.sheet_to_json<any>(sheet);

  return rows.map((row) => ({
    date: new Date(row.date).toISOString().slice(0, 10),
    student_id: String(row.student_id),
    present: row.present === "Yes" ? "Yes" : "No",
  }));
}
