import database from '../../database/prisma'
import { Router, Request } from 'express'
import middlewareValidateJWT from '../../middleware/middleware'
import asyncHandler from 'express-async-handler'

export interface userInfoAddToRequest extends Request {
  userInfo: any
}

const router = Router()

async function getPokemonsUser (id: number) {
  const { pokemon } = await database.user.findUnique({
    where: {
      id
    },
    select: {
      pokemon: true
    }
  })

  return pokemon
}

router.get('/user', middlewareValidateJWT, (req: userInfoAddToRequest, res) => {
  res.statusCode = 200
  res.json(req.userInfo)
})

router.post('/user/favPokemon/:id', middlewareValidateJWT, asyncHandler(async (req: userInfoAddToRequest, res) => {
  let pokemonId = req.params.id
  const { id } = req.userInfo.user

  try {
    const pokemon = (await getPokemonsUser(id))
    if (pokemon && pokemon.split(',').find((num) => num === pokemonId)) {
      res.statusCode = 200
      res.json({ messege: 'Pokemon já adicionado' })
      return
    }
    if (pokemon !== null) pokemonId = pokemon + ',' + pokemonId
    const pokemonsList = await database.user.update({
      where: {
        id
      },
      data: {
        pokemon: pokemonId
      }
    })
    res.statusCode = 200
    res.json({ pokemonsList })
  } catch (err) {
    res.statusCode = 500
    res.json({ messege: '' + err })
  }
}))

router.get('/user/favPokemon', middlewareValidateJWT, asyncHandler(async (req: userInfoAddToRequest, res) => {
  const { id } = req.userInfo.user
  try {
    const pokemon = (await getPokemonsUser(id))
    res.statusCode = 200
    res.json({ pokemons: pokemon })
  } catch (err) {
    res.statusCode = 500
    res.json({ messege: '' + err })
  }
}))

router.delete('/user/favPokemon/:id', middlewareValidateJWT, asyncHandler(async (req: userInfoAddToRequest, res) => {
  const { id } = req.userInfo.user
  const pokemonId = req.params.id
  try {
    const pokemon = (await getPokemonsUser(id))
    let pokemonArray = pokemon.split(',').filter((num) => (num !== pokemonId)).join(',')
    if (pokemonArray === '') pokemonArray = null
    await database.user.update({
      where: {
        id
      },
      data: {
        pokemon: pokemonArray
      }
    })
    res.statusCode = 200
    res.json({ pokemons: pokemon })
  } catch (err) {
    res.statusCode = 500
    res.json({ messege: '' + err })
  }
}))

export default router
