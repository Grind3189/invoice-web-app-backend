import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors'
import invoiceRouter from './routes/invoice.route.js'
import authRouter from './routes/auth.route.js'
import cookieParser from "cookie-parser";
import path from 'path'
const app = express()
dotenv.config()

const corsOptions = {
    origin: 'https://invoice-duz6.onrender.com',
    methods: 'GET, POST, DELETE, PUT',        
    credentials: true  
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.use('/api', invoiceRouter)
app.use('/api', authRouter)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).send(errorMessage)
})

const dbUrl = process.env.DATABASE_URL
const port = process.env.PORT
mongoose.connect(dbUrl)
    .then(() => {
        app.listen(port, () => {
            console.log('Api running')
        })
    })

    .catch(err => {
        console.log(err)
    })