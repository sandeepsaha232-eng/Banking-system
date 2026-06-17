const express = require('express')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(cors({
  origin: process.env.CLIENT_ORIGIN ||'http://127.0.0.1:5500', // make it dynamic according to the production
  credentials: true
}));

app.use(cookieParser());
app.use(express.json())

connectDB();

const authRoute = require('./routes/auth.routes');
const walletRoute = require('./routes/wallet.routes')
const transactionRoute = require('./routes/transaction.routes')

app.use('/api/auth',authRoute);
app.use('/api/wallet',walletRoute);
app.use('/api/transaction',transactionRoute);


app.get('/', (req, res) => {
  res.send('server is running');
})

app.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}`)
})


