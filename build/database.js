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
exports.connect = connect;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
let db;
//si la conexion es exitosa devuelve una promesa resuelta con la instancia de Database
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!db) {
            try {
                db = yield (0, sqlite_1.open)({
                    filename: 'ts-app.db',
                    driver: sqlite3_1.default.Database
                });
                console.log('db conectada');
            }
            catch (e) {
                console.log('error al conectar la bd:', e.message);
            }
        }
        return db;
    });
}
exports.default = connect;
