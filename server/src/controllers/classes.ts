import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {Course} from "../entity/Course";
import {User} from "../entity/User";
import {Request, Response} from "express"
import {compareClasses, createTime, alterKeys, processCollisions, listCollisions, insertObjectIntoTable} from "../support/support"

const logger = require('../utils/logger')
const classesRouter = require('express').Router()

classesRouter.post('/', async (request: Request, response: Response) => {
  const body = request.body.object
  const connection = await getConnection();

  const courseRepository = connection.getRepository(Course)
  const course = await courseRepository.findOne({courseKey: body.course.courseKey});
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: body.host.username});

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

  const startTime = createTime(body.startTime.hours, body.startTime.minutes)
  const endTime = createTime(body.endTime.hours, body.endTime.minutes)

  const newClass: Class = {
    groupKey: body.groupKey,
    weekDay: body.weekDay,
    startTime,
    endTime,
    parity: body.parity,
    building: body.building,
    room: body.room,
    typ: body.typ,
    host: user,
    course,
    hostingRequests: []
  }

  insertObjectIntoTable(newClass, Class, response)
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

// changeClass(newClass: Class)
classesRouter.put('/:groupKey', async (request: Request, response: Response) => {
  const body = request.body.object
  const groupKey = request.params.groupKey

  const connection = await getConnection();
  const classesRepository = connection.getRepository(Class)
  const clas = await classesRepository.findOne({groupKey});

  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: body.host.username});

  const courseRepository = connection.getRepository(Course)
  const course = await courseRepository.findOne({courseKey: body.course.courseKey});

  if (clas == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "class not found"
    })
  }
  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    })
  }
  if (course == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified course does not exist"
    })
  }

  const startTime = createTime(body.startTime.hours, body.startTime.minutes)
  const endTime = createTime(body.endTime.hours, body.endTime.minutes)

  await getConnection()
    .createQueryBuilder()
    .update(Class)
    .set({
      groupKey: body.groupKey,
      weekDay: body.weekDay,
      startTime,
      endTime,
      parity: body.parity,
      building: body.building,
      room: body.room,
      typ: body.typ,
      host: user,
      course,
    })
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
// example: localhost:8000/classes/conflicts/Monday
classesRouter.get('/conflicts/:weekDay', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.weekDay = :weekDay", {weekDay: request.params.weekDay})
    .execute()
    .then(items => {
      let newItems = alterKeys(items, "class");
      newItems.sort(compareClasses);
      return response.status(200).json(listCollisions(newItems))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

// PZD-16
// example: localhost:8000/classes/map/Monday
classesRouter.get('/map', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.weekDay = :weekDay", {weekDay: request.params.weekDay})
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
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

// PZD-5
// example: localhost:8000/classes/weekDay/Monday
classesRouter.get('/weekDay/:weekDay', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.weekDay = :weekDay", {weekDay: request.params.weekDay})
    .execute()
    .then(items => {
      let newItems = alterKeys(items, "class");
      newItems.sort(compareClasses);
      return response.status(200).json(processCollisions(newItems))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

// getClassesHostedByUser(username)
classesRouter.get('/host/:username', async (request: Request, response: Response) => {
  const connection = await getConnection();
  const username = request.params.username
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username});

  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.hostUsername = :username", {username})
    .execute()
    .then(items => {
      return response.status(200).json(alterKeys(items, "classes"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

// getClassesofCourse(courseKey)
classesRouter.get('/course/:courseKey', async (request: Request, response: Response) => {
  const connection = await getConnection();
  const courseKey = request.params.courseKey
  const courseRepository = connection.getRepository(Course)
  const course = await courseRepository.findOne({courseKey});

  if (course == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified course does not exist"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.courseCourseKey = :courseKey", {courseKey})
    .execute()
    .then(items => {
      return response.status(200).json(alterKeys(items, "classes"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

classesRouter.get('/:groupKey', async (request: Request, response: Response) => {
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
    .select("class")
    .from(Class, "class")
    .where("class.groupKey = :groupKey", {groupKey})
    .execute()
    .then(item => {
      return response.status(200).json(alterKeys(item, "class"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

// getAllClasses() -> Classes[]
classesRouter.get('/', async (request: Request, response: Response) => {
  const connection = await getConnection();
  const classesRepository = connection.getRepository(Class)

  const classes = await classesRepository.find();

  return response.status(200).json(classes)
})

export default classesRouter;