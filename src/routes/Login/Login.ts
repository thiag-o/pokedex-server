import { Router } from 'express'
import database from '../../database/prisma'
import jwt from 'jsonwebtoken'
const router = Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await database.user.findUnique({
      where: {
        username
      }
    })

    if (user.password === password) {
      const token = jwt.sign({
        user
      }, process.env.SECRET_JWT, { expiresIn: '1h' })
      res.statusCode = 200
      res.json({ token })
    } else throw new Error('Senha incorreta')
  } catch (err) {
    res.statusCode = 401
    res.json({ messege: '' + (err) })
  }
})

export default router
