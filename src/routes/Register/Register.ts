import jwt from 'jsonwebtoken'
import { Router } from 'express'

import database from '../../database/prisma'
const router = Router()

async function getUsers (value: string, data: string) {
  const users = await database.user.findMany({
    where: {
      [value]: data
    }
  })
  return users
}

router.post('/register', async (req, res) => {
  const { username, password, email, name } = req.body

  try {
    const haveEmail = await getUsers('email', email)
    const haveUsuario = await getUsers('username', username)
    if (haveEmail.length > 0) {
      console.log(haveEmail)
      res.statusCode = 400
      res.json({ message: 'email já existente' })
      return
    }
    if (haveUsuario.length > 0) {
      res.statusCode = 400
      res.json({ message: 'usuario já existente' })
      return
    }

    const user = await database.user.create({
      data: {
        username,
        password,
        email,
        name
      }
    })
    const token = jwt.sign({
      user
    }, process.env.SECRET_JWT, { expiresIn: '1h' })
    res.statusCode = 201
    res.json({ token })
  } catch (err) {
    console.log(err)
    res.statusCode = 401
    res.json({ messege: 'error' })
  }
})

export default router
