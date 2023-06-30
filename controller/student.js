const express = require('express');
const studentlogin = require('../model/student');
const bcrypt = require("bcrypt");
const app = express();
const cmpdetail = require('../model/company');
var nodemailer = require('nodemailer');
const appliedStd = require('../model/applyincomp');
const queAns = require('../model/qNa');
var studentLogin;
var loginedStudentsId;
var cid;
var sess;

const session = require('express-session');

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

exports.studentLogin = (req, res, next) => {
    res.render("student/studentlogin", { pageTitle: "Student Login", errorMessage: req.flash('error') })
};

exports.studentLoginPost = async (req, res, next) => {
    sess = req.session;
    try {
        const sid = parseInt(req.body.sid);
        loginedStudentsId = sid;
        const pass = req.body.spwd;

        studentLogin = await studentlogin.findOne({ sid: sid });

        const isMatch = await bcrypt.compare(pass, studentLogin.password);

        if (isMatch) {
            sess.sid = req.body.sid;
            res.status(201).redirect("/student/studentProfile");
        }
        else {
            req.flash('error', 'Invalid Enrollment or password.');
            res.redirect('/student/studentlogin');
        }

    } catch (error) {
        res.status(404).send(error);
    }
};

exports.studentLogout = (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });
}


exports.studentProfile = async (req, res, next) => {
    sess = req.session;
    if (sess.sid) {
        var studentDetail = await studentlogin.findOne({ sid: loginedStudentsId });

        res.render("student/studentProfile", { stdDetails: studentDetail, pageTitle: "Student Profile" });
    }

    else {
        res.redirect('/student/studentlogin');
    }

};


exports.companySection = async (req, res, next) => {
    sess = req.session;
    if (sess.sid) {
        var c = await appliedStd.find({ sid: loginedStudentsId });

        cmpdetail.find({}, function (err, allDetail) {
            if (err) {
                console.log(err);
            }
            else {

                c.forEach(element => {
                    for (var i = 0; i < allDetail.length; i++) {
                        if (element.cid == allDetail[i].cid) {
                            // console.log(allDetail);
                            allDetail.splice(i, 1);
                        }
                    }

                });

                const update = allDetail.map(obj => {
                    const { arrivaldate, ...r } = obj;
                    cuo = Object.assign(r, { arrivaldate: new Date(arrivaldate).toLocaleDateString('en-In') });
                    return cuo;
                });
                res.render("student/companySec", { details: update, pageTitle: "Company Section" });
            }
        }).sort({ cid: 1 });
    }
    else {
        res.redirect('/student/studentlogin');
    }
};


exports.companyInfo = (req, res, next) => {
    sess = req.session;
    if (sess.sid) {
        cmpdetail.find({ cid: req.params.cid }, { cname: 1, description: 1, cmpImage: 1, _id: 0 }, function (err, allDetail) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("student/companyDesc", { details: allDetail[0].description, img: allDetail[0].cmpImage, cname: allDetail[0].cname, pageTitle: "Company Description" });
            }
        });
    }
    else {
        res.redirect('/student/studentlogin');
    }

};


exports.applyCompany = async (req, res) => {
    sess = req.session;
    if (sess.sid) {
        try {
            cid = parseInt(req.params.cid);
            var cemail;
            var semail;
            cmpdetail.find({ cid: cid }, function (err, allDetail) {
                if (err) {
                    console.log(err);
                }
                else {
                    cemail = allDetail[0].cemail;
                }
            });

            const a = { "cid": cid, "sid": loginedStudentsId }
            // console.log(a);
            studentlogin.find({ sid: loginedStudentsId }, async function (err, allDetail) {
                if (err) {
                    console.log(err);
                }
                else {
                    semail = allDetail[0].email;
                }
            });


            appliedStd.find({ "sid": loginedStudentsId, "cid": cid }, { cid: 1, sid: 1, _id: 0 }, async function (err, allDetail) {

                if (allDetail.length == 0) {
                    var info = { from: semail, to: cemail };
                    res.render('student/sendMail', { pageTitle: "Send Mail", info: info });


                }
                else {
                    if (allDetail[0].sid == a.sid && allDetail[0].cid == a.cid) {
                        console.log('already applied');
                        res.status(201).redirect('/student/companysection');

                    }
                }

            });

        } catch (error) {
            res.status(400).send(error);
        }
    }
    else {
        res.redirect('/student/studentlogin');
    }
};



exports.sendMail = async (req, res, next) => {
    const addStudentAndCompany = new appliedStd({ cid: cid, sid: loginedStudentsId, jobPost: req.body.jobPost, acceptingStatus: false });

    const saveApplies = await addStudentAndCompany.save();
    let transporter = await nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: "zaria.turcotte@ethereal.email",
            pass: "MASvqpCxSn27Mw48Rz",
        },
    });

    let info = await transporter.sendMail({
        from: `<${req.body.From}>`, // sender address
        to: `${req.body.To}`, // list of receivers
        subject: `${req.body.Subject}`, // Subject line
        text: `${req.body.Description}`, // plain text body
        html: `<b> ${req.body.Description} </b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);

    res.status(201).redirect('/student/companysection');

};

exports.qAndA = (req, res, next) => {
    res.render('student/QandA', { pageTitle: "Question And Answer Section" });
};

exports.qAndAPost = async (req, res, next) => {
    var q = req.body.question;
    if (q.trim() != "") {
        const question = new queAns({
            question: req.body.question,
            answer: ""
        });
        const submitQue = await question.save();
    }

    res.status(200).redirect('/student/studentProfile');

};

exports.showAcceptedCompany = async (req, res, next) => {
    var acceptedCompanyId = [];
    var g = await appliedStd.find({ sid: loginedStudentsId })
    var c = await appliedStd.find({ sid: loginedStudentsId, acceptingStatus: true });

    c.forEach(element => {
        acceptedCompanyId.push(element.cid);
    });
    var acceptedCompanyDetail = [];

    for (var i = 0; i < acceptedCompanyId.length; i++) {
        var d = await cmpdetail.find({ cid: acceptedCompanyId[i] });

        acceptedCompanyDetail.push(d[0]);

    }

    res.render('student/showAcceptedCompany', { acd: acceptedCompanyDetail, d: g, pageTitle: "Accepted Company Detail" });
};


exports.questionAnswer = (req, res, next) => {
    queAns.find({}, function (err, detail) {
        var c = [];

        detail.forEach(element => {
            if (element.answer != "") {
                c.push(element);
            }
        });

        res.render('student/QuestionAndAnswer', { qa: c, pageTitle: "Question Answer" });
    });

};


exports.editDetails = (req, res, next) => {
    var studentDetail = studentLogin;
    res.render('student/editDetails', { pageTitle: 'Edit Student Detail', detail: studentDetail });
}

exports.postEditedDetails = async (req, res, next) => {
    studentlogin.findOneAndUpdate({ sid: loginedStudentsId }
        , req.body, (err, docs) => {
            if (err) {
                console.log('Error');
            }
            else {
                res.redirect('/student/studentProfile');
            }
        });

}