import mongoose, { Schema } from "mongoose";

const albumSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            required:true,
        },
        artists:
        [
            {
                type: Schema.Types.ObjectId,
                ref:"User",
                required:true,
            },
        ],
        duration:{
            type:Number,
            max:36000,
            required:true,
        },
        publisher:{
            type: Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }
    }
,{timestamps:true})