const express = require('express');
const app = express();
const adminlogin = require('../model/admin');
const bcrypt = require("bcrypt");
const axios = require("axios");
var studentlogin = require('../model/student');
const collegeData = require('../model/college');
const companydata = require('../model/company');
const queAns = require('../model/qNa');
const appliedStd = require('../model/applyincomp');

var sess;
const session = require('express-session');

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

exports.adminlogin = (req, res) => {
    res.render('admin/adminlogin', { pageTitle: "Admin Login", errorMessage: req.flash('error') })
};

exports.adminloginPost = async (req, res, next) => {
    sess = req.session;
    sess.aid = req.body.aid;
    if (sess.aid) {
        try {
            const aid = (req.body.aid);
            const pass = req.body.apass;
            // console.log(aid);
            const adminLogin = await adminlogin.findOne({ aid: aid });

            const isMatch = await bcrypt.compare(pass, adminLogin.password);
            // console.log(isMatch);
            if (isMatch) {
                res.status(201).redirect("/admin/adminProfile");
            }
            else {
                req.flash('error', 'Invalid id or password.');
                res.redirect('/admin/adminlogin');
            }

        } catch (error) {
            req.flash('error', 'Invalid id or password.');
            res.redirect('/admin/adminlogin');
        }
    }
};

exports.adminLogout = (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });
}


exports.adminProfile = (req, res, next) => {
    sess = req.session;
    if (sess.aid) {
        studentlogin.count({}, function (err, stdcount) {
            companydata.count({}, function (err, comCount) {
                collegeData.count({}, function (err, collegeCount) {
                    res.render("admin/adminProfile", { pageTitle: "Admin Profile", stdCount: stdcount, compCount: comCount, collegeCount: collegeCount });

                })
            })
        })
    }
    else {
        res.redirect('/admin/adminlogin');
    }
};

exports.adminStudent = (req, res, next) => {
    // make get req to admin/student
    sess = req.session;
    if (sess.aid) {
        try {
            axios.get('http://localhost:5000/admin/student')
                .then(function (response) {
                    res.render("admin/adminStudentData", { student: response.data, pageTitle: "Student Data" })

                })
                .catch(err => {
                    res.send(err)
                });

        } catch (error) {
            res.status(404).send(error);
        }
    }
    else {
        res.redirect('/admin/adminlogin');
    }
};

exports.adminNewStudent = (req, res, next) => {
    sess = req.session;
    if (sess.aid) {
        try {
            res.render("admin/adminNewStudent", { pageTitle: " Add Stduent Data" });
        } catch (error) {
            res.status(404).send(error);
        }
    }
    else {
        res.redirect('/admin/adminlogin');
    }
}


exports.adminUpdateStudent = (req, res, next) => {
    sess = req.session;
    if (sess.aid) {
        try {
            var sid = (req.params.sid);
            studentlogin.findOne({ sid: sid }, req.body, { new: true }, (err, docs) => {
                if (err) {
                    console.log("Can Not Retive the data");
                    next(err)
                }
                else {
                    res.render('admin/adminUpdatestudentData', { pageTitle: "Admin Update Student", student: docs });
                }
            });
        } catch (error) {
            res.status(404).send(error);
        }
    }
    else {
        res.redirect('/admin/adminlogin');
    }

};

exports.adminUpdateStudentPost = async (req, res, next) => {
    sess = req.session;
    if (sess.aid) {
        try {
            var sid = (req.params.sid);
            var s = parseInt(sid);
            var usname = req.body.sname;
            var upass = await bcrypt.hash(req.body.password, 10);
            var umn = parseInt(req.body.mobileNo);
            var uemail = req.body.email;
            var uaddr = req.body.address;
            var ucgpa = parseInt(req.body.cgpa);
            var ujt = req.body.jobType;
            var ubranch = req.body.branch;
            studentlogin.findOneAndUpdate({ sid: s }, { sname: usname, mobileNo: umn, emai: uemail, address: uaddr, cgpa: ucgpa, jobType: ujt, branch: ubranch, password: upass }, (err, docs) => {
                if (err) {
                    console.log("Can Not Update");
                    next(err)
                }
                else {
                    console.log('updated succesfully');
                    axios.get('http://localhost:5000/admin/student')
                        .then(function (response) {
                            res.redirect("/admin/adminStudent");

                        })
                        .catch(err => {
                            res.send(err)
                        })

                }
            });
        } catch (error) {
            console.log(error);
            res.status(404).send(error);
        }
    }
    else {
        res.redirect('/admin/adminlogin');
    }
};

