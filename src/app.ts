import express from 'express'
import cookieParser from 'cookie-parser'
import database from './database'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import path from 'path'
import {PORT} from './routes/config'
import { authenticateToken } from '../src/middlewares/authenticate';

// Importa Handlebars para registrar helpers
import Handlebars from 'handlebars' // Asegúrate de que esto está importado

// Rutas
import indexRoutes from './routes'
import tasksRoutes from './routes/tasks'

database()

//cuerpo
class Application {
    app: express.Application

    constructor() {
        this.app = express()
        this.settings()
        this.middlewares()
        this.router()
    }

    start() {
        this.app.listen(PORT, () => {
            console.log(`Server corriendo en el puerto ${PORT}`)
        })
    }

    settings() {
        this.app.set('port', 3000)
        
        // Configuración del motor de plantillas
        this.app.set('views', path.join(__dirname, 'views')) // Busca la carpeta views
        this.app.engine('.hbs', engine({
            layoutsDir: path.join(this.app.get('views'), 'layouts'),  // Carpeta donde se encuentra 'main.handlebars'
            partialsDir: path.join(this.app.get('views'), 'partials'), // Carpeta para vistas parciales (si las tienes)
            defaultLayout: 'main', // La plantilla principal
            extname: '.hbs', // Extension de las vistas
        }))
        this.app.set('view engine', '.hbs') // Misma extension en todos lados

        // Registrar el helper 'eq'
        Handlebars.registerHelper('eq', function (a, b) {
            return a === b
        })
    }

    middlewares() {
        this.app.use(morgan('dev'))
        this.app.use(express.json()) // Para parsear application/json
        this.app.use(express.urlencoded({ extended: false })) // Para parsear application
        this.app.use(cookieParser())

        this.app.use((req, res, next) => {
        const publicRoutes = ['/tasks/login', '/tasks/register', '/tasks/logout'];
        if (publicRoutes.includes(req.path)) {
            return next(); // Omite el middleware para las rutas públicas
        }
        authenticateToken(req, res, next); // Aplica el middleware a las demás rutas
    });
    }
    
    router() {
        this.app.use(indexRoutes)
        this.app.use('/tasks', tasksRoutes)
        this.app.use(express.static(path.join(__dirname, 'public')))
    }
}

export default Application
