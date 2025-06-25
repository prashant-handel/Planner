const getUserIdFromToken = require("./getUserIdFromToken");


const validateTaskInput = async (req) => {
    const validFields = ['name', 'startDate', 'dueDate', 'progress', 'priority', 'description', 'assigner', 'assignees'];
    const data = req.body;
    const allFieldsValid = Object.keys(data).every(key => validFields.includes(key));

    const requiredFields = ['name', 'dueDate', 'progress', 'priority', 'assigner'];
    const notHaveRequired = Object.keys(data).some(key => !requiredFields.includes(key));

    if(!allFieldsValid || notHaveRequired) {
        return res.status(400).json({
            status: false,
            message: 'Invalid fields'
        });
    };

    const { assignees } = req.body;
    const loggedInUserId = getUserIdFromToken(req);

    if(assignees.includes(loggedInUserId)) {
        return res.status(400).json({
            status: false,
            message: 'Invalid fields'
        });
    }


    return res.json({
        status: true,
        message: 'Valid task data'
    })
}

module.exports = { validateTaskInput };