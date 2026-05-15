const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')  
const cycleRoutes = require('./routes/cycleRoutes')
const chatRoutes = require('./routes/chatRoutes')

dotenv.config({ path: path.join(__dirname, '.env') })
connectDB()

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://period-tracker-riyatripathi.vercel.app'
  ],
  credentials: true
}))
app.use(express.json())
app.use('/api/auth', authRoutes) 
app.use('/api/cycles', cycleRoutes) 
app.use('/api/chat', chatRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Period Tracker API is running 🌸' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})