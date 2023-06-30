const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/CP1").then(() => {
    console.log("Connection Successful");
}).catch((e) => {
    console.log(e);
});