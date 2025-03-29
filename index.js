import express from "express";
import mongodb from 'mongodb'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())
dotenv.config()


app.use('/', (req,res) =>{
  res.send('student platform')
})


app.listen(port, () =>{
  console.log(`Student server is on ${port}`)
})