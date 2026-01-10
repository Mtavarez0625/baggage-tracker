const express = require("express");
const Bag = require("../models/Bag");

const router = express.Router();

// GET all bags
router.get("/", async (req, res) => {
  try {
    const bags = await Bag.find().sort({ updatedAt: -1 });
    res.json(bags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create bag
router.post("/", async (req, res) => {
  try {
    const bag = new Bag(req.body);
    const saved = await bag.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update bag (status + edit fields)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Bag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE bag
router.delete("/:id", async (req, res) => {
  try {
    await Bag.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
