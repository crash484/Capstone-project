import express from "express";
import multer from "multer";
import { spawn } from "node:child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runAttendancePipeline } from "./lib/attendance-utils/pipeline.ts";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() }).single("file");

// ─── Directory paths ───────────────────────────────────────────────────────────
const PYTHON_MODULES_DIR = path.join(__dirName, "lib", "python_modules");
const INPUTS_DIR         = path.join(PYTHON_MODULES_DIR, "inputs");
const OUTPUTS_DIR        = path.join(PYTHON_MODULES_DIR, "outputs");
const PREDICT_SCRIPT     = path.join(PYTHON_MODULES_DIR, "src", "predict.py");
const PYTHON_BIN         = path.join(PYTHON_MODULES_DIR, "venv", "Scripts", "python");

// ─── Ensure required directories exist ────────────────────────────────────────
[INPUTS_DIR, OUTPUTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Server ────────────────────────────────────────────────────────────────────
app.listen(5000, () => {
  console.log("Server is live on port 5000");
});

// ─── Upload endpoint ───────────────────────────────────────────────────────────
app.post("/server/upload", upload, async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Respond immediately — don't make the client wait for the full pipeline
    res.json({
      message: "File received, processing started",
      filename: file.originalname,
    });

    // Run the full pipeline in the background
    runFullPipeline(file.buffer, file.originalname);

  } catch (err) {
    console.error("Upload handler error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Upload failed" });
    }
  }
});

// ─── Pipeline orchestrator ─────────────────────────────────────────────────────
async function runFullPipeline(fileBuffer, originalName) {
  console.log(`\n Starting pipeline for: ${originalName}`);

  try {
    // ── Step 1: TypeScript pipeline → 3 CSV input files ───────────────────────
    //
    //   lib/python_modules/inputs/input_raw_attendance.csv  ← pattern model
    //   lib/python_modules/inputs/input_daily.csv           ← forecasting model
    //   lib/python_modules/inputs/input_student_risk.csv    ← risk model
    //
    console.log("  Step 1: Generating feature CSVs via TypeScript pipeline...");

    const stats = await runAttendancePipeline(fileBuffer, INPUTS_DIR);

    console.log(` CSVs written — students: ${stats.students}, days: ${stats.days}`);
    console.log(`   • ${path.join(INPUTS_DIR, "input_raw_attendance.csv")}`);
    console.log(`   • ${path.join(INPUTS_DIR, "input_daily.csv")}`);
    console.log(`   • ${path.join(INPUTS_DIR, "input_student_risk.csv")}`);

    // ── Step 2: predict.py reads the 3 CSVs → 3 JSON output files ─────────────
    //
    //   lib/python_modules/outputs/forecast_output.json   ← 7-day attendance forecast
    //   lib/python_modules/outputs/risk_output.json       ← per-student risk levels
    //   lib/python_modules/outputs/pattern_output.json    ← attendance pattern insights
    //
    console.log("\nStep 2: Running predict.py (forecasting + risk + patterns)...");

    await runPython(PREDICT_SCRIPT);

    console.log("\n All outputs ready:");
    console.log(`   • ${path.join(OUTPUTS_DIR, "forecast_output.json")}`);
    console.log(`   • ${path.join(OUTPUTS_DIR, "risk_output.json")}`);
    console.log(`   • ${path.join(OUTPUTS_DIR, "pattern_output.json")}`);

  } catch (err) {
    console.error(" Pipeline failed:", err.message);
  }
}

// ─── Python runner helper ──────────────────────────────────────────────────────
function runPython(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const python = spawn(PYTHON_BIN, [scriptPath, ...args], {
  env: { ...process.env, PYTHONIOENCODING: "utf-8" }
});

    python.stdout.on("data", (data) => {
      process.stdout.write(`[python] ${data}`);
    });

    python.stderr.on("data", (data) => {
      process.stderr.write(`[python:stderr] ${data}`);
    });

    python.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Python script "${scriptPath}" exited with code ${code}`));
      }
    });

    python.on("error", (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
}