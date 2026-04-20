import {sql, poolConnect} from '../config/db.js'

const listarProductos = async (req, res) => {
    try {

        const con = await poolConnect
        const resul = await con.request().execute('sp_listar_pp')
        return resul.recordset


    } catch (error) {
        throw error
    }
}

export {listarProductos}