import mongoose, { Schema } from 'mongoose'

const SeriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: {
            values: ["Free", "Primium", "Restricted"],
            message: "Please define the type of quiz it is!"
        },
        required: true,
    },
    visibility: {
        type: Boolean,
        required: true
    },
    publishOn: {
        type: Date,
        default: Date.now()
    },
    totalTime: {
        type: Number,
        default: null,  // Null means: unlimited time
        validate: [time => time === null || time >= 0, 'Total time must be a positive number or null']
    },
    expiresOn: {
        type: Date,
        default: null,  // Null means ==> No expiry || If mentioned date then it will expire on given date
        validate: [expireDate => !expireDate || expireDate > Date.now(), 'Expire date must be in the future']
    },
    quizes: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'quizes'
    },
    continuous: {
        type: Boolean,
        default: false
    },
    registered: {
        type: Schema.Types.ObjectId,
        ref: 'forms',
        default: null,  // Null means ==> No restriction anyone can participate on this exam
    },
    enquiry: {
        type: [mongoose.Types.ObjectId],
        ref: 'forms',
        default: null
    }
})

const series = mongoose.model('series', SeriesSchema)

export default series