import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";

const router = express.Router();
const upload = multer();

const dataDir = path.join(process.cwd(), "backend", "data");
const dataFile = path.join(dataDir, "crops.json");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper to read dataset
function readCrops() {
  try {
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf8");
      return JSON.parse(raw);
    }
    return [];
  } catch (e) {
    console.error("Error reading crops data:", e);
    return [];
  }
}

// Upload Excel file and convert to JSON
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const json = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Save to data file
    fs.writeFileSync(dataFile, JSON.stringify(json, null, 2), "utf8");

    return res.json({ success: true, count: json.length });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Return dataset
router.get("/", (req, res) => {
  const data = readCrops();
  res.json({ count: data.length, data });
});

// Simple recommendation: find crop with closest Euclidean distance on numeric features
// Expected dataset columns (case-insensitive): crop, nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall
router.post("/recommend", (req, res) => {
  try {
    const payload = req.body || {};
    const user = {
      nitrogen: Number(payload.nitrogen || 0),
      phosphorus: Number(payload.phosphorus || 0),
      potassium: Number(payload.potassium || 0),
      temperature: Number(payload.temperature || 0),
      humidity: Number(payload.humidity || 0),
      ph: Number(payload.ph || 0),
      rainfall: Number(payload.rainfall || 0)
    };

    const dataset = readCrops();
    if (!dataset || dataset.length === 0) return res.status(404).json({ error: "No crop dataset available. Upload an Excel file first." });

    const numericKeys = ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall"];

    // Normalize dataset: map keys
    const processed = dataset.map((row) => {
      const cropName = row.crop || row.Crop || row.CROP || row.name || row.Name || "Unknown";
      const entry = { crop: cropName };
      numericKeys.forEach((k) => {
        // try multiple possible column names
        const val = row[k] ?? row[k.charAt(0).toUpperCase() + k.slice(1)] ?? row[k.toUpperCase()];
        entry[k] = Number(val) || 0;
      });
      return entry;
    });

    // compute Euclidean distance
    let best = null;
    let bestDist = Infinity;
    for (const e of processed) {
      let sum = 0;
      for (const k of numericKeys) {
        const diff = (e[k] || 0) - (user[k] || 0);
        sum += diff * diff;
      }
      const dist = Math.sqrt(sum);
      if (dist < bestDist) {
        bestDist = dist;
        best = e;
      }
    }

    if (!best) return res.status(404).json({ error: "No suitable crop found" });

    return res.json({ crop: best.crop, distance: bestDist, matched: best });
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
