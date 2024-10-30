# CRUD con Express, TypeScript, Node.js y SQLite
Este proyecto es una aplicación CRUD (Crear, Leer, Actualizar y Eliminar) desarrollada con Node.js, Express, TypeScript y SQLite. Permite gestionar una lista de tareas mediante una interfaz web.

## Descripción
La aplicación permite a los usuarios realizar las siguientes operaciones:
- **Crear** tareas con un título y una descripción.
- **Listar** todas las tareas almacenadas en la base de datos.
- **Actualizar** tareas existentes.
-  **Filtrar** tareas de la base de datos por su titulo o por su estado.
- **Eliminar** tareas de la base de datos.

## Dependencias
Este proyecto utiliza las siguientes dependencias:
- **express**
- **morgan**
- **ncp**
- **sqlite**
- **sqlite3**

### Instalación de dependencias

Para instalar las dependencias necesarias, ejecuta el siguiente comando:

```bash
npm install express@^4.21.1 morgan@^1.10.0 ncp@^2.0.0 sqlite@^5.1.1 sqlite3@^5.1.7
