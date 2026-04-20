import sql from 'mssql'
import dotenv from 'dotenv'
dotenv.config()

const stringCon = {

    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    options:{
        trustServerCertificate: true
    }
}

const poolConnect = new sql.ConnectionPool(stringCon)
    .connect()
    .then(conn =>{
        console.log('Conexión a la base de datos establecida')
        return conn
    })
    .catch(error =>{
        console.error(`Error al conectar a la base de datos: ${error}`)
    })

    export { sql, poolConnect }
