import {listarProductos} from '../model/ProductosModel.js'

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
export {getProductos}