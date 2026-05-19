import {listarProductos, obtenerProductoPorId, listarCategorias, crearProducto, actualizarProducto, eliminarProducto } from '../model/ProductosModel.js'

const getProductos = async (req, res) => {
    try{
        const productos = await listarProductos()
        res.status(200).json({
            success: true,
            data: productos
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los productos',
            error: error.message
         })
    }
}

// ── GET /api/productos/:id ───────────────────────────────────
// Devuelve un producto específico por su ID.
// El ID llega como parámetro en la URL: /api/productos/1
const getProductoPorId = async (req, res) => {
    try {
        const { id } = req.params
        console.log('ID recibido:', id)
        const producto = await obtenerProductoPorId(id)
        console.log('Producto encontrado:', producto) 

        if (!producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' })
        }

        res.status(200).json({ success: true, data: producto })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el producto.', error: error.message })
    }
}
// ── GET /api/categorias ──────────────────────────────────────
// Devuelve todas las categorías activas.
const getCategorias = async (req, res) => {
    try {
        const categorias = await listarCategorias()
        res.status(200).json({ success: true, data: categorias })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener categorías.', error: error.message })
    }
}

// ── POST /api/productos ──────────────────────────────────────
// Crea un nuevo producto. El id_vendedor viene del token JWT.
const postProducto = async (req, res) => {

    try {
        
        const { id_categoria, nombre, descripcion, precio, stock, imagen_url } = req.body
        const id_vendedor = req.usuario.id_usuario  // viene del middleware JWT

        if (!nombre || !descripcion || !precio || !stock || !id_categoria) {
            return res.status(400).json({ success: false, message: 'Todos los campos son requeridos.' })
        }


        await crearProducto({ id_vendedor, id_categoria, nombre, descripcion, precio, stock, imagen_url })
        res.status(201).json({ success: true, message: 'Producto creado exitosamente.' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear el producto.', error: error.message })
    }
}

// ── PUT /api/productos/:id ───────────────────────────────────
// Actualiza un producto existente. Solo el vendedor puede actualizar su producto.
const putProducto = async (req, res) => {
    try {
        const { id } = req.params
        const { id_categoria, nombre, descripcion, precio, stock, imagen_url } = req.body
        const id_vendedor = req.usuario.id_usuario  // viene del middleware JWT

        // Verificar que el producto existe y pertenece al vendedor (esto debería hacerse en el modelo o middleware)
        const producto = await obtenerProductoPorId(id)
        if (!producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' })
        }
        if (producto.id_vendedor !== id_vendedor) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para actualizar este producto.' })
        }

        await actualizarProducto(id, { id_categoria, nombre, descripcion, precio, stock, imagen_url })
        res.status(200).json({ success: true, message: 'Producto actualizado exitosamente.' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto.', error: error.message })
    }
}

// ── DELETE /api/productos/:id ────────────────────────────────
// Elimina un producto. Solo el vendedor puede eliminar su producto.
const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params
        const id_vendedor = req.usuario.id_usuario  // viene del middleware JWT

        // Verificar que el producto existe y pertenece al vendedor
        const producto = await obtenerProductoPorId(id)
        if (!producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' })
        }
        if (producto.id_vendedor !== id_vendedor) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este producto.' })
        }

        await eliminarProducto(id)
        res.status(200).json({ success: true, message: 'Producto eliminado exitosamente.' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto.', error: error.message })
    }
}


export { getProductos, getProductoPorId, getCategorias, postProducto, putProducto, deleteProducto }

