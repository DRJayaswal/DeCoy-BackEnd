import mongoose, { Schema } from "mongoose";

const songSchema = new mongoose.Schema(
    {
        songName: {
            type: String,
            required: true,
            trim: true,
        },
        songArtistList: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        songDuration: {
            type: Number,
            required: [true, "Duration is required"],
            max: 36000,
        },
        songAlbum: {
            type: Schema.Types.ObjectId,
            ref: "Album",
        },
        songReleaseDate: {
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
