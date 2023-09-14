import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createError } from "../utils/createError.js"

export const register = async (req, res, next) => {
  try {
    if (req.body.password !== req.body.repeatPassword) {
      return next(createError(401, "Password doesn't matched"))
    }

    const existingUser = await User.find({ email: req.body.email })
    if (existingUser.length) {
      return next(createError(403, "Email is already registered"))
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    })

    const result = await newUser.save()
    const { password, ...info } = result._doc
    res.status(201).json(info)
    console.log(info)
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
  
    if (!user) {
      return next(createError(403, "Register your email first"))
    }
  
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      return next(createError(403, "Wrong password"))
    }
  
    const jwtKey = process.env.JWT_KEY
    const payload = { userId: user._id }
  
    const token = jwt.sign(payload, jwtKey, { expiresIn: "12h" })
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        origin: 'https://invoice-by-grind.netlify.app'
      })
      .status(200)
      .json({ userId: user._id.toString() })
  }
  catch(err) {
    next(err)
  }
  
}
