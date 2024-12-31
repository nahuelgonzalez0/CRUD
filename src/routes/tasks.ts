import { Router, Request, Response } from 'express'

const router = Router()

//model
import {lookForUser, createUser, createTable, listTasks, deleteTask, updateTask,} from '../models/task'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {SECRET_JWT_KEY} from '../routes/config'
import { authenticateToken } from '../middlewares/authenticate'


//rutas para el login y demas

router.route('/login')
.get((req: Request, res: Response) => {
    res.render("tasks/login", {
        showLogoutButton: false
    })
})

.post(async (req: Request, res: Response) => {
   const {username,password} = req.body
   try {
    if (password.length < 4 || typeof username !== 'string' || typeof password !== 'string' ||!username || !password)
    return res.render('tasks/login', { errorMessage: 'Completa todos los campos' });

    const VerificarUser = await lookForUser(username)  
    if (!VerificarUser) return res.render('tasks/login', { errorMessage: 'Usuario no encontrado' });
    //creo el token
    const token = jwt.sign(
        { id:VerificarUser.id, username:VerificarUser.username}, 
        SECRET_JWT_KEY,
        {expiresIn: '1h'}
    )
    const isValid =  await bcrypt.compare(password, VerificarUser.password)
    if (!isValid) return res.render('tasks/login', { errorMessage: 'Contraseña incorrecta' });
        //guardo el token en la cookie
        res.cookie('access_token', token, {
            httpOnly: true, //la cookie solo se accede mediante el servidor
            secure: process.env.NODE_ENV === 'production', //la cookie solo se puede acceder en https
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60
        })
        res.redirect('/tasks/list');
   } catch (error) {
    console.error('Error al procesar el registro:', error)
    res.status(500).send("Error interno del servidor")
   }
})

router.route('/register')
.get((req, res) => {
    res.render('tasks/register', {
        showLogoutButton: false
    })
})
.post(async (req, res) => {
    const { username, password } = req.body
    try {
        const VerificarUser = await lookForUser(username)
        if (!VerificarUser && username.length > 4 && typeof username === 'string' && password.length > 6 && typeof password === 'string') {
            const hashedPassword = await bcrypt.hash(password, 10)
            await createUser(username, hashedPassword)
            console.log('Usuario creado')
            res.redirect('/tasks/login')
        } else {
            console.log('Usuario ya existente o datos inválidos')
            res.status(400).send("Error: Usuario ya existente o datos inválidos")
        }
    } catch (error) {
        console.error('Error al procesar el registro:', error)
        res.status(500).send("Error interno del servidor")
    }
});
//
router.route('/logout')
.get( async(req, res) => {
    res.clearCookie('access_token')
    res.redirect('/tasks/login')
})

//todavia no lo veo
router.route('/protected')
.get(authenticateToken, (req, res) => {
    // Si el token es válido, la ejecución llega aquí
    console.log(res.locals.user)  // Aquí puedes acceder a los datos del usuario
    res.send('Acceso autorizado a la ruta protegida')
})

//creo diferentes rutas para diferentes tareas

router.route('/create')
    .get(authenticateToken, (req: Request, res: Response) => {
        res.render('tasks/create', {
            showLogoutButton: true
        })
    })
    .post(authenticateToken, async (req: Request, res: Response) => {
      const {title, description} = req.body
      const userId = res.locals.user?.id;
      console.log(userId)
      if (!userId)return res.redirect('tasks/acceso-denegado')   // Si no hay un usuario autenticado, retornamos error
      console.log("pase")
      if (title === "" || description === "") {
        console.log("Completa todos los campos")
        res.render('tasks/create', { errorMessage: 'Completa todos los campos' })
      } else {
        const status = 'pending' 
        const newTask = await createTable(title, description, status, userId)
        console.log("objeto: ", newTask)
       res.redirect('/tasks/list')
      }
    })
    
    router.route('/list')   
    .get(authenticateToken, async (req: Request, res: Response) => {
        try {
            const {filter, value} = req.query
            const userId = res.locals.user?.id
            if (!userId) return res.redirect('tasks/acceso-denegado', )

            if (filter) {
                if (filter == 'title') {
                    //filtro para el titulos
                    const tasks = await listTasks(null, filter, null, userId )
                    console.log(tasks)
                    res.render('tasks/list', {tasks, showLogoutButton: true})
                } else if (filter == 'status') {
                    //filtro para el status
                    const tasks = await listTasks(null, null, filter, userId)
                    console.log(tasks)
                    res.render('tasks/list', {tasks, showLogoutButton: true})
                }
            } else {
                //imprimo todas las tareas
                const tasks = await listTasks(null, null, null, userId)
                console.log("tareas totales" ,tasks)
                res.render('tasks/list', {tasks, showLogoutButton: true})
            }
        } catch (e) {
            console.error('Error al obtener las tareas:', e);
            res.status(500).send('Error al obtener las tareas')
        }
    })

    router.route('/delete')
    .get(async (req: Request, res: Response) => {
        const { id } = req.query // Obtener el ID desde el query string
        const userId = res.locals.user.user?.id
        try {
            if (typeof id === 'string') {
                await deleteTask(id, userId) // Llamar a la función para eliminar la tarea
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
    .get(authenticateToken, async (req: Request, res: Response) => {
        const { id } = req.query
        const userId = res.locals.user.user?.id
        if(!userId) return res.redirect('tasks/acceso-denegado')

        if (typeof id === 'string') {
            const tasks = await listTasks(id, null, null,userId) // devuelve un array
            const task = tasks.find(task => task.id === id); 
            console.log(task); 
            res.render('tasks/edit', {task, showLogoutButton: true})
        }
    })
    
    .post(async (req: Request, res: Response) => {
        const { id } = req.query
        const { title, description, status } = req.body
        const userId = res.locals.user.user?.id
        if (typeof id === 'string') { 
            if (title === "" || description === "") {
                console.log("Completa todos los campos")
                const task = { id, title, description, status }
                res.render('tasks/edit', { task, errorMessage: 'Completa todos los campos', showLogoutButton: true })
              } else {
                await updateTask(title, description, status, id, userId)
                res.redirect('/tasks/list')
              }
        }
    })

export default router