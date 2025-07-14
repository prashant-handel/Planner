const getUserIdFromToken = require("./getUserIdFromToken");
const Task = require("../models/task");

const validateTaskInput = async (req, res) => {
    const validFields = ['name', 'startDate', 'dueDate', 'progress', 'priority', 'description', 'assigner', 'assignees', '__v', 'createdAt', 'updatedAt', '_id'];
    const data = req.body;
    const allFieldsValid = Object.keys(data).every(key => validFields.includes(key));

    if(!allFieldsValid) {
        return res.status(400).json({
            status: false,
            message: 'Invalid fields'
        });
    };

    const requiredFields = ['name', 'dueDate', 'progress', 'priority', 'assigner'];
    const hasAllReqFields = requiredFields.every(field => data.hasOwnProperty(field));

    console.log('hasAllReqFields', hasAllReqFields);

    if(!hasAllReqFields) {
        return res.status(400).json({
            status: false,
            message: 'Invalid fields'
        });
    };

    const { assignees } = req.body;
    const loggedInUserId = getUserIdFromToken(req);

    if(assignees.includes(loggedInUserId) && (data.assigner === loggedInUserId)) {
        return res.status(400).json({
            status: false,
            message: 'You cannot assign a task to yourself'
        });
    }

    return res.json({
        status: true,
        message: 'Valid task data'
    })
}

module.exports = { validateTaskInput };