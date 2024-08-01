import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Name is required"],
        },
        username: {
            type: String,
            unique: true,
            trim: true,
            required: [true, "Username is required"],
            index: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            required: [true, "Email is required"],
            lowercase: true,
            index: true,
        },
        contact: {
            type: Number,
            unique: true,
            required: [true, "Contact number is required"],
            max: 9999999999,
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        history: [
            {
                type: Schema.Types.ObjectId,
                ref: "Song",
            },
        ],
        playlist: [
            {
                type: Schema.Types.ObjectId,
                ref: "Playlist",
            },
        ],
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.passwordChecker = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.genAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            contact: this.contact,
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