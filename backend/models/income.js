import mongoose from "mongoose";
// import { trim } from "validator";

const incomeSchema = mongoose.Schema({
    description: {
        type:String,
        required:true
    },
    amount:{
        type: Number,
        required:true
    },
    category:{
        type:String,
        required:true,
    },
    date:{
        type:Number,
        required:true,
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    type:{
        type:String,
        default:"income",
    }

},{
    timestamps:true
});

const incomeModel = mongoose.model.income || mongoose.model("income",incomeSchema);

export default incomeModel;