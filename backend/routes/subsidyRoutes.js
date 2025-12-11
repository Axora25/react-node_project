// backend/routes/subsidyRoutes.js
import express from "express";
import subsidyController from "../controllers/subsidyController.js";

const router = express.Router();

// GET /api/subsidy/categories
router.get("/categories", subsidyController.getCategories);

// GET /api/subsidy/list
// optional query: ?search=...&category=...
router.get("/list", subsidyController.getSubsidies);

export default router;
