import mongoose from "mongoose";

const cancelOrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: String,
            required: true,
            trim: true,
        },
        why: {
            type: String,
            required: true,
            trim: true,
        },
        howCanWeImprove: {
            type: String,
            required: true,
            trim: true,
        },
        confirmCancel: {
            type: String,
            required: true,
            enum: ["confirm cancel"], 
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const cancelOrderModel = mongoose.model("CancelOrderReason", cancelOrderSchema);
export default cancelOrderModel;
