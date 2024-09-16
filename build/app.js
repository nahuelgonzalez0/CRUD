"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database"));
const morgan_1 = __importDefault(require("morgan"));
const express_handlebars_1 = require("express-handlebars");
const path_1 = __importDefault(require("path"));
//routes
const routes_1 = __importDefault(require("./routes"));
const tasks_1 = __importDefault(require("./routes/tasks"));
(0, database_1.default)();
class Application {
    constructor() {
        this.app = (0, express_1.default)();
        this.settings();
        this.middlewares();
        this.router();
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('server corriendo en el puerto:', this.app.get('port'));
        });
    }
    settings() {
        this.app.set('port', 3000);
        // Configuración del motor de plantillas
        this.app.set('views', path_1.default.join(__dirname, 'views')); //busca la carpeta views
        this.app.engine('.hbs', (0, express_handlebars_1.engine)({
            layoutsDir: path_1.default.join(this.app.get('views'), 'layouts'), // Carpeta donde se encuentra 'main.handlebars'
            partialsDir: path_1.default.join(this.app.get('views'), 'partials'), // Carpeta para vistas parciales (si las tienes)
            defaultLayout: 'main', // La plantilla principal
            extname: '.hbs', // Extensión de las vistas
        }));
        this.app.set('view engine', '.hbs'); //misma extension en todos lados
    }
    middlewares() {
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use(express_1.default.json()); // para parsear application/json
        this.app.use(express_1.default.urlencoded({ extended: false })); // para parsear application/x-www-form-urlencoded
    }
    router() {
        this.app.use(routes_1.default);
        this.app.use('/tasks', tasks_1.default);
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    }
}
exports.default = Application;
