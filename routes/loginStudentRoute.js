const express = require('express');
const app = express();
const routerStd = express.Router();
const bcrypt = require("bcrypt");
const path = require('path');
var session     =   require('express-session');
const bodyParser = require('body-parser');
const studentlogin = require('../model/student');
const cmpdetail = require('../model/company');
const appliedStd = require('../model/applyincomp');
const studentController=require('../controller/student');
const queAns = require('../model/qNa');
var loginedStudentsId;
var studentLogin;
var nodemailer = require('nodemailer');
var cid;

const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");
app.set("view engine", "ejs");
app.set("views", template_path);
app.use(express.json());
routerStd.use(express.json())


// Student Login 
routerStd.get('/studentlogin',studentController.studentLogin);

// Posting Login Detail and Verify
routerStd.post('/studentlogin',studentController.studentLoginPost);

// Student Logout
routerStd.get('/logout',studentController.studentLogout)

// Student Profile Page
routerStd.get('/studentProfile',studentController.studentProfile);



// Upload The Document
routerStd.get('/upload', (req, res) => {
    res.render('upload')
})

// Company Section of 
routerStd.get('/companysection',studentController.companySection);

// Getting Information About Comapny
routerStd.get('/companyInfo/:cid', studentController.companyInfo);


// Applying In Company
routerStd.get('/companyApply/:cid',studentController.applyCompany);

// Sending mail to the company for applying in it
routerStd.post('/sendMail', studentController.sendMail);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Question Section Of Student
routerStd.get('/QandA', studentController.qAndA);

// Question Answer Section
routerStd.get('/questionAnswer',studentController.questionAnswer);

// Postiing The Question To database
routerStd.post('/QandA',studentController.qAndAPost);

// Getting Info About Accepted Company
routerStd.get('/seeAcceptedCompany',studentController.showAcceptedCompany);


routerStd.get('/editDetails',studentController.editDetails);

routerStd.post('/editDetails',studentController.postEditedDetails);


module.exports = routerStd;
