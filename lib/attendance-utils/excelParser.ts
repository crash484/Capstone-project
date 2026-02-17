import * as XLSX from "xlsx";
import { RawAttendanceRow } from "./types";

export function parseAttendanceExcel(
  fileBuffer: Buffer
): RawAttendanceRow[] {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  // For CSV files, XLSX names the sheet after the filename or uses a default.
  // For Excel files, we look for a sheet named "attendance".
  // So we try "attendance" first, then fall back to the first available sheet.
  const sheetName =
    workbook.SheetNames.includes("attendance")
      ? "attendance"
      : workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("No sheets found in uploaded file");
  }

  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<any>(sheet);

  return rows.map((row) => ({
    date: new Date(row.date).toISOString().slice(0, 10),
    student_id: String(row.student_id),
    present: row.present === "Yes" ? "Yes" : "No",
  }));
}