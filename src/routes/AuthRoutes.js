
// Rutas de autenticación.

import express from 'express'
import { login, registro, getPerfil, putPerfil, deletePerfil } from '../controller/AuthController.js'
import verificarToken from '../middleware/authMiddleware.js'

const router = express.Router()

// POST /api/auth/login
router.post('/login', login)

// POST /api/auth/registro
router.post('/registro', registro)

// Rutas protegidas — requieren token JWT
// GET /api/auth/perfil — obtener perfil propio
router.get('/perfil', verificarToken, getPerfil)

// PUT /api/auth/perfil — actualizar perfil propio
router.put('/perfil', verificarToken, putPerfil)

// DELETE /api/auth/perfil — eliminar cuenta propia
router.delete('/perfil', verificarToken, deletePerfil)

export default router