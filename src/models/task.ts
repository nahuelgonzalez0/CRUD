
import connect  from '../database'

export async function lookForUser(username: string) {
    const db = await connect();
    let user = null;

    if (db !== null) {
        // Verificar y crear la tabla si no existe
        const taskTable = `
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )
        `;
        await db.exec(taskTable);

        // Buscar al usuario en la tabla
        const result = await db.all(`
            SELECT id, username, password
            FROM Users
            WHERE username = ?
        `, [username]);

        if (result.length > 0) {
            user = result[0];
            console.log('Usuario existente');
        } else {
            console.log('El usuario no existe');
        }
    }
    return user;
}


export async function createUser (username: string, password: string) {
    const db = await connect() 
    if (db !== null) {
        const taskTable = `
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )
        `

    const insertTask = `
        INSERT INTO Users (username, password)
        VALUES (?, ?)
        `

        try {
            // ejecuta el comando SQL para crear la tabla
            await db.exec(taskTable);
            //se agregan el titulo y la descripcion y se guardan en la bd
            const result = await db.run(insertTask, [username, password]);
            console.log('tabla creada y usuario cargado a la bd')
            return {
                id: result.lastID,  // id del registro recien creado
                user: username,
                password: password,
            };
        } catch (e) {
            console.log('error al crear la tabla:', (e as Error).message)
        }
    }
}

//tablas


 export async function createTable (title: string, description: string, userId: string, status:string = 'pending' ) {
    const db = await connect() 
    if (db !== null) {
        const taskTable = `
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                userId TEXT NOT NULL,
                FOREIGN KEY(userId) REFERENCES Users(id)  
            )
        `

    const insertTask = `
        INSERT INTO items (title, description, userId, status)
        VALUES (?, ?, ?, ?)
        `

        try {
            // ejecuta el comando SQL para crear la tabla
            await db.exec(taskTable);
            //se agregan el titulo y la descripcion y se guardan en la bd
            const result = await db.run(insertTask, [title, description, status, userId]);
            console.log('tabla creada y tarea agregadas con exito')
            return {
                id: result.lastID,  // id del registro recien creado
                title: title,
                description: description,
                stauts: status,
                userId: userId
            };
        } catch (e) {
            console.log('error al crear la tabla:', (e as Error).message)
        }
    }
}

export async function listTasks (id : string | null, title : string | null, status : string | null, userId: string | null) {
    const db = await connect();

    if (db !== null) {
        try {
            if (typeof id !== "string" && typeof title !== "string" && typeof status !== "string" && userId) {
                //Consulta SQL para obtener todas las tareas
                console.log(userId, id,title,status)
                const tasks = await db.all(`
                    SELECT id, title, description, status, userId
                    FROM items
                    WHERE userId = ?
                `, [userId]);
                return tasks;
            } else {
                if (typeof userId === "string" && typeof status === "string" && title === null) {
                    // Consulta SQL para obtener la tarea por STATUS
                    const tasks = await db.all(`
                        SELECT id, title, description, status, userId
                        FROM items
                        WHERE status IN ('completed', 'in progress', 'pending') AND userId = ?
                        ORDER BY 
                            CASE status 
                                WHEN 'completed' THEN 1
                                WHEN 'in progress' THEN 2
                                WHEN 'pending' THEN 3
                            END
                    `);
                    return tasks;
                    } else {
                        // Consulta SQL para obtener la tarea por TITLE
                    const tasks = await db.all(`
                        SELECT id, title, description, status, userId
                        FROM items
                        WHERE userId = ? AND title LIKE ?
                    `, [userId, `%${title}%`]);
                    return tasks;
                    }
            }
        } catch (e) {
            console.log('Error al listar las tareas:', (e as Error).message);
            return []
        }
    }
    return []
}


export async function deleteTask(id: string, userId: string | null): Promise<void> {
    const db = await connect();
    if (db !== null) {
        const deleteTasky = `DELETE FROM items WHERE id = ? AND userId = ?`;
        
        try {
            await db.run(deleteTasky, [id, userId]);  // Ejecuta el comando para eliminar la tarea con el ID proporcionado
            console.log('Tarea eliminada con éxito');
        } catch (e) {
            console.error('Error al eliminar la tarea:', (e as Error).message);
            throw e;
        }
    }
}

//verificar la funcion
export async function updateTask(title : string, description: string, status: string, id: string, userId: string): Promise<void> {
    const db = await connect()
    if (db !== null) {
        const updateTask = `UPDATE items SET title = ?, description = ?, status = ? WHERE id = ? AND id = ?`
        
        try {
            await db.run(updateTask, [title, description, status, id, userId])  // Ejecuta el comando para eliminar la tarea con el ID proporcionado
            console.log('Tarea modificada con éxito')
        } catch (e) {
            console.error('Error al modificar la tarea:', (e as Error).message)
            throw e
        }
    }
}
