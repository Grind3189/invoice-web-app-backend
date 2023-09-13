import Invoice from "../models/invoice.model.js"
import User from "../models/user.model.js"
import { createError } from "../utils/createError.js"

export const getAllInvoice = async (req, res, next) => {
  const allInvoice = await Invoice.find({creator: req.userId})
  res.status(200).json(allInvoice)
}

export const getInvoice = async (req, res, next) => {
  const { invoiceId } = req.params
  try {
    const invoice = await Invoice.findById(invoiceId)
    if (!invoice) {
      return next(404,"No invoice with such an id found")
    }
    if(invoice.creator.toString() !== req.userId.toString()) {
      return next(createError(404,"You can't view this invoice"))
    }
    res.status(200).send(invoice)
  } catch (err) {
    next(err)
  }
}

export const createInvoice = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)

    if(!user) {
      return next(createError(403,"No user exist"))
    }

    const {
      id,
      createdAt,
      paymentDue,
      description,
      paymentTerms,
      clientName,
      clientEmail,
      status,
      senderAddress,
      clientAddress,
      total,
      items,
    } = req.body

    const newInvoice = new Invoice({
      id,
      createdAt,
      paymentDue,
      description,
      paymentTerms,
      clientName,
      clientEmail,
      status,
      senderAddress,
      clientAddress,
      items,
      total,
      creator: req.userId
    })

    const result = await newInvoice.save()
    if (!result) {
      return next(createError(403,"An error occured while creating invoice"))
    }

    res.status(201).json(result)
  } catch (err) {
   next(err)
  }
}

export const editInvoice = async (req, res, next) => {
  const invoiceId = req.params.invoiceId
  const {
    createdAt,
    paymentDue,
    description,
    paymentTerms,
    clientName,
    clientEmail,
    status,
    senderAddress,
    clientAddress,
    total,
  } = req.body

  const invoice = await Invoice.findById(invoiceId)

  if (!invoice) {
    return next(createError(404,"No invoice found"))
  }

  if(invoice.creator.toString() !== req.userId.toString()) {
    return next(createError(403,"You can only edit your invoice"))
  }

  invoice.createdAt = createdAt
  invoice.paymentDue = paymentDue
  invoice.description = description
  invoice.paymentTerms = paymentTerms
  invoice.clientName = clientName
  invoice.clientEmail = clientEmail
  invoice.status = status
  invoice.senderAddress = senderAddress
  invoice.clientAddress = clientAddress
  invoice.total = total
  invoice.items = req.body.items

  const result = await invoice.save()
  res.status(201).json(result)
}

export const deleteInvoice = async (req, res, next) => {
  const { invoiceId } = req.params
  try {
    const invoice = await Invoice.findById(invoiceId)
    if(!invoice) {
      return next(createError(404,"Can't find invoice"))
      
    }
    if(invoice.creator.toString() !== req.userId.toString()) {
      return next(createError(403,"You can only delete your own invoice"))
    }

    const result = await Invoice.findByIdAndDelete(invoiceId)
    res.status(202).json(result.id)
  } catch (err) {
    next(err)
  }
}

export const paidInvoice = async (req, res, next) => {
  const { invoiceId } = req.params

  try {
    const invoice = await Invoice.findById(invoiceId)
    if (!invoice) {
      return next(createError(404,"No invoice with such an id exist"))
    }
    if(invoice.creator.toString() !== req.userId.toString()) {
      return next(createError(403,"You cannot edit this invoice"))
    }
    invoice.status = "paid"
    await invoice.save()
    res.status(201).json("Success")
  } catch (err) {
    next(err)
  }
}
