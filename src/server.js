import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import ProductosR from './routes/ProductosRoutes.js'


dotenv.config()
const PORT = process.env.PORT

const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}))

app.use("/api", ProductosR)

app.listen(PORT, ()=>{
    console.log(`Conectados a traves del puerto: ${PORT}`)
})
