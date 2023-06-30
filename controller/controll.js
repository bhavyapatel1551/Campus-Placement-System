var Stduentdb = require('../model/student');
var Companydb = require('../model/company');
var Collegedb = require('../model/college');
var bcrypt = require('bcrypt');

// create and save new student 
exports.create = async (req, res) => {
    // validate request 
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty" })
        return;
    }

    // new student 
    const student = new Stduentdb({
        sid: req.body.sid,
        password: req.body.password,
        sname: req.body.sname,
        mobileNo: req.body.mobileNo,
        email: req.body.email,
        address: req.body.address,
        jobType: req.body.jobType,
        cgpa: req.body.cgpa,
        branch: req.body.branch
    })

    // save student in db
    student
        .save(student)
        .then(data => {
            // console.log('hi')
            res.redirect('/admin/adminNewStudent')

        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some Error occurred while creating Student Data"
            });
        });
};

// retrive and return all users 
exports.find = (req, res) => {
    if (req.query.sid) {
        const sid = req.query.sid;
        Stduentdb.find({ sid })
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found student with id " + sid })
                }
                else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + sid })
            })
    }
    else {
        Stduentdb.find().sort({ sid: 1 })
            .then(student => {
                res.send(student)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Erro occurred during fatch the data" })
            })
    }
};

// update a new student 
exports.update = async (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const sid = req.params.sid;
    // console.log(sid)
    const pass = await bcrypt.hash(req.body.password, 10);
    var password = pass;
    var sname = req.body.sname;
    var mobileNo = req.body.mobileNo;
    var email = req.body.email;
    var address = req.body.address;
    var jobType = req.body.jobType;
    var cgpa = req.body.cgpa;
    var branch = req.body.branch;
    const c = Stduentdb.findOneAndUpdate(sid, { sname: sname, mobileNo: mobileNo, email: email, address: address, jobType: jobType, cgpa: cgpa, branch: branch, password: pass }, { useFindAndModify: false })
    c.save(c)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update Student with ${sid}. Maybe Student not found!` })
            } else {
                res.redirect('/admin/adminStudent')
            }
        })
        .catch(err => {

            res.status(500).send({ message: `Error Update Student  information` })
        })

};

// delete a student
exports.delete = (req, res) => {
    var sid = req.params.sid;
    // console.log(sid);
    Stduentdb.deleteOne({ sid: sid })
        .then(data => {
            if (!data) {

                res.status(404).send({ message: `Cannot Delete with id ${sid}` })
            }
            else {

                res.send({ message: `${sid} Student Was Deleted successfuly` })
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Coud not delete user with id " + sid })
        })
};


// Admin Data Retrive


// retrive and return all users 
exports.Companyfind = (req, res) => {
    Companydb.find()
        .then(student => {
            res.send(student)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Erro occurred during fatch the data" })
        })

};


// college data 

exports.collegecreate = (req, res) => {
    // validate request 
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty" })
        return;
    }

    // new student 
    const college = new Collegedb({
        sid: req.body.sid,
        sname: req.body.sname,
        cname: req.body.cname,
        semail: req.body.semail,
        batchyear: req.body.batchyear,
        package: req.body.package
    })

    // save student in db
    college
        .save(college)
        .then(data => {
            res.redirect('/admin/adminNewCollegeData')

        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some Error occurred while creating College Data"
            });
        });
};


exports.collegedatafind = (req, res) => {
    Collegedb.find({}).sort({ startbatchyear: 1 })
        .then(colege => {
            res.send(colege)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error occurred during fatch the data" })
        })

};