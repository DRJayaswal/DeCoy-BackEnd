import mongoose,{Schema} from "mongoose";
const followerSchema = new mongoose.Schema({
    followers:
        {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
        },
    artist:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},{timestamps:true})
const Follower = mongoose.model("Follower",followerSchema)
export default Follower;