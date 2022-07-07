const jwt = require('jsonwebtoken')
const middlewareValidateJWT = (req, res, next) => {
  const bearer = req.headers.authorization
  if (!bearer) {
    res.status(400).end()
    return
  }
  const token = bearer.split('Bearer ')[1]
  const chavePrivada = process.env.SECRET_JWT

  jwt.verify(token, chavePrivada, (err, userInfo) => {
    if (err) {
      res.status(204).end()
      return
    }

    req.userInfo = userInfo
    next()
  })
}

export default middlewareValidateJWT
