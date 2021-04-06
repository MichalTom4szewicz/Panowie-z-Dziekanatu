import {createConnection, getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {Request, Response} from "express"

const logger = require('../utils/logger')
const classesRouter = require('express').Router()

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

classesRouter.delete('/deleteDummy', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Class)
    .where("class.id > :id", { id: 0 })
    .execute()
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