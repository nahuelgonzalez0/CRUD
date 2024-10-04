import express from 'express';
import database from './database';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import path from 'path';

// Importa Handlebars para registrar helpers
import Handlebars from 'handlebars'; // Asegúrate de que esto está importado

// Rutas
import indexRoutes from './routes';
import tasksRoutes from './routes/tasks';

database();

class Application {
    app: express.Application;

    constructor() {
        this.app = express();
        this.settings();
        this.middlewares();
        this.router();
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server corriendo en el puerto:', this.app.get('port'));
        });
    }

    settings() {
        this.app.set('port', 3000);
        
        // Configuración del motor de plantillas
        this.app.set('views', path.join(__dirname, 'views')); // Busca la carpeta views
        this.app.engine('.hbs', engine({
            layoutsDir: path.join(this.app.get('views'), 'layouts'),  // Carpeta donde se encuentra 'main.handlebars'
            partialsDir: path.join(this.app.get('views'), 'partials'), // Carpeta para vistas parciales (si las tienes)
            defaultLayout: 'main', // La plantilla principal
            extname: '.hbs', // Extensión de las vistas
        }));
        this.app.set('view engine', '.hbs'); // Misma extensión en todos lados

        // Registrar el helper 'eq'
        Handlebars.registerHelper('eq', function (a, b) {
            return a === b;
        });
    }

    middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(express.json()); // Para parsear application/json
        this.app.use(express.urlencoded({ extended: false })); // Para parsear application/x-www-form-urlencoded
    }
    
    router() {
        this.app.use(indexRoutes);
        this.app.use('/tasks', tasksRoutes);
        this.app.use(express.static(path.join(__dirname, 'public')));
    }
}

export default Application;
