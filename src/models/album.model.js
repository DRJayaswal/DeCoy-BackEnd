import mongoose, { Schema } from "mongoose";

const albumSchema = new mongoose.Schema(
    {
        albumName:{
            type:String,
            trim:true,
            required:true,
        },
        albumArtistList:
        [
            {
                type: Schema.Types.ObjectId,
                ref:"User",
                required:true,
            },
        ],
        albumTotalSongs:{
            type:Number,
            required:true,
            max:99,
        },
        albumSongList: [
            {
                type: Schema.Types.ObjectId,
                ref: "Song",
                required: true,
            }
        ],
        albumDuration:{
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

const Album = mongoose.model("Album",albumSchema);
export default Album;