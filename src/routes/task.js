const express = require('express');
const Task = require('../models/task.js');
const userAuth = require('../middlewares/auth.js');
const { validateTaskInput } = require('../utils/validation.js');
const getUserIdFromToken = require('../utils/getUserIdFromToken.js');

const router = express.Router();

router.post('/create', userAuth, async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);

        const task = new Task({
            ...req.body,
            assigner: userId
        });
        result = await task.save();
        res.json({
            status: true,
            message: 'Task created successfully'
        });
    }
    catch(err) {
        res.status(500).send(err.message);
    }
});

router.get('/allTasks', userAuth, async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const tasks = await Task.find({
            $or: [
                { assigner: userId },
                { assignees: { $in: [userId]} }
            ]
        })
        .populate('assigner', 'firstName')
        .populate('assignees', ['firstName', 'color']);

        if(!tasks) {
            return res.status(404).json({
                status: false,
                message: 'No tasks found'
            });
        }

        res.json({
            status: true,
            tasks: tasks
        })
    }
    catch(err) {
        res.status(500).send(err.message);
    }
})

router.patch('/update', userAuth, async (req, res) => {
    try {
        const { _id } = req.body;

        if(!_id) {
            return res.status(400).json({
                message: 'Required field id not found',
                status: false
            });
        }

        await validateTaskInput(req, res);

        const updatedTask = await Task.findByIdAndUpdate(_id, req.body);

        if(!updatedTask) {
            return res.status(400).json({
                status: false,
                message: 'Task not found'
            });
        }

        res.json({
            status: true,
            message: 'Task updated successfully'
        })
    }
    catch (err) {
        return
    }
})

router.delete('/delete/:id', userAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await Task.findByIdAndDelete(id);

        if(!deletedTask) {
            return res.status(400).json({
                status: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Task deleted successfully'
        })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: 'Internal server error'
        })
    }
});

module.exports = router;