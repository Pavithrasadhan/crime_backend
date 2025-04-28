const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

// User Registration Route
router.post("/register", async (req, res) => {
    const { name, email, phone, password, aadharNo, role } = req.body;
  
    try {
        
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            aadharNo,
            role
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
            }
        });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            aadharNo: user.aadharNo,
            role: user.role,
            createdAt: user.createdAt
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Error during login" });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const role = req.query.role || ''; 

        let filter = {};
        if (role) {
            filter.role = role; 
        }

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            users,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user information
router.put('/:id', async (req, res) => {
    const { name, email, phone, password, aadharNo, role } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (password && !(await bcrypt.compare(password, user.password))) {
            user.password = await bcrypt.hash(password, 10);
        }

        user.name = name;
        user.email = email;
        user.phone = phone;
        user.aadharNo = aadharNo;
        user.role = role;

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
