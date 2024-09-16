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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
//model
const task_1 = require("../models/task");
//creo diferentes rutas para diferentes tareas
router.route('/create')
    .get((req, res) => {
    res.render('tasks/create');
})
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    const newTask = yield (0, task_1.createTable)(title, description);
    console.log("objeto: ", newTask);
    res.redirect('/tasks/list');
}));
router.route('/list')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield (0, task_1.listTasks)(null);
        console.log(tasks);
        res.render('tasks/list', { tasks });
    }
    catch (e) {
        console.error('Error al obtener las tareas:', e);
        res.status(500).send('Error al obtener las tareas');
    }
}));
router.route('/delete')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query; // Obtener el ID desde el query string
    try {
        if (typeof id === 'string') {
            yield (0, task_1.deleteTask)(id); // Llamar a la función para eliminar la tarea
            res.redirect('/tasks/list');
        }
        else {
            res.status(400).send('ID inválido');
        }
    }
    catch (e) {
        console.error('Error al eliminar la tarea:', e);
        res.status(500).send('Error al eliminar la tarea');
    }
}));
router.route('/edit')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (typeof id === 'string') {
        const task = yield (0, task_1.listTasks)(id);
        res.render('tasks/edit', { task });
    }
}))
    //verificar esto y el edit.hbs
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const { title, description } = req.body;
    if (typeof id === 'string') {
        yield (0, task_1.updateTask)(title, description, id);
        res.redirect('/tasks/list');
    }
}));
exports.default = router;
