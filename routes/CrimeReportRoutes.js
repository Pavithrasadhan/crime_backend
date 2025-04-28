const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const CrimeReport = require('../models/crimeReport');
const User = require('../models/user');
const crimeReport = require('../models/crimeReport');

// User files a new crime report
router.post("/", async (req, res) => {
    try {
      console.log("Request body:", req.body);
  
      const { userName, type, location, status, assignedOfficer } = req.body;
  
      if (!userName || !type || !location) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const newReport = new CrimeReport({
        userName,
        type,
        location,
        status: status || "Pending",
        assignedOfficer: assignedOfficer || "",
      });
  
      console.log("New report:", newReport);
  
      await newReport.save();
  
      res.status(201).json({ message: "Report submitted successfully", report: newReport });
    } catch (err) {
      console.error("Error submitting report:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const total = await CrimeReport.countDocuments();
        const report = await CrimeReport.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            report,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get crime reports by userName
router.get("/user-reports", async (req, res) => {
    try {
      const { username } = req.query;
  
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
  
      const reports = await CrimeReport.find({ userName: username });
  
      if (!reports || reports.length === 0) {
        return res.status(404).json({ message: "No reports found for this user" });
      }
      res.status(200).json({ reports });
    } catch (err) {
      console.error("Error fetching user reports:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/:userName", async (req, res) => {
    try {
      const userName = req.params.userName;
      const report = await CrimeReport.findOne({ userName: {$regex: new RegExp (userName, 'i')} });
  
      if (!report) {
        return res.status(404).json({ message: "No reports found for this user" });
      }
      res.status(200).json({ report });
    } catch (err) {
      console.error("Error fetching user reports:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  
// Update crime report using userName
router.put('/username/:userName', async (req, res) => {
  const { type, location, status, assignedOfficer } = req.body;

  try {
      const report = await CrimeReport.findOneAndUpdate(
          { userName: req.params.userName }, 
          { type, location, status, assignedOfficer },
          { new: true } 
      );

      if (!report) {
          return res.status(404).json({ message: "Report not found" });
      }

      res.status(200).json(report);
  } catch (err) {
      console.error("Error updating report:", err);
      res.status(500).json({ message: "Internal server error" });
  }
});


// Admin deletes a crime report
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid report ID format" });
        }

        const crimeReport = await CrimeReport.findByIdAndDelete(req.params.id);
        if (!crimeReport) return res.status(404).json({ message: "Crime report not found" });

        res.status(200).json({ message: "Crime report deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
