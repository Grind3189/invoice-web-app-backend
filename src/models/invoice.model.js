import mongoose from "mongoose"

const Schema = mongoose.Schema

const invoiceSchema = new Schema({
  id: String,
  createdAt: String,
  paymentDue: String,
  description: String,
  paymentTerms: Number,
  clientName: String,
  clientEmail: String,
  status: String,
  senderAddress: {
    street: String,
    city: String,
    postCode: String,
    country: String,
  },
  clientAddress: {
    street: String,
    city: String,
    postCode: String,
    country: String,
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      total: Number,
    },
  ],
  total: Number,
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
})

const Invoice = mongoose.model("Invoice", invoiceSchema)

export default Invoice
