const express = require('express');
const router = new express.Router();

const studentlogin = require('../model/student');
const companylogin = require('../model/company');
const adminlogin = require('../model/admin');
const appliedStd = require('../model/applyincomp');
const collegedata=require("../model/college");
const controller=require('../controller/controll');

// Student Methods
router.post("/student", async (req, res) => {
    try {
        const addStudentDetail = new studentlogin(req.body);
        const details = await addStudentDetail.save();
        res.status(201).send(details);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/student", async (req, res) => {
    try {
        const getStudent = await studentlogin.find({}).sort({ sid: 1 });
        res.status(201).send(getStudent);

    } catch (e) {
        res.status(400).send(e);
    }
});

// router.get("/student/:sid", async (req, res) => {
//     try {
//         const getStudentById = await studentlogin.find({ sid: req.params.sid }).sort({ sid: 1 });
//         res.status(201).send(getStudentById);

//     } catch (e) {
//         res.status(400).send(e);
//     }
// });


// Comapny Methods
router.post("/company", async (req, res) => {
    try {
        const addCompanyDetail = new companylogin(req.body);
        const details = await addCompanyDetail.save();
        res.status(201).send(details);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/company", async (req, res) => {
    try {
        const getCompany = await companylogin.find({}).sort({ cid: 1 });
        res.status(201).send(getCompany);

    } catch (e) {
        res.status(400).send(e);
    }
});


// Admin Method
router.post("/admin", async (req, res) => {
    try {
        const addAdminDetail = new adminlogin(req.body);
        const details = await addAdminDetail.save();
        res.status(201).send(details);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/appliedStudent/:cid', async (req, res) => {
    try {
        const getAppliedStudent = await appliedStd.find({ cid: req.params.cid });
        res.status(201).send(getAppliedStudent);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
router.get('/aboutus',(req,res,next)=>{
    res.render('aboutus',{ pageTitle: "About us"})
})

router.get('/student/aboutus',(req,res,next)=>{
    res.render('aboutusstd',{ pageTitle: "About us"})
})

router.get('/company/aboutus',(req,res,next)=>{
    res.render('aboutuscmp',{ pageTitle: "About us"})
})
router.get('/admin/aboutus',(req,res,next)=>{
    res.render('aboutusadmin',{ pageTitle: "About us"})
})

// admin manage
//student data

router.post('/admin/student',controller.create);
router.get('/admin/student',controller.find);
router.put('/admin/student/:sid',controller.update);
router.delete('/admin/student/:sid',controller.delete);

router.get('/admin/company',controller.Companyfind);

router.post('/admin/college',controller.collegecreate);
router.get('/admin/college',controller.collegedatafind);


module.exports = router;