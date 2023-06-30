const mongoose = require('mongoose');

const applyCompSchema = new mongoose.Schema({
    cid: {
        type: Number,
    },
    sid: {
        type: Number,
    },
    acceptingStatus: {
        type: Boolean,
        default: false
    },
    jobPost: {
        type: String
    },
    placed: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    }
});


const appliedStd = new mongoose.model("AppliedStudent", applyCompSchema);

module.exports = appliedStd;