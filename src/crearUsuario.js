// ============================================================
// src/crearUsuario.js
//
// Script TEMPORAL para crear un usuario de prueba.
// Ejecutar UNA sola vez: node src/crearUsuario.js
// Después puedes borrar este archivo.
// ============================================================

import bcrypt from 'bcryptjs'
import { sql, poolConnect } from './config/db.js'

const crearUsuario = async () => {
  // ── Cambia estos datos a los que quieras ────────────────
  const datos = {
    nombre:     'Juan',
    apellido:   'Pérez',
    correo:     'juan@tdea.edu.co',
    contrasena: '123456',           // Esta es la contraseña que usarás para probar
    rol:        'estudiante',
  }

  // Encripta la contraseña antes de guardar
  const hash = await bcrypt.hash(datos.contrasena, 10)

  const con = await poolConnect
  await con.request()
    .input('nombre',     sql.VarChar, datos.nombre)
    .input('apellido',   sql.VarChar, datos.apellido)
    .input('correo',     sql.VarChar, datos.correo)
    .input('contrasena', sql.VarChar, hash)
    .input('rol',        sql.VarChar, datos.rol)
    .query(`
      INSERT INTO dbo.Usuarios (nombre, apellido, correo, contrasena, rol, activo, fecha_registro)
      VALUES (@nombre, @apellido, @correo, @contrasena, @rol, 1, GETDATE())
    `)

  console.log(' Usuario creado exitosamente')
  console.log(`   Correo:     ${datos.correo}`)
  console.log(`   Contraseña: ${datos.contrasena}`)
  process.exit(0)
}

crearUsuario().catch(err => {
  console.error(' Error al crear usuario:', err)
  process.exit(1)
})