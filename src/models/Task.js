const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    description: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;

//619e1cb79221bf3728731695
//619e1f1d799296339806946f
