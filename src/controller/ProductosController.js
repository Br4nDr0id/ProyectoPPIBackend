import {listarProductos, obtenerProductoPorId, listarCategorias, crearProducto, actualizarProducto, eliminarProducto, listarMisProductos, obtenerVendedorProducto } from '../model/ProductosModel.js'

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

        const { id_categoria, nombre, descripcion, precio, stock } = req.body
        const id_vendedor = req.usuario.id_usuario  // viene del middleware JWT

        if (!nombre || !descripcion || !precio || !stock || !id_categoria) {
            return res.status(400).json({ success: false, message: 'Todos los campos son requeridos.' })
        }

        // Si se subió un archivo lo usa; si no, queda null
        let imagen_url = null
        if (req.file) {
            const base = `${req.protocol}://${req.get('host')}`
            imagen_url = `${base}/uploads/${req.file.filename}`
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
        const { id_categoria, nombre, descripcion, precio, stock } = req.body
        const id_vendedor = req.usuario.id_usuario

        // Consulta directa al campo id_vendedor para evitar depender del SP
        const propietario = await obtenerVendedorProducto(id)
        if (!propietario) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' })
        }
        if (Number(propietario.id_vendedor) !== Number(id_vendedor)) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para actualizar este producto.' })
        }

        // Si se subió un archivo usa la nueva ruta; si no, usa la URL que envió el frontend
        let imagen_url
        if (req.file) {
            const base = `${req.protocol}://${req.get('host')}`
            imagen_url = `${base}/uploads/${req.file.filename}`
        } else {
            imagen_url = req.body.imagen_url || null
        }

        await actualizarProducto(id, { id_categoria, nombre, descripcion, precio, stock, imagen_url })
        res.status(200).json({ success: true, message: 'Producto actualizado exitosamente.' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el producto.', error: error.message })
    }
}

// ── GET /api/mis-productos ───────────────────────────────────
// Devuelve solo los productos publicados por el usuario logueado.
const getMisProductos = async (req, res) => {
    try {
        const id_vendedor = req.usuario.id_usuario
        const productos = await listarMisProductos(id_vendedor)
        res.status(200).json({ success: true, data: productos })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener tus productos.', error: error.message })
    }
}

// ── DELETE /api/productos/:id ────────────────────────────────
// Elimina un producto. Solo el vendedor puede eliminar su producto.
const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params
        const id_vendedor = req.usuario.id_usuario

        const propietario = await obtenerVendedorProducto(id)
        if (!propietario) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' })
        }
        if (Number(propietario.id_vendedor) !== Number(id_vendedor)) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este producto.' })
        }

        await eliminarProducto(id)
        res.status(200).json({ success: true, message: 'Producto eliminado exitosamente.' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto.', error: error.message })
    }
}


export { getProductos, getProductoPorId, getCategorias, postProducto, putProducto, deleteProducto, getMisProductos }

