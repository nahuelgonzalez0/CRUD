"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTable = createTable;
exports.listTasks = listTasks;
exports.deleteTask = deleteTask;
exports.updateTask = updateTask;
const database_1 = __importDefault(require("../database"));
function createTable(title, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.default)();
        if (db !== null) {
            const taskTable = `
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    )
    `;
            const insertTask = `
        INSERT INTO items (title, description)
        VALUES (?, ?)
        `;
            try {
                // ejecuta el comando SQL para crear la tabla
                yield db.exec(taskTable);
                //se agregan el titulo y la descripcion y se guardan en la bd
                const result = yield db.run(insertTask, [title, description]);
                console.log('tabla creada y tarea agregadas con exito');
                return {
                    id: result.lastID, // id del registro recien creado
                    title: title,
                    description: description
                };
            }
            catch (e) {
                console.log('error al crear la tabla:', e.message);
            }
        }
    });
}
function listTasks(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.default)();
        if (db !== null) {
            try {
                if (typeof id !== "string") {
                    // consulta para obtener todas las filas de la tabla 'items'
                    const task = yield db.all(`
                SELECT id, title, description
                FROM items
            `);
                    return task; // Devuelve el array de tareas 
                }
                else {
                    // Consulta SQL para obtener la tarea por ID
                    const task = yield db.get(`
                    SELECT id, title, description
                    FROM items
                    WHERE id = ?
                `, [id]);
                    return task;
                }
            }
            catch (e) {
                console.log('Error al listar las tareas:', e.message);
                return [];
            }
        }
        return [];
    });
}
function deleteTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.default)();
        if (db !== null) {
            const deleteTasky = `DELETE FROM items WHERE id = ?`;
            try {
                yield db.run(deleteTasky, [id]); // Ejecuta el comando para eliminar la tarea con el ID proporcionado
                console.log('Tarea eliminada con éxito');
            }
            catch (e) {
                console.error('Error al eliminar la tarea:', e.message);
                throw e;
            }
        }
    });
}
//verificar la funcion
function updateTask(title, description, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.default)();
        if (db !== null) {
            const updateTask = `UPDATE items SET title = ?, description = ? WHERE id = ?`;
            try {
                yield db.run(updateTask, [title, description, id]); // Ejecuta el comando para eliminar la tarea con el ID proporcionado
                console.log('Tarea modificada con éxito');
            }
            catch (e) {
                console.error('Error al modificar la tarea:', e.message);
                throw e;
            }
        }
    });
}
