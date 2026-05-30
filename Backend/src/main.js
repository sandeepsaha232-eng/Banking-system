const express = require('express')
const router = express.Router()
const connectDB = require('./config/db')
require('dotenv').config()

const PORT = process.env.PORT || 3000

const app = express()

connectDB()

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('server is running');
})

