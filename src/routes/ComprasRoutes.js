import{getCompras} from '../controller/ComprasController.js'
import express from 'express'

const router = express.Router()

router.get("/compras",getCompras)

export default router