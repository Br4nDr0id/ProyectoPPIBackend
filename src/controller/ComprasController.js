import {listarCompras} from '../model/ComprasModel.js'

const getCompras = async (req, res) => {
    try{
        const compras = await listarCompras()
        res.status(200).json({
            success: true,
            data: compras
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las compras',
            error: error.message
         })
    }
}
export {getCompras}