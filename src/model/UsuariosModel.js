import {sql, poolConnect} from '../config/db.js'

//--Buscamos el usuario por correo
// usamos el login para identificar si el correo existe
// retorna el registro completo del usuario 
//

const buscarPorCorreo = async (correo) => {
    try {
        const con = await poolConnect
        const result = await con.request()
            .input('correo', sql.VarChar, correo)
            .query('EXEC sp_buscar_usuario_correo @correo = @correo')
        return result.recordset[0]
    } catch (error) {
        throw error
    }
}
// ── Verificar si un correo ya está registrado 
const existeCorreo = async (correo) => {
    try {
        const con = await poolConnect
        const result = await con.request()
            .input('correo', sql.VarChar, correo)
            .query('EXEC sp_existe_correo @correo = @correo')
        return result.recordset[0].total > 0
    } catch (error) {
        throw error
    }
}

// ── Verificar si un correo ya está registrado ────────────
// Retorna true si el correo ya existe en la BD.

const crearUsuario = async (datos) => {
    try {
        const { nombre, apellido, correo, contrasena, rol, telefono, carrera, semestre } = datos
        const con = await poolConnect
        await con.request()
            .input('nombre',     sql.VarChar, nombre)
            .input('apellido',   sql.VarChar, apellido)
            .input('correo',     sql.VarChar, correo)
            .input('contrasena', sql.VarChar, contrasena)
            .input('rol',        sql.VarChar, rol || 'estudiante')
            .input('telefono',   sql.VarChar, telefono  || null)
            .input('carrera',    sql.VarChar, carrera   || null)
            .input('semestre',   sql.Int,     semestre  || null)
            .query(`EXEC sp_crear_usuario 
                @nombre = @nombre,
                @apellido = @apellido,
                @correo = @correo,
                @contrasena = @contrasena,
                @rol = @rol,
                @telefono = @telefono,
                @carrera = @carrera,
                @semestre = @semestre`)
    } catch (error) {
        throw error
    }
}
 
export { buscarPorCorreo, existeCorreo, crearUsuario }