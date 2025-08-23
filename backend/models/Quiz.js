import mongoose, { Schema } from 'mongoose'
import FormSchema from "./Form.js"

const QuizeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quizType: {
        type: String,
        enum: ["Free", "Premium", "Restricted"],
        required: true
    },
    visibility: {
        type: Boolean,
        required: true
    },
    totalTime: {
        type: Number,   // Values in second
        default: null,  // Null means ==> unlimited time,
        validate: [time => time === null || time >= 0, 'Total time must be a positive number or null']
    },
    expireOn: {
        type: Date,
        default: null,  // Null means ==> No expiry || If mentioned date then it will expire on given date
        validate: [expireDate => !expireDate || expireDate > Date.now(), 'Expire date must be in the future']
    },
    questions: {
        type: [Schema.Types.ObjectId],
        ref: 'questions',
        default: []
    },
    sectionSwitch: {
        type: Boolean,
        default: true
    },
    register: {
        type: Schema.Types.ObjectId,
        ref: 'forms',
        default: null,  // Null means ==> No restriction anyone can participate on this exam
    },
    enquiry: {
        type: [mongoose.Types.ObjectId],
        ref: 'forms',
        default: []
    }
}, { timestamps: true })

const quiz = mongoose.model('quizes', QuizeSchema)

export default quiz
