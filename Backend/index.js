const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { pdfSummaryGenerator } = require("./aiSummaryGenerators/pdfSummaryGenerator");

const app = express();
app.use(cors({
    origin: "http://localhost:5173", // frontend URL
  }));
app.use(express.json());

const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 5 * 1024 * 1024 },
});

app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded" });
        }
        const filePath = req.file.path;

        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);

        fs.unlinkSync(filePath);

        const pdfSummary = await pdfSummaryGenerator(pdfData.text)
        return res.status(200).json({
            pdfSummary
        })

        // return res.status(200).json({
        //     success: true,
        //     filename: req.file.originalname,
        //     pages: pdfData.numpages,
        //     text: pdfData.text,
        // });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to process PDF",
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on Port No ${process.env.PORT}`);
});
