import sql from 'mssql'
import dotenv from 'dotenv'
dotenv.config()

const stringConnection = {

    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    options:{
        trustServerCertificate: true
    }
}

export async function getConnection(){

    try {

        let conn = await sql.connect(stringConnection)
        console.log('Conexión exitosa a la base de datos')
        return conn

    } catch (error) {
        console.error(`Error al conectar a la base de datos: ${error}`)
    }
}