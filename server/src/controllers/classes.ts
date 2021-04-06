import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {Request, Response} from "express"
import {compareClasses, alterKeys, processCollisions} from "../support/support"

const logger = require('../utils/logger')
const classesRouter = require('express').Router()

// example: host:8000/classes/weekDay?weekDay=wDay
classesRouter.get('/weekDay', async (request: Request, response: Response) => {
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

      return response.json(newItems)
    })
    .catch(error => logger.error(error));
})

classesRouter.get('/', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .execute()
    .then(items => {
      return response.json(items)
    })
    .catch(error => logger.error(error));
})

classesRouter.get('/:id', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.id = :id", {id: request.params.id})
    .execute()
    .then(item => {
      return response.json(item)
    })
    .catch(error => logger.error(error));
})

///////////////////////////////////////////////////////////////////////////////////////////////////

classesRouter.delete('/deleteDummy', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Class)
    .where("class.id > :id", { id: 0 })
    .execute()
    .then(() => {
      return response.json({status: "jest w pyte"})
    })
    .catch(error => logger.error(error));
})

classesRouter.post('/addDummy', async (request: Request, response: Response) => {
  const css = [
    {
      name: "Zastosowania informatyki w gospodarce",
      weekDay: "wDay",
      startTime: "17:05",
      endTime: "18:35",
      host: "Mgr inż. Tomasz Szandala",
      building: "C-1",
      room: "104",
      groupKey: "Z05-20a",
      typ: 'p'
    },
    {
      name: "Zastosowania informatyki w gospodarce",
      weekDay: "wDay",
      startTime: "18:55",
      endTime: "20:35",
      host: "Mgr inż. Tomasz Szandala",
      building: "C-1",
      room: "104",
      groupKey: "Z05-20b",
      typ: 'p'
    },
    {
      name: "Zastosowania informatyki w gospodarce",
      weekDay: "wDay",
      startTime: "18:00",
      endTime: "20:35",
      host: "Mgr inż. Tomasz Szandala",
      building: "C-1",
      room: "104",
      groupKey: "Z05-20c",
      typ: 'W'
    },
    {
      name: "Zastosowania informatyki w gospodarce",
      weekDay: "wDay",
      startTime: "18:05",
      endTime: "19:00",
      host: "Mgr inż. Tomasz Szandala",
      building: "C-1",
      room: "104",
      groupKey: "Z05-20c",
      typ: 'W'
    },
    {
      name: "Zastosowania informatyki w gospodarce",
      weekDay: "wDay",
      startTime: "20:40",
      endTime: "21:35",
      host: "Mgr inż. Tomasz Szandala",
      building: "C-1",
      room: "104",
      groupKey: "Z05-20c",
      typ: 'W'
    }
  ]

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Class)
    .values(css)
    .execute()
    .then(() => {
      return response.json(css)
    })
    .catch(error => logger.error(error));
})


export default classesRouter;