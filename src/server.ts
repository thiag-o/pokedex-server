import express from 'express'
import routes from './routes/RoutesMain'
import cors from 'cors'

const app = express()
app.use(cors())

app.use(express.json())

app.get('/', (request, response) => {
  return response.json({ messege: 'Hello World' })
})

app.use(...routes)

app.listen(3333, () => console.log('SERVER START PORT 3333'))
