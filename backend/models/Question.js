import mongoose, { Schema } from 'mongoose'

const QuestionSchema = new Schema({
    question: {
        type: String,   // It should store html string and will be parsed into react code
        required: true,
        trim: true
    },
    section: {
        type: String,
    },
    options: {
        type: [String],
        default: [],
    },
    images: {
        type: [String]
    },
    answers: {
        type: [String],
        required: true,
    },
    marks: {
        type: Number,
        default: 1
    },
    type: {
        type: String,
        enum: ["single_choice", "multi_choice", "short_answer", "long_answer"],
        default: "single_choice",
    }
}, { timestamps: true })

const question = mongoose.model('questions', QuestionSchema)

export default question