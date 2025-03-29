import express from "express";
import mongodb from 'mongodb'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT

const app = express()


app.use('/', (req,res) =>{
  res.send('student platform')
})


app.listen(port, () =>{
  console.log(`Student server is on ${port}`)
})