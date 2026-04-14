const express = require("express");
const router = express.Router();

const{
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog
} = require("../controllers/blogController");

const protect = require("../Middleware/authMiddleware");

router.get("/", getBlogs);
router.get("/:id", getBlog);

router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;