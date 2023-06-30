const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const collegeSchema = new mongoose.Schema({
    sid: {
        type: Number,
        required: true,
        unique: true
    },
    sname: {
        type: String,
        required: true,
        trim: true
    },
    cname: {
        type: String,
        required: true,
        trim: true
    },
    semail: {
        type:String
    },
    startbatchyear:{
        type:String
    },
    endbatchyear:{
        type:String 
    },
    package: {
        type:Number
    },
    


});

// For password hashing
// collegeSchema.pre("save", async function (next) {
//     // console.log(`${this.password}`);
//     // this.password = await bcrypt.hash(this.password, 10);
//     // console.log(`${this.password}`);
//     next();
// });

// Creating New Collection
const collegeData = new mongoose.model("CollegeSchema", collegeSchema);

module.exports = collegeData;