exports.adminDeleteStudent = (req, res, next) => {
    sess = req.session;
    if (sess.aid) {
        try {
            studentlogin.findOneAndDelete({ sid: req.params.sid }, (err, docs) => {
                if (err) {
                    console.log("Something went wrong for delete");
                }
                else {
                    console.log("Delete Successfully");
                    res.redirect("/admin/adminStudent");
                }

            });
        } catch (error) {
            res.status(404).send(error);
        }
    }
    else {
        res.redirect('/admin/adminlogin');
    }
};


exports.adminNewCollegeData = (req, res, next) => {
    sess = req.session;
    if (sess.aid) {
        try {
            res.render("admin/adminNewCollegeData", { pageTitle: " Add College Data" });
        } catch (error) {
            res.status(404).send(error);
        }
    }
    else {
        res.redirect('/admin/adminlogin');
    }
};

exports.adminCollegeData = (req, res, next) => {
    sess = req.session;
    if (sess.aid) {
        try {
            // make get req to admin/College
            axios.get('http://localhost:5000/admin/college')
                .then(function (response) {
                    res.render("admin/adminCollegeData", { data: response.data, pageTitle: "College Data" });
                })
                .catch(err => {
                    res.send(err)
                });
        } catch (error) {
            res.status(404).send(error);
        }
    }
    else {
        res.redirect('/admin/adminlogin');
    }
};

exports.adminQuestionSection = (req, res, next) => {
    sess = req.session;
    if (sess.aid) {
        try {
            queAns.find({ answer: "" }, function (err, questions) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render("admin/adminQuestionSection", { question: questions, pageTitle: "Admin Question Section" });
                }
            });
        } catch (error) {
            res.status(404).send(error);
        }
    }
    else {
        res.redirect('/admin/adminlogin');
    }
};


exports.adminQuestionSectionPost = async (req, res, next) => {
    sess = req.session;
    if (sess.aid) {
        try {
            console.log(req.body);
            var _id = req.body._id;
            var ans = req.body.answer
            queAns.findByIdAndUpdate({ _id: _id }, { answer: ans }, (err, doc) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect("/admin/adminQuestionSection")
                }
            });
        } catch (error) {
            res.status(404).send(error);
        }
    }
    else {
        res.redirect('/admin/adminlogin');
    }
};

exports.adminCompany = (req, res, next) => {
    sess = req.session;
    if (sess.aid) {
        try {
            axios.get('http://localhost:5000/admin/Company')
                .then(function (response) {
                    res.render("admin/adminCompanyData", { Company: response.data, pageTitle: "Student Data" })

                })
                .catch(err => {
                    res.send(err)
                });
        } catch (error) {
            res.status(404).send(error);
        }
    }
    else {
        res.redirect('/admin/adminlogin');
    }
};


exports.placedStudent = async (req, res, next) => {
    var sd = []
    var cd = []
    var sdata = []
    var cdata = []
    await appliedStd.find({ placed: true, rejected: false }).
        then(data => {
            // console.log(data);
            sd = data.map(p => {
                return p.sid;
            });
            cd = data.map(p => {
                return p.cid;
            })
        });


    for (var i = 0; i < sd.length; i++) {
        var d = await studentlogin.find({ sid: sd[i] });
        sdata[i] = d[0]
    }

    for (var i = 0; i < cd.length; i++) {
        var d = await companydata.find({ cid: cd[i] });
        cdata[i] = d[0]
    }
    res.render('admin/adminPlacedStudent', { sdata: sdata, cdata: cdata, pageTitle: "Placed Students" });
}