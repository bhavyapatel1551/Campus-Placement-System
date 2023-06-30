const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema({
    sid: {
        type: Number,
        required: true,
        unique: true
    },


    password: {
        type: String,
        required: true,
        trim: true
    },

    sname: {
        type: String,
        required: true,
        trim: true
    },

    mobileNo: {
        type: Number,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        trim: true
    },

    cgpa: {
        type: Number,
        required: true,
    },

    jobType: {
        type: String,
    },

    branch: {
        type: String,
        required: true,
    },

    description: { 
        type: String
      },
    resume:{
        type:String
    }

});

// For password hashing
studentSchema.pre("save", async function (next) {
        // console.log(`${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`${this.password}`);
        next();
});



// Creating New Collection
const studentlogin = new mongoose.model("StudentSchema", studentSchema);

module.exports = studentlogin;