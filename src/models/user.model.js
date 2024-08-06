import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import process from "process"

dotenv.config();

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            unique: true,
            trim: true,
            required: [true, "Username is required"],
            index: true,
        },
        userEmail: {
            type: String,
            unique: true,
            trim: true,
            required: [true, "Email is required"],
            lowercase: true,
            index: true,
        },
        userContact: {
            type: Number,
            unique: true,
            required: [true, "Contact number is required"],
            max: 9999999999,
            index: true,
        },
        userPassword: {
            type: String,
            required: [true, "Password is required"],
        },
        userHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Song",
            },
        ],
        userPlaylists: [
            {
                type: Schema.Types.ObjectId,
                ref: "Playlist",
            },
        ],
        refreshToken:{
            type: String,
            value: ""
        },
        userAlbums: [
            {
                type: Schema.Types.ObjectId,
                ref: "Album",
            },
        ],
    },{ timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("userPassword")){
        this.userPassword = await bcrypt.hash(this.userPassword, 10);
        next();
    }else{
        return next();
    }
});

userSchema.methods.passwordChecker = async function (password) {
    return await bcrypt.compare(password,this.userPassword)
};

userSchema.methods.genAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            userEmail: this.userEmail,
            userContact: this.userContact,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};
userSchema.methods.genRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const User = mongoose.model("User", userSchema);
export default User;