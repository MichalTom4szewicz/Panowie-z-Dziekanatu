import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {Course} from "../entity/Course";
import {Request, Response} from "express"
import {compareClasses, alterKeys, processCollisions, listCollisions} from "../support/support"

const logger = require('../utils/logger')

const coursesRouter = require('express').Router()

// coursesRouter.delete('/deleteDummy', async (request: Request, response: Response) => {
//   await getConnection()
//     .createQueryBuilder()
//     .delete()
//     .from(Course)
//     .where("class.id > :id", { id: 0 })
//     .execute()
//     .then(() => {
//       return response.json({status: "jest w pyte"})
//     })
//     .catch(error => logger.error(error));
// })

// coursesRouter.post('/addDummy', async (request: Request, response: Response) => {
//     const css = [
//         {
//             name: "Zastosowania informatyki w gospodarce",
//             user: 1
//         },
//         {
//             name: "Matematyka",
//             user: 2
//         }
//     ]

//     await getConnection()
//     .createQueryBuilder()
//     .insert()
//     .into(Course)
//     .values(css)
//     .execute()
//     .then(() => {
//       return response.json(css)
//     })
//     .catch(error => logger.error(error));
// })


export default coursesRouter;