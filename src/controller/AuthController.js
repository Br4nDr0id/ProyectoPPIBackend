
// Controlador de autenticación: login y registro.

import bcrypt  from 'bcryptjs'
import jwt     from 'jsonwebtoken'
import { buscarPorCorreo, existeCorreo, crearUsuario } from '../model/UsuariosModel.js'

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

export { login, registro }