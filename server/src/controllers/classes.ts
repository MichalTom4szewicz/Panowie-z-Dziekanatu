import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {Course} from "../entity/Course";
import {User} from "../entity/User";
import {Request, Response} from "express"
import {compareClasses, alterKeys, processCollisions, listCollisions} from "../support/support"

const logger = require('../utils/logger')
const classesRouter = require('express').Router()

classesRouter.post('/', async (request: Request, response: Response) => {
  const body = request.body
  const connection = await getConnection();

  const courseRepository = connection.getRepository(Course)
  const course = await courseRepository.findOne({courseKey: body.course.courseKey});
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: body.user.username});

  if (course == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "course not found"
    })
  }
  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "user not found"
    })
  }

  const newClass: Class = {
    groupKey: body.groupKey,
    weekDay: body.weekDay,
    startTime: body.startTime,
    endTime: body.endTime,
    parity: body.parity,
    building: body.building,
    room: body.room,
    typ: body.typ,
    host: user,
    course,
    hostingRequests: []
  }

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Class)
    .values(newClass)
    .execute()
    .then(() => {
      return response.status(200).json({
        status: "success"
      })
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

classesRouter.delete('/:groupKey', async (request: Request, response: Response) => {
  const groupKey = request.params.groupKey

  const connection = await getConnection();
  const classRepository = connection.getRepository(Class)
  const clas = await classRepository.findOne({groupKey: groupKey});

  if (clas == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "class not found"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Class)
    .where("groupKey = :groupKey", {groupKey})
    .execute()
    .then(() => {
      return response.status(200).json({
        status: "success"
      })
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

//PZD-5
// example: localhost:8000/classes/conflicts?weekDay=wDay
classesRouter.get('/conflicts', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.weekDay = :weekDay", {weekDay: request.query.weekDay})
    .execute()
    .then(items => {
      let newItems = alterKeys(items, "class");
      newItems.sort(compareClasses);
      const map = listCollisions(newItems);

      return response.status(200).json(map)
    })
    .catch(error => {
      logger.error(error);
      return response.status(500).json({
        success: false,
        status: "nk rzutnik"
      })
    });
})

classesRouter.get('/all', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .execute()
    .then(items => {
      return response.status(200).json(alterKeys(items, "class"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
          success: false,
          status: "nk rzutnik"
      })
    });
})

// PZD-16
// example: localhost:8000/classes/map?weekDay=wDay
classesRouter.get('/map', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.weekDay = :weekDay", {weekDay: request.query.weekDay})
    .execute()
    .then(items => {
      let newItems = alterKeys(items, "class");
      newItems.sort(compareClasses);
      newItems = processCollisions(newItems);

      let map: {
        [key: string]: [number, number]
      } = {}
      for(let i=0; i<newItems.length; i++) {
        for(let j=0; j<newItems[i].length; j++) {
          map[newItems[i][j].groupKey] = [i, j]
        }
      }
      return response.status(200).json(map)
    })
    .catch(error => {
      logger.error(error);
      return response.status(500).json({
        success: false,
        status: "nk rzutnik"
      })
    });
})

// PZD-5
// example: localhost:8000/classes?weekDay=wDay
classesRouter.get('/', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.weekDay = :weekDay", {weekDay: request.query.weekDay})
    .execute()
    .then(items => {
      let newItems = alterKeys(items, "class");
      newItems.sort(compareClasses);
      newItems = processCollisions(newItems);

      return response.status(200).json(newItems)
    })
    .catch(error => {
      logger.error(error);
      return response.status(500).json({
        success: false,
        status: "nk rzutnik"
      })
    });
})



// classesRouter.get('/:id', async (request: Request, response: Response) => {
//   await getConnection()
//     .createQueryBuilder()
//     .select("class")
//     .from(Class, "class")
//     .where("class.id = :id", {id: request.params.id})
//     .execute()
//     .then(item => {
//       return response.json(item)
//     })
//     .catch(error => logger.error(error));
// })

export default classesRouter;