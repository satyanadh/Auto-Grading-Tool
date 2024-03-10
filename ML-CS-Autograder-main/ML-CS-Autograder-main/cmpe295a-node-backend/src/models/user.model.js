const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        reqiured: true,
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    courses:[{ 
        type : mongoose.Schema.Types.ObjectId, 
        ref: 'courses'
    }]
});

// Hash the password
userSchema.pre(
    'save',
    async function(next){
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
        next();
    }
)

// Validate login
userSchema.methods.isValid = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;