import jwt from "jsonwebtoken"

export const isAuth = (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res.status(401).send("Not authenticated")
  }

  let decodedToken

  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY)
  } catch (err) {
    console.error(err)
    return res.status(401).send("Not authenticated")
  }

 
  req.userId = decodedToken.userId
  next()

}
