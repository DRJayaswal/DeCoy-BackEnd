import mongoose, { Schema } from "mongoose";

const playlistSchema = new mongoose.Schema(
    {
        playlistName: {
            type: String,
            trim: true,
            required: [true, "Name is required"],
        },
        playlistDuration: {
            type: Number,
            max: 36000,
            required: [true, "Duration is required"],
        },
        playlist: [
            {
                type: Schema.Types.ObjectId,
                ref: "Song",
                required: true,
            }
        ],
        publisher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;