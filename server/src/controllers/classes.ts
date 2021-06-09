import {getConnection, createQueryBuilder} from "typeorm";
import {Class} from "../entity/Class";
import {Course} from "../entity/Course";
import {User} from "../entity/User";
import {Request, Response} from "express"
import {compareClasses, verify, isTime, strToTime, alterTimes, validateValues, createTime, alterKeys, processCollisions, listCollisions, insertObjectIntoTable} from "../support/support"
import {Parity} from "../enums/parity"
import {WeekDay} from "../enums/weekDay"
import {Typ} from "../enums/typ"

const logger = require('../utils/logger')
const classesRouter = require('express').Router()

//addClass(cls)
classesRouter.post('/', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

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

// removeClass(groupKey)
classesRouter.delete('/:groupKey', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

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
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

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
//getClassesConflicts()
// example: localhost:8000/classes/conflicts/Monday
classesRouter.get('/conflicts/:weekDay', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.weekDay = :weekDay", {weekDay: request.params.weekDay})
    .execute()
    .then(items => {
      if(items.length === 0) {
        return response.status(200).json([])
      }

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
// getClassesMap
// example: localhost:8000/classes/map/Monday
classesRouter.get('/map/:weekDay', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.weekDay = :weekDay", {weekDay: request.params.weekDay})
    .execute()
    .then(items => {
      if(items.length === 0) {
        return response.status(200).json([])
      }

      let newItems = alterKeys(items, "class");
      newItems.sort(compareClasses);
      newItems = processCollisions(newItems);

      let map: {
        key: string,
        value: [number, number]
    } [] = [];
      for(let i=0; i<newItems.length; i++) {
        for(let j=0; j<newItems[i].length; j++) {
          map.push({key: newItems[i][j].groupKey, value: [i, j]})
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
//getClassesByWeekDay
// example: localhost:8000/classes/weekDay/1
classesRouter.get('/weekDay/:weekDay', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const connection = await getConnection();
  const classRepository = connection.getRepository(Class)
  const weekDay = request.params.weekDay

  let classes = await classRepository.find({where: {weekDay}, relations: ['course', 'course.supervisor', 'host']})

  if(classes === undefined) {
    return response.status(500).json({
      status: "failure",
      message: "no classes found"
    })
  }

  if(classes.length == 0) {
    return response.status(200).json([])
  }

  classes.sort(compareClasses);
  const c1 = processCollisions(classes)
  let c2 = []
  for(let i=0; i< c1.length; i++) {
    const tmp = alterTimes(c1[i])
    c2.push(tmp)
  }
  return response.status(200).json(c2)
})

// getClassesHostedByUser(username)
classesRouter.get('/host/:username', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

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
      return response.status(200).json(alterKeys(items, "class"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

// getClassesByCourse(courseKey)
classesRouter.get('/course/:courseKey', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const connection = await getConnection();
  const courseKey = request.params.courseKey
  const courseRepository = connection.getRepository(Course)
  const classRepository = connection.getRepository(Class)
  const course = await courseRepository.findOne({courseKey});

  if (course == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified course does not exist"
    })
  }

  const cls = await classRepository.findOne({where: {course}, relations: ['course', 'course.supervisor', 'host']})
  if (cls) {
    return response.status(200).json(alterTimes(cls))
  }
  return response.status(500).json({
    status: "failure",
    message: "no such classes found"
  })

})

//getClassByGroupKey()
classesRouter.get('/:groupKey', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const groupKey = request.params.groupKey
  const connection = await getConnection();
  const classRepository = connection.getRepository(Class)

  const classes = await classRepository.find({where: {groupKey}, relations: ['course', 'course.supervisor', 'host']})

  if(classes === undefined) {
    return response.status(500).json({
      status: "failure",
      message: "no classes found"
    })
  }
  return response.status(200).json(alterTimes(classes))
})

// getAllClasses() -> Classes[]
classesRouter.get('/', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const connection = await getConnection();
  const classesRepository = connection.getRepository(Class)
  const coursesRepository = connection.getRepository(Course)

  const classes = await classesRepository.find({relations: ['host', 'course']});

  let newClasses = []
  for (const c of classes) {
    let newC: any = c
    let courses = await coursesRepository.find({relations: ['supervisor']})
    if (courses !== undefined) {
      const course = courses.filter(cc => {
        return cc.courseKey === c.course.courseKey
      })[0]
      newC.supervisor = {
        firstName: course.supervisor.firstName,
        lastName: course.supervisor.lastName,
        degree: course.supervisor.degree,
        username: course.supervisor.username
      }
      delete newC.course
      newC.startTime = strToTime(c.startTime)
      newC.endTime = strToTime(c.endTime)
      newClasses.push(newC)
    }
  }

  return response.status(200).json(classes)
})

export default classesRouter;