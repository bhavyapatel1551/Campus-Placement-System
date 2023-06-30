const express = require('express');
const routerCmp = express.Router();
const app = express();
const path = require('path');
const companyController=require('../controller/company');

const template_path = path.join(__dirname, "../templates/views");
app.set("view engine", "hbs");
app.set("views", template_path);


// Company Login 
routerCmp.get('/companylogin', companyController.companyLogin);


// Post Detail Of Login To Verify
routerCmp.post('/companylogin',companyController.companyLoginPost);

// Registration Page direction of Company
routerCmp.get('/companyregister', companyController.companyRegister);

// Posting Registration Details in Database
routerCmp.post('/companyregister', companyController.companyRegisterPost);


// Logout From Company
routerCmp.get('/logout',companyController.companyLogout);

// Company Profile Page
routerCmp.get('/companyProfile', companyController.companyProfile);

routerCmp.get('/companyDetail',companyController.cmpDetail);


// Edit Company Info 
routerCmp.get('/companyeditdetails', companyController.companyEditDetails);

// Posting Updated Details of the Company
routerCmp.post('/companyeditdetails', companyController.companyEditDetailsPost);


// Student Info Table
routerCmp.get('/studentsection',companyController.studentSection);

// Showing Info About Perticular Student 
routerCmp.get('/showStudentInfo/:sid',companyController.showStudentInfo);

// Getting Applied Student Details
routerCmp.get('/appliedStudentDetails', companyController.appliedStudentDetails);

// Accepting Application of the Student
routerCmp.get('/acceptApplication/:sid',companyController.acceptApplication);

// Sending Mail to Student
routerCmp.post('/sendMail',companyController.sendMail);

// Getting Display Accepted Student
routerCmp.get('/acceptedStudent',companyController.showAcceptedApplication);

routerCmp.get('/placeStudent/:sid',companyController.placeStudent);

routerCmp.get('/placedStudent',companyController.placedStudent);

routerCmp.get('/rejectedStudent/:sid',companyController.rejectStudent);


module.exports = routerCmp;
