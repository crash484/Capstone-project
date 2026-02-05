import fs from "fs";
import path from "path";
import { runAttendancePipeline } from "./lib/attendance-utils/pipeline";


// 1️⃣ Fake Excel using CSV-like JSON (for now)
const mockRawAttendance = [
  { date: "2025-01-10", student_id: "S001", present: "Yes" },
  { date: "2025-01-10", student_id: "S002", present: "Yes" },
  { date: "2025-01-10", student_id: "S003", present: "No" },

  { date: "2025-01-11", student_id: "S001", present: "Yes" },
  { date: "2025-01-11", student_id: "S002", present: "No" },
  { date: "2025-01-11", student_id: "S003", present: "Yes" },

  { date: "2025-01-12", student_id: "S001", present: "No" },
  { date: "2025-01-12", student_id: "S002", present: "No" },
  { date: "2025-01-12", student_id: "S003", present: "Yes" },
];

// 2️⃣ Convert mock data to fake Excel buffer
// (temporary trick so pipeline stays unchanged)
const csvContent = [
  "date,student_id,present",
  ...mockRawAttendance.map(
    r => `${r.date},${r.student_id},${r.present}`
  ),
].join("\n");

const fakeExcelPath = path.join(process.cwd(), "temp_attendance.xlsx");

// Write CSV but pretend it's Excel for now
fs.writeFileSync(fakeExcelPath, csvContent);

// Read as buffer
const buffer = fs.readFileSync(fakeExcelPath);

// 3️⃣ Run pipeline
(async () => {
  const result = await runAttendancePipeline(
    buffer,
    "lib/python_modules/inputs"
  );

  console.log("Pipeline result:", result);
})();
