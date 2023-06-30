const express = require('express');
const studentlogin = require('../model/student');
const companylogin = require('../model/company');
const collegeData = require('../model/college');
exports.counts=(req,res,next)=>{
    studentlogin.count({},function(err,stdcount){
        companylogin.count({},function(err,comCount){
                collegeData.count({},function(err,collegeCount){
                    res.render("home",{pageTitle:"Home Page",stdCount:stdcount,compCount:comCount,collegeCount:collegeCount});

                })
        })
    })
}