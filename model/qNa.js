const mongoose = require('mongoose');

const queAnsSchema = new mongoose.Schema({
    question: {
        type: String,
        unique: true
    },
    answer: {
        type: String,
    }
});

const queAns = new mongoose.model("QueAnsSchema", queAnsSchema);

module.exports = queAns;