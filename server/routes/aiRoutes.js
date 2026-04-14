const express = require("express");
const router = express.Router();
const { generateIdea,autoComplete } = require("../controllers/aiController");

router.post("/idea", generateIdea);
router.post("/autocomplete", autoComplete);

module.exports = router;