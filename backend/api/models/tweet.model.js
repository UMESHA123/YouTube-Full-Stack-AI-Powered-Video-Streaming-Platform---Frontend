import mongoose, {Schema} from "mongoose";

const tweetCommentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    repostOf: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        default: null
    },
    comments: {
        type: [tweetCommentSchema],
        default: []
    },
}, {timestamps: true})


export const Tweet = mongoose.model("Tweet", tweetSchema)
