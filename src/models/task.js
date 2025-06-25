const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50
  },
  startDate: {
    type: Date
  },
  dueDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return !this.startDate || value >= this.startDate;
      },
      message: 'Due date must be after start date.'
    }
  },
  progress: {
    type: String,
    lowercase: true,
    required: true,
    enum: {
      values: ['not_started', 'in_progress', 'completed'],
      message: '{VALUE} is not supported!'
    }
  },
  priority: {
    type: String,
    required: true,
    enum: {
      values: ['urgent', 'important', 'medium', 'low'],
      message: '{VALUE} is not supported!'
    }
  },
  description: {
    type: String,
    maxLength: 500
  },
  assigner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
