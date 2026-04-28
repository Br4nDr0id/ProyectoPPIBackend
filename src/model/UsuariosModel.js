import {sql, poolConnect} from '../config/db.js'

//--Buscamos el usuario por correo
// usamos el login para identificar si el correo existe
// retorna el registro completo del usuario 
//

const buscarPorCorreo = async (correo) =>{
    const con = await poolConnect
    const result = await con.request()
        .input('correo', sql.VarChar, correo) // sql.VarChar evita SQL injection
        .query('SELECT * FROM  dbo.Usuarios  WHERE correo = @correo')
    return result.recordset[0] //undefined si no existe
}
const existeCorreo = async (correo) => {
    const con = await poolConnect
    const result = await con.request()
        .input('correo', sql.VarChar, correo)
        .query('SELECT COUNT(*) as total FROM dbo.Usuarios WHERE correo = @correo')
    return result.recordset[0].total > 0 // true si ya existe
}

// ── Verificar si un correo ya está registrado ────────────
// Retorna true si el correo ya existe en la BD.

const crearUsuario = async (datos) => {
  const { nombre, apellido, correo, contrasena, rol, telefono, carrera, semestre } = datos
  const con = await poolConnect
  await con.request()
    .input('nombre',     sql.VarChar,  nombre)
    .input('apellido',   sql.VarChar,  apellido)
    .input('correo',     sql.VarChar,  correo)
    .input('contrasena', sql.VarChar,  contrasena)
    .input('rol',        sql.VarChar,  rol || 'estudiante')
    .input('telefono',   sql.VarChar,  telefono  || null)
    .input('carrera',    sql.VarChar,  carrera   || null)
    .input('semestre',   sql.Int,      semestre  || null)
    .query(`
      INSERT INTO dbo.Usuarios 
        (nombre, apellido, correo, contrasena, rol, telefono, carrera, semestre, activo, fecha_registro)
      VALUES 
        (@nombre, @apellido, @correo, @contrasena, @rol, @telefono, @carrera, @semestre, 1, GETDATE())
    `)
}
 
export { buscarPorCorreo, existeCorreo, crearUsuario }