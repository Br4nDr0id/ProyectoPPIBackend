import {sql, poolConnect} from '../config/db.js'

const listarCompras = async (req, res) => {
    try {

        const con = await poolConnect
        const resul = await con.request().execute('sp_listar_compras')
        return resul.recordset


    } catch (error) {
        throw error
    }
}

export {listarCompras}