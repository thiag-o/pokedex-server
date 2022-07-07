import { Router } from 'express'
import axios from 'axios'

const router = Router()

router.get('/pokemons', async (req, res) => {
  const data = await (await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')).data.results
  res.json({ data })
})

export default router
