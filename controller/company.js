const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
const companylogin = require('../model/company');
const studentdetail = require('../model/student');
const appliedStd = require('../model/applyincomp');
var nodemailer = require('nodemailer');
const crypto = require("crypto");
var sess;
var img;
const session = require('express-session');
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

var companyLogin;
var cmpEmail;

exports.companyLogin = (req, res, next) => {
    res.render("company/companylogin", { pageTitle: "Company Login", errorMessage: req.flash('error') });
};

exports.companyLoginPost = async (req, res, next) => {
    sess = req.session;
    sess.cemail = req.body.cemail;
    try {
        const cemail = req.body.cemail;
        const pass = req.body.cpwd;
        cmpEmail = cemail;
        companyLogin = await companylogin.findOne({ cemail: cemail });

        const isMatch = await bcrypt.compare(pass, companyLogin.password);

        if (isMatch) {
            res.status(201).redirect("/company/companyProfile")
        }
        else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/company/companylogin');
        }

    } catch (error) {
        res.status(404).send(error);
    }
};

exports.companyLogout = (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });
}

exports.companyRegister = (req, res, next) => {
    res.render("company/companyRegistration", { pageTitle: "Company Registration", errorMessage: req.flash('error') })
};

exports.companyRegisterPost = async (req, res, next) => {
    const cmail = req.body.cemail;
    const pass = req.body.cpwd;
    const cname = req.body.cname;
    const mNo = req.body.cnumber;
    const address = req.body.caddress;

    const registerCompany = new companylogin({
        cid: crypto.randomInt(0, 1000),
        cemail: cmail,
        password: pass,
        cname: cname,
        mobileNo: mNo,
        address: address,

    });
    if (cmail != "" || pass != "" || cname != "" || mNo != "" || address != "") {
        const register = await registerCompany.save();
        res.status(201).render('company/companylogin', { pageTitle: "Company Login" });
    }
    else {
        req.flash('error', 'Invalid Inputs');
        res.redirect('/company/companyregister');
    }

}

exports.companyProfile = async (req, res, next) => {
    sess = req.session;
    if (sess.cemail) {
        var date;
        var companyDetail = await companylogin.findOne({ cemail: cmpEmail });
        img = companyDetail.cmpImage;
        if (companyDetail.arrivaldate == null) {
            date = new Date().toISOString().slice(0, 10);
        }
        else {
            date = companyDetail.arrivaldate.toISOString().slice(0, 10);

        }
        res.render("company/companyProfile", { compDetails: companyDetail, date: date, pageTitle: "Company Profile" });
    }
    else {
        res.redirect('/company/companylogin');
    }
};

exports.cmpDetail = (req, res, next) => {

    sess = req.session;
    if (sess.cemail) {
        res.render("student/companyDesc", { details: companyLogin.description, img: companyLogin.cmpImage, cname: companyLogin.cname, pageTitle: "Company Description" });
    }
    else {
        res.redirect('/company/companylogin');
    }
}

exports.companyEditDetails = (req, res, next) => {
    sess = req.session;
    if (sess.cemail) {
        var date;
        var companyDetail = companyLogin;
        if (companyDetail.arrivaldate == null) {
            date = new Date().toISOString().slice(0, 10);
        }
        else {
            date = companyDetail.arrivaldate.toISOString().slice(0, 10);

        }


        res.render("company/editCompanyDetail", { compDetails: companyDetail, date: date, pageTitle: "Edit Company" });
    }
    else {
        res.redirect('/company/companylogin');
    }
};

exports.companyEditDetailsPost = async (req, res, next) => {
    var c = parseInt(companyLogin.cid);
    companylogin.findOneAndUpdate({ cid: c }, req.body, async (err, docs) => {
        if (err) {
            console.log("Can Not Retive the data");
        }
        else {
            res.redirect('/company/companyProfile');
        }
    });
};

exports.studentSection = (req, res, next) => {
    sess = req.session;
    if (sess.cemail) {
        studentdetail.find({}, function (err, allDetail) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("company/studentSec", { details: allDetail, img: img, pageTitle: "Student Section" });
            }
        }).sort({ sid: 1 });
    }
    else {
        res.redirect('/company/companylogin');
    }
};

