import {getConnection, createQueryBuilder} from "typeorm";
import {Class} from "../entity/Class";
import {Course} from "../entity/Course";
import {User} from "../entity/User";
import {Request, Response} from "express"
import {compareClasses, isTime, validateValues, createTime, alterKeys, processCollisions, listCollisions, insertObjectIntoTable} from "../support/support"
import {Parity} from "../enums/parity"
import {WeekDay} from "../enums/weekDay"
import {Typ} from "../enums/typ"

const logger = require('../utils/logger')
const classesRouter = require('express').Router()

classesRouter.post('/', async (request: Request, response: Response) => {
  const object = request.body.object
  const connection = await getConnection();

  const courseRepository = connection.getRepository(Course)
  const course = await courseRepository.findOne({courseKey: object.course.courseKey});
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: object.host.username});

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

  if(!validateValues(object.parity, Parity, response)) return
  if(!validateValues(object.typ, Typ, response)) return
  if(!validateValues(object.weekDay, WeekDay, response)) return

  if(!isTime(object.startTime.hours, object.startTime.minutes, response)) return
  if(!isTime(object.endTime.hours, object.endTime.minutes, response)) return

  const startTime = createTime(object.startTime.hours, object.startTime.minutes)
  const endTime = createTime(object.endTime.hours, object.endTime.minutes)

  const newClass: Class = {
    groupKey: object.groupKey,
    weekDay: object.weekDay,
    startTime,
    endTime,
    parity: object.parity,
    building: object.building,
    room: object.room,
    typ: object.typ,
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
  const object = request.body.object
  const groupKey = request.params.groupKey

  const connection = await getConnection();
  const classesRepository = connection.getRepository(Class)
  const clas = await classesRepository.findOne({groupKey});

  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: object.host.username});

  const courseRepository = connection.getRepository(Course)
  const course = await courseRepository.findOne({courseKey: object.course.courseKey});

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

  if(!validateValues(object.parity, Parity, response)) return
  if(!validateValues(object.typ, Typ, response)) return
  if(!validateValues(object.weekDay, WeekDay, response)) return

  if(!isTime(object.startTime.hours, object.startTime.minutes, response)) return
  if(!isTime(object.endTime.hours, object.endTime.minutes, response)) return

  const startTime = createTime(object.startTime.hours, object.startTime.minutes)
  const endTime = createTime(object.endTime.hours, object.endTime.minutes)

  await getConnection()
    .createQueryBuilder()
    .update(Class)
    .set({
      groupKey: object.groupKey,
      weekDay: object.weekDay,
      startTime,
      endTime,
      parity: object.parity,
      building: object.building,
      room: object.room,
      typ: object.typ,
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
  const coursesRepository = connection.getRepository(Course)
  const usersRepository = connection.getRepository(User)

  const classes = await classesRepository.find({relations: ['host', 'course']});

  let newClasses = []
  for (const c of classes) {
    let newC: any = c
    newC.host = {
      firstName: c.host.firstName,
      lastName: c.host.lastName,
      degree: c.host.degree
    }
    let courses = await coursesRepository.find({relations: ['supervisor']})
    // console.log(courses)
    if (courses !== undefined) {
      const course = courses.filter(cc => {
        return cc.courseKey === c.course.courseKey
      })[0]
      // console.log(course, "gfdgfdg")
      newC.supervisor = {
        firstName: courses[0].supervisor.firstName,
        lastName: courses[0].supervisor.lastName,
        degree: courses[0].supervisor.degree
      }
      delete newC.course
      newClasses.push(newC)
    }
  }

  return response.status(200).json(newClasses)
})

export default classesRouter;