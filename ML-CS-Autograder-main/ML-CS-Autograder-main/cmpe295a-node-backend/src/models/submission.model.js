const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    assignmentQuiz: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'assignmentsQuizzes',
        required: true
    },
    student: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    answers:[{
        question:{
            // type:String,
            type:mongoose.Schema.Types.ObjectId,
            ref: 'assignmentsQuizzes.questions',
        },
        fileURL:{
            type:String,
        },
        points:{
            type:Number,
            default: 0
        }
    }],
    score:{
        type: Number,
        required:true,
        default: 0
    },
    dateSubmitted:{
        //type: Date,
        type: String,
        required: true
    }
})

const submissionModel = mongoose.model('submissions', submissionSchema);

module.exports = submissionModel;