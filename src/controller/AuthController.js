
// Controlador de autenticación: login y registro.

import bcrypt  from 'bcryptjs'
import jwt     from 'jsonwebtoken'
import { buscarPorCorreo, existeCorreo, crearUsuario, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario } from '../model/UsuariosModel.js'

const JWT_SECRET = process.env.JWT_SECRET || 'markettdea_secret_key'

// ── LOGIN ────────────────────────────────────────────────
// POST /api/auth/login
// Body esperado: { correo, contrasena }
const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body

    // 1. Validar que llegaron los campos
    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos.' })
    }

    // 2. Buscar el usuario en la BD
    const usuario = await buscarPorCorreo(correo)

    // 3. Si no existe, responder con error genérico
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' })
    }

    // 4. Verificar que la cuenta esté activa
    if (!usuario.activo) {
      return res.status(403).json({ mensaje: 'Tu cuenta está inactiva. Contacta al administrador.' })
    }

    // 5. Comparar la contraseña ingresada con el hash de la BD
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena)
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' })
    }

    // 6. Generar el token JWT
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo:     usuario.correo,
        nombre:     usuario.nombre,
        apellido:   usuario.apellido,
        rol:        usuario.rol,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    // 7. Responder con token y datos básicos (NUNCA la contraseña)
    return res.status(200).json({
      mensaje: 'Login exitoso.',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre:     usuario.nombre,
        apellido:   usuario.apellido,
        correo:     usuario.correo,
        rol:        usuario.rol,
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    return res.status(500).json({ mensaje: 'Error interno del servidor.' })
  }
}

// ── REGISTRO ─────────────────────────────────────────────
// POST /api/auth/registro
const registro = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena, rol, telefono, carrera, semestre } = req.body

    // 1. Validar campos obligatorios
    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Nombre, apellido, correo y contraseña son requeridos.' })
    }

    // 2. Verificar que el correo no esté ya registrado
    const yaExiste = await existeCorreo(correo)
    if (yaExiste) {
      return res.status(409).json({ mensaje: 'Este correo ya está registrado.' })
    }

    // 3. Formatear el teléfono — agrega el 57 si no lo tiene
    const telefonoFormateado = telefono
      ? (telefono.startsWith('57') ? telefono : `57${telefono}`)
      : null

    // 4. Encriptar la contraseña antes de guardar
    const hash = await bcrypt.hash(contrasena, 10)

    // 5. Crear el usuario
    await crearUsuario({ nombre, apellido, correo, contrasena: hash, rol, telefono: telefonoFormateado, carrera, semestre })

    return res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' })

  } catch (error) {
    console.error('Error en registro:', error)
    return res.status(500).json({ mensaje: 'Error interno del servidor.' })
  }
}

// ── OBTENER PERFIL DE USUARIO ─────────────────────────────
// GET /api/auth/perfil
// Usa el ID del token JWT para obtener los datos del usuario logueado
const getPerfil = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario
    const usuario = await obtenerUsuarioPorId(id_usuario)

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' })
    }

    // No devolver contraseña
    const { contrasena, ...usuarioSinContrasena } = usuario
    return res.status(200).json({ usuario: usuarioSinContrasena })

  } catch (error) {
    console.error('Error en getPerfil:', error)
    return res.status(500).json({ mensaje: 'Error interno del servidor.' })
  }
}

// ── ACTUALIZAR PERFIL DE USUARIO ─────────────────────────
// PUT /api/auth/perfil
// Permite actualizar nombre, apellido, teléfono, carrera, semestre
const putPerfil = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario
    const { nombre, apellido, telefono, carrera, semestre } = req.body

    // Validar que al menos un campo se proporcione
    if (!nombre && !apellido && !telefono && !carrera && semestre === undefined) {
      return res.status(400).json({ mensaje: 'Debes proporcionar al menos un campo para actualizar.' })
    }

    await actualizarUsuario(id_usuario, { nombre, apellido, telefono, carrera, semestre })
    return res.status(200).json({ mensaje: 'Perfil actualizado exitosamente.' })

  } catch (error) {
    console.error('Error en putPerfil:', error)
    return res.status(500).json({ mensaje: 'Error interno del servidor.' })
  }
}

// ── ELIMINAR CUENTA DE USUARIO ───────────────────────────
// DELETE /api/auth/perfil
// Permite al usuario eliminar su propia cuenta
const deletePerfil = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario

    await eliminarUsuario(id_usuario)
    return res.status(200).json({ mensaje: 'Cuenta eliminada exitosamente.' })

  } catch (error) {
    console.error('Error en deletePerfil:', error)
    return res.status(500).json({ mensaje: 'Error interno del servidor.' })
  }
}

export { login, registro, getPerfil, putPerfil, deletePerfil }