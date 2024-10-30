import { Router, Request, Response } from 'express'

const router = Router()

//model
import {createTable, listTasks, deleteTask, updateTask} from '../models/task'

//creo diferentes rutas para diferentes tareas

router.route('/create')
    .get((req: Request, res: Response) => {
        res.render('tasks/create')
    })

    .post(async (req: Request, res: Response) => {
      const {title, description} = req.body
      if (title === "" || description === "") {
        console.log("Completa todos los campos")
        res.render('tasks/create', { errorMessage: 'Completa todos los campos' })
      } else {
        const status = 'pending' 
        const newTask = await createTable(title, description, status)
        console.log("objeto: ", newTask)
       res.redirect('/tasks/list')
      }
    })
    
    router.route('/list')   
    .get(async (req: Request, res: Response) => {
        try {
            const {filter, value} = req.query
            if (filter) {
                if (filter == 'title') {
                    //filtro para el tituloS
                    console.log(filter)
                    const tasks = await listTasks(null, filter, null)
                    console.log(tasks)
                    res.render('tasks/list', {tasks})
                } else if (filter == 'status') {
                    //filtro para el status
                    console.log(filter)
                    const tasks = await listTasks(null, null, filter)
                    console.log(tasks)
                    res.render('tasks/list', {tasks})
                }
            } else {
                const tasks = await listTasks(null, null, null)
                console.log(tasks)
                res.render('tasks/list', {tasks})
            }
        } catch (e) {
            console.error('Error al obtener las tareas:', e);
            res.status(500).send('Error al obtener las tareas')
        }
    })

    router.route('/delete')
    .get(async (req: Request, res: Response) => {
        const { id } = req.query // Obtener el ID desde el query string
        try {
            if (typeof id === 'string') {
                await deleteTask(id) // Llamar a la función para eliminar la tarea
                res.redirect('/tasks/list')
            } else {
                res.status(400).send('ID inválido')
            }
        } catch (e) {
            console.error('Error al eliminar la tarea:', e)
            res.status(500).send('Error al eliminar la tarea')
        }
    })
 
    router.route('/edit')
    .get(async (req: Request, res: Response) => {
        const { id } = req.query
        if (typeof id === 'string') {
            const tasks = await listTasks(id, null, null) // devuelve un array
            const task = tasks [0]
            console.log(task); 
            res.render('tasks/edit', { task })
        }
    })
    //verificar esto y el edit.hbs
    .post(async (req: Request, res: Response) => {
        const { id } = req.query
        const { title, description, status } = req.body
        if (typeof id === 'string') {
            if (title === "" || description === "") {
                console.log("Completa todos los campos")
                const task = { id, title, description, status }
                res.render('tasks/edit', { task, errorMessage: 'Completa todos los campos' })
              } else {
                await updateTask(title, description, status, id)
                res.redirect('/tasks/list')
              }
        }
    })

export default router