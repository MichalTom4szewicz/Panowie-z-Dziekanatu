import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {Course} from "../entity/Course";
import {User} from '../entity/User'
import {Request, Response} from "express"
import {compareClasses, alterKeys, processCollisions, listCollisions} from "../support/support"

const logger = require('../utils/logger')

const coursesRouter = require('express').Router()

coursesRouter.delete('/deleteDummy', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Course)
    .where("course.id > :id", { id: 0 })
    .execute()
    .then(() => {
      return response.json({status: "jest w pyte"})
    })
    .catch(error => logger.error(error));
})

coursesRouter.post('/addDummy', async (request: Request, response: Response) => {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User)

    const usr = await userRepository.findOne({pesel: "2"});
    const css = [
        {
            name: "Zastosowania informatyki w gospodarce",
            user: usr
        },
        {
            name: "Matematyka",
            user: usr
        }
    ]

    await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Course)
    .values(css)
    .execute()
    .then(() => {
      return response.json(css)
    })
    .catch(error => logger.error(error));
})

// PZD-10
// getNazwyKursow() -> String[]
// localhost:8000/courses/names
coursesRouter.get('/names', async (request: Request, response: Response) => {
    await getConnection()
    .createQueryBuilder()
    .select("course")
    .from(Course, "course")
    .execute()
    .then(items => {
      return response.status(200).json(alterKeys(items, "course").map((i: { name: any; }) => i.name))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
          success: false,
          status: "nk rzutnik"
      })
    });
})

// courses of user id=2
coursesRouter.get('/2', async (request: Request, response: Response) => {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User)
    const coursesRepository = connection.getRepository(Course)

    const user = await userRepository.findOne({pesel: "2"})
    const courses = await coursesRepository.find({user});

    return response.json(courses)
})

//all courses
coursesRouter.get('/', async (request: Request, response: Response) => {
    const connection = await getConnection();
    const coursesRepository = connection.getRepository(Course)

    const courses = await coursesRepository.find();

    return response.json(courses)
})




export default coursesRouter;