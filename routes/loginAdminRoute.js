const express = require('express');
const routerAdm = express.Router();
const bcrypt = require("bcrypt");
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const adminlogin = require('../model/admin');
const adminController = require('../controller/admin');

const collegeData = require('../model/college');
const companydata = require('../model/company');
const axios = require("axios");
var studentlogin = require('../model/student');
const queAns = require('../model/qNa');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Admin Login 
routerAdm.get('/adminlogin', adminController.adminlogin);

// Admin Login For post method to find entered id and password is right or not
routerAdm.post('/adminlogin', adminController.adminloginPost)


// Admin Logout
routerAdm.get('/logout', adminController.adminLogout);


// Admin profile route
routerAdm.get('/adminProfile', adminController.adminProfile)


// Admin Student Info
routerAdm.get('/adminStudent', adminController.adminStudent);

// Admin Company Section
routerAdm.get('/adminCompany', adminController.adminCompany);


// Admin Adding New Student
routerAdm.get('/adminNewStudent', adminController.adminNewStudent);

// Admin Update Student
routerAdm.get('/adminUpdatestudent/:sid', adminController.adminUpdateStudent);

// Poste Method of admin Update Student
routerAdm.post('/adminUpdatestudent/:sid', adminController.adminUpdateStudentPost);

// Admin Deleting Student
routerAdm.get('/Studentdelete/:sid', adminController.adminDeleteStudent);


// Admin New College Data
routerAdm.get('/adminNewCollegeData', adminController.adminNewCollegeData);

// Admin College Data
routerAdm.get('/adminCollegeData', adminController.adminCollegeData);

// Admin Question Answer Section
routerAdm.get('/adminQuestionSection', adminController.adminQuestionSection);

// Admin Posting Answer Section
routerAdm.post('/adminQuestionSection', adminController.adminQuestionSectionPost);

routerAdm.get('/adminPlacedStudent',adminController.placedStudent);

routerAdm.use('/css', express.static(path.resolve(__dirname, "public/css")));
routerAdm.use('/img', express.static(path.resolve(__dirname, "public/images")));
routerAdm.use('/js', express.static(path.resolve(__dirname, "public/js")));

module.exports = routerAdm;
