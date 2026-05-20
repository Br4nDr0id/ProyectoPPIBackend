import{getProductoPorId, getProductos,getCategorias, postProducto, putProducto, deleteProducto, getMisProductos } from '../controller/ProductosController.js'

import express from 'express'

import verificarToken from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'
const router = express.Router()

//Rutas publicas no requieren token

// GET /api/productos — lista todos los productos
router.get("/productos",getProductos)
// GET /api/productos/:id — obtiene un producto por ID
router.get("/productos/:id", getProductoPorId)
router.get("/categorias",     getCategorias)

// Rutas protegidas — requieren token JWT
router.get("/mis-productos",    verificarToken, getMisProductos)
router.post("/productos",       verificarToken, upload.single('imagen'), postProducto)
router.put("/productos/:id",    verificarToken, upload.single('imagen'), putProducto)
router.delete("/productos/:id", verificarToken, deleteProducto)


export default router