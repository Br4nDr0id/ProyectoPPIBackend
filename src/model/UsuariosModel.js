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

// ── Obtener usuario por ID ────────────────────────────────
// Retorna los datos de un usuario específico por su ID.
const obtenerUsuarioPorId = async (id) => {
    try {
        const con = await poolConnect
        const result = await con.request()
            .input('id', sql.Int, id)
            .query('EXEC sp_obtener_usuario @id_usuario = @id')
        return result.recordset[0]
    } catch (error) {
        throw error
    }
}

// ── Actualizar usuario ────────────────────────────────────
// Actualiza los datos de un usuario. No permite cambiar correo ni contraseña aquí (debería hacerse por separado).
const actualizarUsuario = async (id, datos) => {
    try {
        const { nombre, apellido, telefono, carrera, semestre } = datos
        const con = await poolConnect
        await con.request()
            .input('id',         sql.Int,     id)
            .input('nombre',     sql.VarChar, nombre)
            .input('apellido',   sql.VarChar, apellido)
            .input('telefono',   sql.VarChar, telefono || null)
            .input('carrera',    sql.VarChar, carrera  || null)
            .input('semestre',   sql.Int,     semestre || null)
            .query(`EXEC sp_actualizar_usuario 
                @id_usuario = @id,
                @nombre = @nombre,
                @apellido = @apellido,
                @telefono = @telefono,
                @carrera = @carrera,
                @semestre = @semestre`)
    } catch (error) {
        throw error
    }
}

// ── Eliminar usuario ──────────────────────────────────────
// Elimina un usuario de la base de datos (soft delete recomendado en producción).
const eliminarUsuario = async (id) => {
    try {
        const con = await poolConnect
        await con.request()
            .input('id', sql.Int, id)
            .query('EXEC sp_eliminar_usuario @id_usuario = @id')
    } catch (error) {
        throw error
    }
}
 
export { buscarPorCorreo, existeCorreo, crearUsuario, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario }