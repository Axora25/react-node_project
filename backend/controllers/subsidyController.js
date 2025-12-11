// backend/controllers/subsidyController.js
import mongoose from "mongoose";

/**
 * The data in your MongoDB (as shown in Compass) seems to be stored as documents with:
 * { name: "subsidies", data: [ ... ] } and { name: "subsidy_categories", data: [ ... ] }
 *
 * We'll query the raw collection and return the `data` array.
 */

const getCategories = async (req, res) => {
  try {
    const coll = mongoose.connection.collection("subsidy_categories");
    // if the collection contains a single doc with .data array:
    const doc = await coll.findOne({});
    if (!doc) return res.json({ data: [] });
    // if you imported as a "table" doc with 'data' field
    const data = doc.data || [];
    return res.json({ data });
  } catch (err) {
    console.error("getCategories:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getSubsidies = async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;
    const coll = mongoose.connection.collection("subsidy");
    const doc = await coll.findOne({});
    if (!doc) return res.json({ data: [] });
    let items = doc.data || [];

    // Normalize search and category filters
    const q = ("" + search).trim().toLowerCase();
    const cat = ("" + category).trim().toLowerCase();

    if (q) {
      items = items.filter((it) => {
        const title = (it.title || it.name || "").toString().toLowerCase();
        const desc = (it.description || it.short_description || "").toString().toLowerCase();
        const keywords = ((it.tags || []) .join(" ") ).toLowerCase();
        return title.includes(q) || desc.includes(q) || keywords.includes(q);
      });
    }

    if (cat && cat !== "all" && cat !== "all categories") {
      items = items.filter((it) => {
        // Try different possible fields where category might exist
        const cands = [
          it.category,
          it.category_name,
          it.cat,
          (it.tags || []).join(" "),
          it.group,
        ].filter(Boolean);
        return cands.some((c) => c.toString().toLowerCase().includes(cat));
      });
    }

    return res.json({ data: items });
  } catch (err) {
    console.error("getSubsidies:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export default {
  getCategories,
  getSubsidies,
};
