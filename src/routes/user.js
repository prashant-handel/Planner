const express = require('express');
const User = require('../models/user.js');
const router = express.Router();
const userAuth = require('../middlewares/auth.js');
const getUserIdFromToken = require('../utils/getUserIdFromToken.js');

router.get('/allUsers', userAuth, async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const users = await User.find({
            _id: { $ne: userId }
        });
        
        if (!users?.length) {
            return res.status(404).json({
                status: false,
                message: 'No users found'
            });
        }

        res.json({
            status: true,
            message: 'Users fetched successfully',
            users
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error fetching users',
            error: error.message
        })
    }
});

router.get('/searchExpectSelf', userAuth, async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        const regex = new RegExp(query, 'i');
        const userId = getUserIdFromToken(req);

        const users = await User.find({
            _id: { $ne: userId },
            $or: [
                { firstName: { $regex: regex } },
                { middleName: { $regex: regex } },
                { lastName: { $regex: regex } },
                { email: { $regex: regex } }
            ]
        });

        if (!users?.length) {
            return res.status(404).json({
                status: false,
                message: 'No users found'
            });
        }

        res.json({
            status: true,
            message: 'Users fetched successfully',
            users
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error searching users',
            error: error.message
        })
    }
})


module.exports = router;