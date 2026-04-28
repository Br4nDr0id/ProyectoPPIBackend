// ============================================================
// src/middleware/authMiddleware.js
//
// Middleware que verifica el token JWT en cada petición
// protegida. Si el token es válido, agrega los datos del
// usuario en req.usuario para que el controlador los use.
// ============================================================

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'markettdea_secret_key'

const verificarToken = (req, res, next) => {
  // El token viene en el header Authorization: Bearer <token>
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requerido.' })
  }

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, JWT_SECRET)
    req.usuario = decoded  // agrega los datos del usuario al request
    next()                 // continúa al controlador
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido o expirado.' })
  }
}

export default verificarToken