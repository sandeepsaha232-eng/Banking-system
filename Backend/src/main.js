const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

connectDB()

const authRoute = require('./routes/auth.routes');

app.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('server is running');
})

app.use('/api/auth',authRoute);

