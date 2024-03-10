const e = require('express');
const userService = require('../services/user.service');

// Signup
exports.signup = (req, res) => {
    console.log("\nSIGNUP");

    userService.signup(req.body, (err, result) => {
        if(err){
            console.log(err);
            res.send(err);
        }
        else{
            console.log(result);
            res.send(result);
        }
    })
}

// Login
exports.login = (req, res) => {
    console.log("\nLOGIN");

    userService.login(req.body, (err, result) => {
        if(err){
            console.log(err);
            res.send(err);
        }
        else{
            console.log(result);
            res.send(result);
        }
    })
}