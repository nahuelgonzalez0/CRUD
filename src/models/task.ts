
import connect  from '../database'

 export async function createTable (title: string, description: string) {
    const db = await connect() 
    if (db !== null) {
        const taskTable = `
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    )
    `

    const insertTask = `
        INSERT INTO items (title, description)
        VALUES (?, ?)
        `

        try {
            // ejecuta el comando SQL para crear la tabla
            await db.exec(taskTable);
            //se agregan el titulo y la descripcion y se guardan en la bd
            const result = await db.run(insertTask, [title, description]);
            console.log('tabla creada y tarea agregadas con exito')
            return {
                id: result.lastID,  // id del registro recien creado
                title: title,
                description: description
            };
        } catch (e) {
            console.log('error al crear la tabla:', (e as Error).message)
        }
    }
}

export async function listTasks (id : string | null) {
    const db = await connect();

    if (db !== null) {
        try {
            if (typeof id !== "string" ) {
               // consulta para obtener todas las filas de la tabla 'items'
            const task = await db.all(`
                SELECT id, title, description
                FROM items
            `)
            return task  // Devuelve el array de tareas 
            } else {

                // Consulta SQL para obtener la tarea por ID
                const task = await db.get(`
                    SELECT id, title, description
                    FROM items
                    WHERE id = ?
                `, [id])
                return task; 
            }

        } catch (e) {
            console.log('Error al listar las tareas:', (e as Error).message);
            return []
        }
    }
    return []
}


export async function deleteTask(id: string): Promise<void> {
    const db = await connect();
    if (db !== null) {
        const deleteTasky = `DELETE FROM items WHERE id = ?`;
        
        try {
            await db.run(deleteTasky, [id]);  // Ejecuta el comando para eliminar la tarea con el ID proporcionado
            console.log('Tarea eliminada con éxito');
        } catch (e) {
            console.error('Error al eliminar la tarea:', (e as Error).message);
            throw e;
        }
    }
}

//verificar la funcion
export async function updateTask(title : string, description: string, id: string, ): Promise<void> {
    const db = await connect()
    if (db !== null) {
        const updateTask = `UPDATE items SET title = ?, description = ? WHERE id = ?`
        
        try {
            await db.run(updateTask, [title, description, id])  // Ejecuta el comando para eliminar la tarea con el ID proporcionado
            console.log('Tarea modificada con éxito')
        } catch (e) {
            console.error('Error al modificar la tarea:', (e as Error).message)
            throw e
        }
    }
}
