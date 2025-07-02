const express = require('express');
const User = require('../models/user.js');
const router = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const userAuth = require('../middlewares/auth.js')

const avatarColors = ["#FF6B6B","#FFB400","#6BCB77","#4D96FF","#845EC2","#FF5E78","#00C9A7","#FFC75F","#F9F871","#C34A36","#FF3CAC","#38B6FF","#FF9F1C","#8AC926","#D81159","#00F5D4","#FF006E","#8338EC","#F15BB5","#00BBF9"];



router.post('/signup', async (req, res) => {
    try {
        const userObj = req?.body;
        const { password } = req?.body;

        const passwordHash = await bcrypt.hash(password, 10);
        
        const payload = {
            ...userObj,
            password: passwordHash,
            color: avatarColors[Math.floor(Math.random() * 20)]
        };

        const user = new User(payload);
        
        await user.save();
        res.status(201).json({
            status: true,
            message: 'User created successfully'
        })
    }
    catch(err) {
        return res.status(500).json({
            status: false,
            message: 'Internal server error'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req?.body;

        if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: 'Please fill all the fields'
        });
        }

        if (!validator.isEmail(email)) {
        return res.status(400).json({
            status: false,
            message: 'Invalid credentials'
        });
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({
                status: false,
                message: 'Invalid credentials'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user?.password);

        if(!isPasswordValid) {
            return res.status(400).json({
                status: false,
                message: 'Invalid credentials'
            });
        }

        const token = await jwt.sign({_id: user?._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }); // expires in 7 days
        res.json({
            status: true,
            message: 'Logged in successfully',
            userId: user?._id
        });
    }
    catch (err) {
        res.status(500).send(err?.message);
    }
});

router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        res.send({
            status: true,
            message: 'Logout successful'
        });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/check', userAuth, async (req, res) => {
    res.json({
        status: true,
        message: 'User is authenticated',
        userId: req.user.id
    });
})

module.exports = router;