const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const companySchema = new mongoose.Schema({
    cid: {
        type: Number,
        required: true,
        unique: true
    },


    password: {
        type: String,
        required: true,
        trim: true
    },

    cname: {
        type: String,
        required: true,
        trim: true
    },

    mobileNo: {
        type: Number,
        required: true,
        unique: true,
    },

    cemail: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        trim: true
    },
    description: {
        type: Object,

    },
    arrivaldate:{
        type:Date
    },
    jobpost:{
        type:String
    },
    cmpImage:{
        type:String
    }


});

// For password hashing
companySchema.pre("save", async function (next) {
    // console.log(`${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    // console.log(`${this.password}`);
    next();
});

// Creating New Collection
const companylogin = new mongoose.model("CompanySchema", companySchema);

module.exports = companylogin;