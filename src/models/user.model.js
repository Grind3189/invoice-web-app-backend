import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: String,
    password: String,
    invoices: [{
        type: Schema.Types.ObjectId,
        ref: "Invoice"
    }]
})

const User = mongoose.model("User", userSchema)

export default User