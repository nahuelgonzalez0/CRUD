import sqlite3 from 'sqlite3';
import { open, Database  } from 'sqlite';
    let db : Database | null
  //si la conexion es exitosa devuelve una promesa resuelta con la instancia de Database
export async function connect(): Promise<Database | null> {
    if (!db) {
        try {
            db  = await open({
                filename: 'ts-app.db',
                driver: sqlite3.Database
            })
            console.log('db conectada')
        } catch (e) {
            console.log('error al conectar la bd:',(e as Error).message)
        }
    }
    return db
}



export default connect