
// Rutas de autenticación.

import express from 'express'
import { login, registro } from '../controller/AuthController.js'

const router = express.Router()

// POST /api/auth/login
router.post('/login', login)

// POST /api/auth/registro
router.post('/registro', registro)

export default router