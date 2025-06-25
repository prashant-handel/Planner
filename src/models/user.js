const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 50
    },
    middleName: {
        type: String,
        maxLength: 50
    },
    lastName: {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: (value) => {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email ', value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: (value) => {
            if(!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
                throw new Error('Enter a strong password');
            }
        }
    },
    age: {
        type: Number,
        required: true,
        maxLength: 2,
        min: 1,
        max: 120
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not supported!'
        }

    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);