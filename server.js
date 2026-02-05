import express  from "express";
import multer from "multer";
import { spawn } from "node:child_process"
import fs from "fs";
import path from "path"
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() }).single("file");

app.listen(5000, () => {
    console.log("server is live");
});



app.post("/server/upload", upload,async (req, res) => {
    // console.log("file:", req.file);
    // console.log("body:", req.body);

    try{
        const file = req.file;
        if(!file) return res.status(400).json({error:"no file uploaded"});

        const uploadDir = path.join(__dirName,"uploads");
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }

        const filePath = path.join(uploadDir, file.originalname);

        fs.writeFileSync(filePath, file.buffer);
        
        runPythonPipelines(filePath);

    res.json({
      message: "file uploaded, processing started",
      filename: file.originalname
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "upload failed" });
  }
});

//this is the function to the script

function runPython(scriptPath, args=[]){
    return new Promise((resolve,reject)=>{
        const python = spawn(
                  "lib/python_modules/venv/Scripts/python",
                        [scriptPath, ...args]
        );

        python.stdout.on("data",(data)=>{
            console.log(`stdOut:${data}`);
        });

        python.stderr.on("data",(data)=>{
            console.error(`stderr:${data}`);
        });

        python.on("close",(code)=>{
            if(code == 0) resolve();
            else reject(new Error(`Process exited with code${code}`));
        });
    });
}

//functio to execute each script
async function runPythonPipelines(filePath) {
  try {
    await runPython(
      "lib/python_modules/src/forecasting/forecaster_train.py",
      [filePath]
    );

    await runPython(
      "lib/python_modules/src/risk/risk_train.py",
      [filePath]
    );

    await runPython(
      "lib/python_modules/src/patterns/pattern_train.py",
      [filePath]
    );

    console.log("all models finished");

  } catch (err) {
    console.error("python pipeline failed:", err);
  }
}