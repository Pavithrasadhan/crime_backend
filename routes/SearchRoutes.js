
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Report = require('../models/crimeReport');
const faq = require('../models/faq');

router.get('/user', async(req, res) => {
    try{
        const { search, page = 1, limit = 5, role } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      users,
      total,
      totalPages: Math.ceil(total / pageSize),
      page: pageNumber,
      limit: pageSize,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/report', async(req, res) => {
    try{
        const { search, page = 1, limit = 5 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { type: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { assignedofficer: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      reports,
      total,
      totalPages: Math.ceil(total / pageSize),
      page: pageNumber,
      limit: pageSize,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/faq', async(req, res) => {
  try{
      const { search, page = 1, limit = 5 } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { question: { $regex: search, $options: 'i' } },
      { answer: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);

  const total = await faq.countDocuments(query);
  const faqs = await faq.find(query)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.json({
    faqs,
    total,
    totalPages: Math.ceil(total / pageSize),
    page: pageNumber,
    limit: pageSize,
  });
} catch (error) {
  res.status(500).json({ message: error.message });
}
});

module.exports = router;