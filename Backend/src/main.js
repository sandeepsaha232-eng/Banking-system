const express = require('express')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser');


require('dotenv').config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(cookieParser());
app.use(express.json())

connectDB();

const authRoute = require('./routes/auth.routes');
const walletRoute = require('./routes/wallet.routes')

app.use('/api/auth',authRoute);
app.use('/api/wallet',walletRoute);

app.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('server is running');
})

