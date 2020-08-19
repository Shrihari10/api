const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    rollNumber:{
        type: Number,
        required: true
    },
    department: {
        type: String
    }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
