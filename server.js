import express  from "express";
import multer from "multer";

const app = express();

const upload = multer({ storage: multer.memoryStorage() }).single("file");

app.listen(5000, () => {
    console.log("server is live");
});

app.post("/server/upload", upload, (req, res) => {
    console.log("file:", req.file);
    console.log("body:", req.body);

    return res.json({
        message: "received file",
        filename: req.file.originalname,
    });
});

