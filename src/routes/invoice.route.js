import express from "express"
import {
  createInvoice,
  deleteInvoice,
  editInvoice,
  getAllInvoice,
  getInvoice,
  paidInvoice,
} from "../controllers/invoice.controller.js"
import { isAuth } from "../middlewares/isAuth.js"
const router = express.Router()

router.get("/invoice/:invoiceId", isAuth, getInvoice)
router.get("/invoice", isAuth, getAllInvoice)
router.post("/create/invoice", isAuth, createInvoice)
router.put("/edit/invoice/paid/:invoiceId", isAuth, paidInvoice)
router.put("/edit/invoice/:invoiceId", isAuth, editInvoice)
router.delete("/delete/invoice/:invoiceId", isAuth, deleteInvoice)

export default router
