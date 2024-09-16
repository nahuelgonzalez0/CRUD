import express from 'express'
import database from './database'
import morgan from 'morgan'
import { engine  } from 'express-handlebars'
import path from 'path'

//routes
import indexRoutes from './routes' 
import tasksRoutes from './routes/tasks' 


database()
class Application {
        app: express.Application
        constructor () {
                this.app = express()
                this.settings()
                this.middlewares()
                this.router()
        }

        start() {
                this.app.listen(this.app.get('port'), () => {
                        console.log('server corriendo en el puerto:', this.app.get('port'))
                })
        }

        settings() {
                this.app.set('port', 3000);
                // Configuración del motor de plantillas
                this.app.set('views', path.join(__dirname, 'views')); //busca la carpeta views
                this.app.engine('.hbs', engine({
                        layoutsDir: path.join(this.app.get('views'), 'layouts'),  // Carpeta donde se encuentra 'main.handlebars'
                        partialsDir: path.join(this.app.get('views'), 'partials'), // Carpeta para vistas parciales (si las tienes)
                        defaultLayout: 'main', // La plantilla principal
                        extname: '.hbs', // Extensión de las vistas
                    }));
                    this.app.set('view engine', '.hbs'); //misma extension en todos lados
        }

        middlewares() {
                this.app.use(morgan('dev'));
                this.app.use(express.json()); // para parsear application/json
                this.app.use(express.urlencoded({ extended: false })); // para parsear application/x-www-form-urlencoded
        }
        
        router() {
                this.app.use(indexRoutes)
                this.app.use('/tasks',tasksRoutes)
                this.app.use(express.static(path.join(__dirname, 'public')))
        }
}
export default Application