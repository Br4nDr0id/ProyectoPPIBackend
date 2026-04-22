import{getProductos} from '../controller/ProductosController.js'

import express from 'express'

const router = express.Router()

router.get("/productos",getProductos)


export default router