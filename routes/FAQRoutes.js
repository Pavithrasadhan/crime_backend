const express = require("express");
const router = express.Router();
const Faq = require('../models/faq');

//GET all FAQs (with pagination and search)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const total = await Faq.countDocuments();

    const faqs = await Faq.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      faqs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single FAQ by ID
router.get("/:id", async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST (Create new FAQ)
router.post("/", async (req, res) => {
  const { question, answer } = req.body;
  try {
    const newFaq = new Faq({ question, answer });
    await newFaq.save();
    res.status(200).json(newFaq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//PUT (Update existing FAQ)
router.put("/:id", async (req, res) => {
  const { question, answer } = req.body;
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    faq.question = question;
    faq.answer = answer;

    await faq.save();
    res.status(200).json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//DELETE (Delete an FAQ)
router.delete("/:id", async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
