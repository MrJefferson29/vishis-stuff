
const mongoose = require("mongoose")
const Comment = require("./comment")
const slugify = require("slugify")

const StorySchema = new mongoose.Schema({

    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    slug: String,
    title: {
        type: String,
        required: [true, "Input a tracking ID"],
        unique: [true, "That tracking number alredy exists, try another,"],
        minlength: [10, "Tracking number must be 10 characters "],
        maxlength: [10, "Tracking number must be 10 characters"],
    },
    content: {
        type: String,
        required: [true, "Place  status for the package "],
    },
    expect: {
        type: String,
        required: [true, "When should the package be expected"]
    },
    receiver: {
        type: String,
        required: [true, "Input the receiver's name and address"]
    },
    depart: {
        type: String,
        required: [true, "Input when the package was shipped"],
    },
    weight: {
        type: String,
        required: [false, "Please input the package weight"]
    },
    insurrance: {
        type: String,
        required: [true, 'How much is the insurrnce fee']
    },
    readtime: {
        type: Number,
        default: 3
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    comments: [{
            type: mongoose.Schema.ObjectId,
            ref: "Comment"
    }],
    commentCount: {
        type: Number,
        default: 0
    }


}, { timestamps: true })

StorySchema.pre("save",  function (next) {

    if (!this.isModified("title")) {
        next();
    }


    this.slug = this.makeSlug()

    next()

})

StorySchema.pre("remove", async function (next) {

    const story= await Story.findById(this._id)

    await Comment.deleteMany({
        story : story 
    })

})

StorySchema.methods.makeSlug = function () {
    return slugify(this.title, {
        replacement: '-',
        remove: /[*+~.()'"!:@/?]/g,
        lower: true,
        strict: false,
        locale: 'tr',
        trim: true
    })

}

const Story = mongoose.model("Story", StorySchema)

module.exports = Story;