exports.showStudentInfo = (req, res, next) => {
    sess = req.session;
    if (sess.cemail) {
        studentdetail.find({ sid: req.params.sid }, function (err, allDetail) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("company/studentSectionInfo", { stdDetails: allDetail[0], pageTitle: "Student Info" });
            }
        });
    }
    else {
        res.redirect('/company/studentsection');
    }

}

exports.appliedStudentDetails = async (req, res, next) => {
    sess = req.session;
    if (sess.cemail) {
        var companyId = companyLogin;
        var appliedStudentId = await appliedStd.find({ cid: companyId.cid, acceptingStatus: false }, { sid: 1, _id: 0 }).sort({ sid: 1 });
        var astd = appliedStudentId;
        var students = [];
        for (var i = 0; i < astd.length; i++) {
            var sid = await astd[i].sid;

            var studentInfo = await studentdetail.find({ sid: sid })
            students[i] = studentInfo[0];
        }

        res.render("company/showAppliedStudent", { details: students, img: img, pageTitle: "Company Description" });
    }
    else {
        res.redirect('/company/companylogin');
    }
};

exports.acceptApplication = async (req, res, next) => {
    var alreadySented;
    var acceptingSid = parseInt(req.params.sid);
    appliedStd.find({ cid: companyLogin.cid, sid: acceptingSid }, function (err, allDetail) {
        if (err) {
            console.log(err);
        }
        else {
            alreadySented = allDetail[0].acceptingStatus;
        }
    })

    if (alreadySented) {
        res.redirect('/company/appliedStudentDetails');

    }
    else {
        try {

            var semail;
            studentdetail.find({ sid: acceptingSid }, async function (err, allDetail) {
                if (err) {
                    console.log(err);
                }
                else {
                    semail = await allDetail[0].email;
                }
            });

            var acceptingDetail;
            appliedStd.findOneAndUpdate({ cid: companyLogin.cid, sid: acceptingSid }, { acceptingStatus: true }, async function (err, docs) {
                if (err) {
                    console.log("Can Not Retive the data");
                }
                else {
                    acceptingDetail = { "to": semail, "from": companyLogin.cemail };
                    res.render("company/sendAcceptingMail", { acceptDetails: acceptingDetail, img: img, pageTitle: "Company Profile" });
                }
            });

        }
        catch (e) {
            console.log(e);
        }
    }


};

exports.sendMail = async (req, res, next) => {
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
        html: `<b> ${req.body.Description}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);

    res.status(201).redirect('/company/appliedStudentDetails');

};

exports.showAcceptedApplication = async (req, res, next) => {
    sess = req.session;
    if (sess.cemail) {
        var cid = companyLogin.cid;
        var acceptedSid = []
        var sid = await appliedStd.find({ cid, acceptingStatus: true, placed: false, rejected: false }, { sid: 1, _id: 0 });

        sid.forEach(element => {
            acceptedSid.push(element.sid);

        });

        var acceptApplicationStudentDetail = [];
        for (var i = 0; i < acceptedSid.length; i++) {
            var d = await studentdetail.find({ sid: acceptedSid[i] });
            acceptApplicationStudentDetail.push(d[0]);
        }


        res.render('company/showAcceptedStudent', { asd: acceptApplicationStudentDetail, img: img, pageTitle: "Accepted Student Detail" });
    }
    else {
        res.redirect('/company/companylogin');
    }
};

exports.placeStudent = async (req, res, next) => {
    var sid = req.params.sid;
    var cid = companyLogin.cid
    appliedStd.findOneAndUpdate({ cid, sid }, { placed: true, rejected: false })
        .then(data => {
            res.redirect('/company/appliedStudentDetails')
        }).catch(err => {
            console.log(err);
        })
};

exports.rejectStudent = async (req, res, next) => {
    var sid = req.params.sid;
    var cid = companyLogin.cid;
    appliedStd.findOneAndUpdate({ cid, sid }, { placed: false, rejected: true })
        .then(data => {
            res.redirect('/company/appliedStudentDetails');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.placedStudent = async (req, res, send) => {
    var cid = companyLogin.cid
    var d = []
    var dat = []
    await appliedStd.find({ placed: true, rejected: false, cid }).
        then(data => {
            d = data.map(p => {
                return p.sid;
            });
        });

    for (var i = 0; i < d.length; i++) {
        var sd = await studentdetail.find({ sid: d[i] });
        dat[i] = sd[0]
    }
    res.render('company/showPlacedStudent', { asd: dat, pageTitle: "Placed Students" });

}

