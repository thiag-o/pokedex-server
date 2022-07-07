import axios from 'axios'

export async function getAllPokemons () {
  return await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
}
