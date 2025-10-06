const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
    text:{
       type:String,
       required:true, 
    },
    isCorrect:{
        type:Boolean,
        required:true,
    }
})

const questionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        enum:["single","multiple","text"],
        required:true
    },
    options:{
        type:[optionSchema],
        default:[],
        required:true
    },
    answerText:{
        type:String,
        maxlength:300
    },
    quiz:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"Quiz",
        required:true
    }
});

module.exports = mongoose.model("Question",questionSchema);