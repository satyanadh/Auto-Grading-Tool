const userModel = require('../models/user.model');

// Signup
exports.signup = async(userReqData, result) => {
    const username = userReqData.username.toLowerCase();
    const email = userReqData.email.toLowerCase();
    const password = userReqData.password;
    const firstName = userReqData.firstName;
    const lastName = userReqData.lastName;
    const role = userReqData.role;

    try {
        const newUser = await userModel.create({
            username,
            email,
            password,
            firstName,
            lastName,
            role,
        });

        const _id = newUser._id;

        // User signup successful
        result(null, {status: true, message:"User Created", user:{ _id, username, email,firstName, lastName, role}});
    }
    catch(err){
        result(null, {status: false, message:"User already exists", user:{username, email}}, err);
    }
}

// Login
exports.login = async(userReqData, result) => {
    const username = userReqData.username;
    const password = userReqData.password;

    try{
        const user = await userModel.findOne({username:username}).populate('courses');

        const validate = await user.isValid(password);

        // Data to send upon login
        userData = {
            _id: user._id,
            username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            courses: user.courses
        }

        // Wrong password
        if(!validate){
            result(null, {status:false, message:"Wrong password", user:{username}});
        }
        // Valid password
        else{
            result(null, {status:true, message:"Login successful", userData});
        }
    }
    catch(err){
        // No such user
        result(null, {status: false, message:"No such user exists", user:{username}}, err);

    }
}