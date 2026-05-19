import {sql, poolConnect} from '../config/db.js'

const listarProductos = async (req, res) => {
    try {

        const con = await poolConnect
        const resul = await con.request().query('EXEC sp_listar_pp')
        return resul.recordset


    } catch (error) {
        throw error
    }
}

// ── Obtener un producto por su ID ────────────────────────────
// Ejecuta el stored procedure sp_obtener_producto pasándole
// el id del producto como parámetro.
// Retorna un solo objeto con todos los datos del producto
// incluyendo nombre del vendedor, correo, teléfono y categoría.
// Si no existe el producto, retorna undefined.
const obtenerProductoPorId = async (id) => {
    try {
        const con = await poolConnect
        const result = await con.request()
            .input('pid', sql.Int, id) // parámetro seguro contra SQL injection
            .query(`EXEC sp_obtener_producto @id_producto= @pid`)
        return result.recordset[0] // retorna el primer resultado o undefined
    } catch (error) {
        throw error
    }
}

// ── Listar categorías activas ────────────────────────────────
// Se usa en el formulario de publicar para mostrar el selector.
const listarCategorias = async () => {
  try {
    const con = await poolConnect
    const result = await con.request().query('EXEC sp_listar_categorias')
    return result.recordset
  } catch (error) {
    throw error
  }
}

// ── Crear nuevo producto ─────────────────────────────────────
// Recibe todos los datos del formulario y los inserta en la BD.
// El id_vendedor viene del token JWT del usuario logueado.
const crearProducto = async (datos) => {
  try {
    const { id_vendedor, id_categoria, nombre, descripcion, precio, stock, imagen_url } = datos
    const con = await poolConnect
    await con.request()
      .input('id_vendedor',  sql.Int,          id_vendedor)
      .input('id_categoria', sql.Int,          id_categoria)
      .input('nombre',       sql.VarChar,      nombre)
      .input('descripcion',  sql.VarChar,      descripcion)
      .input('precio',       sql.Decimal,      precio)
      .input('stock',        sql.Int,          stock)
      .input('imagen_url',   sql.VarChar,      imagen_url || null)
      .query(`EXEC sp_crear_producto 
        @id_vendedor=@id_vendedor, 
        @id_categoria=@id_categoria, 
        @nombre=@nombre, 
        @descripcion=@descripcion, 
        @precio=@precio, 
        @stock=@stock, 
        @imagen_url=@imagen_url`)
  } catch (error) {
    console.error('Error en crearProducto:', error.message)
    console.error('Stack completo:', error.stack)
    throw error
  }
}

// ── Actualizar producto ─────────────────────────────────────
// Recibe el ID del producto y los datos a actualizar.
// Actualiza los campos proporcionados en la base de datos.
const actualizarProducto = async (id, datos) => {
  try {
    const { id_categoria, nombre, descripcion, precio, stock, imagen_url } = datos
    const con = await poolConnect
    await con.request()
      .input('pid',          sql.Int,          id)
      .input('id_categoria', sql.Int,          id_categoria)
      .input('nombre',       sql.VarChar,      nombre)
      .input('descripcion',  sql.VarChar,      descripcion)
      .input('precio',       sql.Decimal,      precio)
      .input('stock',        sql.Int,          stock)
      .input('imagen_url',   sql.VarChar,      imagen_url || null)
      .query(`EXEC sp_actualizar_producto 
        @id_producto=@pid, 
        @id_categoria=@id_categoria, 
        @nombre=@nombre, 
        @descripcion=@descripcion, 
        @precio=@precio, 
        @stock=@stock, 
        @imagen_url=@imagen_url`)
  } catch (error) {
    console.error('Error en actualizarProducto:', error.message)
    throw error
  }
}

// ── Eliminar producto ───────────────────────────────────────
// Recibe el ID del producto y lo elimina de la base de datos.
const eliminarProducto = async (id) => {
  try {
    const con = await poolConnect
    await con.request()
      .input('pid', sql.Int, id)
      .query('EXEC sp_eliminar_producto @id_producto=@pid')
  } catch (error) {
    console.error('Error en eliminarProducto:', error.message)
    throw error
  }
}


export { listarProductos, obtenerProductoPorId, listarCategorias, crearProducto, actualizarProducto, eliminarProducto }