const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    aid: {
        type: Number,
        required: true,
        unique: true
    },


    password: {
        type: String,
        required: true,
        trim: true
    },

    aname: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

});

// For password hashing
adminSchema.pre("save", async function (next) {
    // console.log(`${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    // console.log(`${this.password}`);
    next();
});

// Creating New Collection
const adminlogin = new mongoose.model("AdminSchema", adminSchema);

module.exports = adminlogin;