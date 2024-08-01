import mongoose, { Schema } from "mongoose";

const songSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        artists: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        duration: {
            type: Number,
            required: [true, "Duration is required"],
            max: 36000,
        },
        album: {
            type: Schema.Types.ObjectId,
            ref: "Album",
        },
        releaseDate: {
            type: String,
            required: [true, "Release date is required"],
            trim: true,
        },
        publisher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Publisher is required"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Song", songSchema);
