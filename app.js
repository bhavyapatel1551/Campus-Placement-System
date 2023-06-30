const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const path = require('path');

const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const routerStd = require('./routes/loginStudentRoute')
const routerAdm=require('./routes/loginAdminRoute');
const routerCmp=require('./routes/loginCompanyRoute');
const rounterHome=require('./controller/home');
const studentlogin = require('./model/student');
const router = require('./routes/route');
const bcrypt = require("bcrypt");

const sessions = require('express-session');
const flash=require('connect-flash');

require('./db/conn');

const public_path = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "./templates/views");
const partials_path = path.join(__dirname, "./templates/partials");

app.use(bodyparser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", template_path);

app.use(express.static(public_path));
app.use(express.static(path.join(partials_path,'javascript')))
app.use(express.static('images'));

app.use(flash());

// Creating Session
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    resave: false
}));

app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.use(express.json());
app.use(router);
app.use('/student',routerStd);
app.use('/admin',routerAdm);
app.use('/company',routerCmp);
app.get('/', rounterHome.counts);


app.listen(port, () => {
    console.log(`Port Started at ${port}`);
});

