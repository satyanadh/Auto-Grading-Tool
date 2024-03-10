const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// AssignmentsQuizzes Schema
const assgQuizSchema = new Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    type:{
        type: String,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type: String,
        reqiured: true
    },
    dueDate:{
        //type: Date,
        type: String,
        required: true
    },
    totalPoints:{
        type: Number,
        required: true
    },
    questions:[{
        name:{
            type:String,
        },
        description:{
            type:String,
        },
        points:{
            type:Number,
        },
        funcDef:{
            type:String,
        },
        solution:{
            type:String,
        },
        testCases:{
            type:Array  
        },
    }],
});

const assgQuizModel = mongoose.model('assignmentsQuizzes', assgQuizSchema);

module.exports = assgQuizModel;