import 'dotenv/config'
import logger from 'morgan'
import helmet from 'helmet'
import routes from './routes'
const express = require('express')

const app = express()
const port = process.env.PORT || 3000
app.use(logger('dev'))
app.use(helmet())
app.use(express.json())
app.use(routes)
app.listen(port, () =>
  console.log(`Server is listening on 🟢 http://localhost:${port}`),
)
