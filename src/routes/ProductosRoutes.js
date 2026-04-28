import{getProductoPorId, getProductos,getCategorias, postProducto } from '../controller/ProductosController.js'

import express from 'express'

import verificarToken from '../middleware/authMiddleware.js'
const router = express.Router()

//Rutas publicas no requieren token

// GET /api/productos — lista todos los productos
router.get("/productos",getProductos)
// GET /api/productos/:id — obtiene un producto por ID
router.get("/productos/:id", getProductoPorId)
router.get("/categorias",     getCategorias)  

// Rutas protegidas — requieren token JWT
router.post("/productos", verificarToken, postProducto)


export default router