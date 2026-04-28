import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import ProductosR from './routes/ProductosRoutes.js'
import ComprasR from './routes/ComprasRoutes.js'
import AuthR from  './routes/AuthRoutes.js'


dotenv.config()
const PORT = process.env.PORT

const app = express()

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api", ProductosR)

app.use("/api", ComprasR)

app.use("/api/auth", AuthR)

app.listen(PORT, ()=>{
    console.log(`Conectados a traves del puerto: ${PORT}`)
})
