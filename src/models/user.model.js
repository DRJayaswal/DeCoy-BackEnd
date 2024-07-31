import mongoose, { mongo, Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const userSchema = new mongoose.Schema(
{
    // id:{
    //     type: String,
    //     unique: true,
    //     trim:true,
    //     index:true
    // },
    name:{
        type: String,
        trim: true,
        required:[true,"Required"],
    },
    username:{
        type: String,
        unique:true,
        trim: true,
        required:[true,"Required"],
        index:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:[true,"Required"],
        lowercase:true,
        index:true
    },
    contact:{
        type:Number,
        unique:true,
        required:[true,"Required"],
        max: 9999999999,
        index:true,
    },
    password:{
        type:String,
        unique:false,
        required:true,
        lowercase:false,
    },
    history:
    [
        {
            type: Schema.Types.ObjectId,
            ref : "Song"
        },
    ],
    playlist:
    [
        {
        type:String,
        unique:true,
        required:true,
        index:true
        },
    ]
}
,
{timestamps:true}
)

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password,10);
    next();
})
userSchema.methods.passwordChecker = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.genAccessToken = async function(){
}
export default User = mongoose.model("User",userSchema);