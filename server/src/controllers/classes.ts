import {createConnection, getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {Request, Response} from "express"
import {classesCollide, compareClasses, alter} from "../support/support"

const logger = require('../utils/logger')
const classesRouter = require('express').Router()


classesRouter.get('/weekDay', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("class")
    .from(Class, "class")
    .where("class.weekDay = :weekDay", {weekDay: request.query.weekDay})
    .execute()
    .then(items => {
      let newItems = alter(items, "class");
      newItems.sort(compareClasses);

      let index = 0;
      let nonColliding: Array<Class[]>  = []
      let wstawiono = false
      let koliduje = false

      nonColliding.push([newItems[0]])
      // nonColliding.push([])
      for(let i=1; i<newItems.length; i++) {
        // if(nonColliding[index].length === 0) {
        //   nonColliding[index].push(newItems[i])
        // } else {
          for(let j=0; j<nonColliding.length; j++) {
            for(let k=0; k<nonColliding[j].length; k++) {
              if(classesCollide(newItems[i], nonColliding[j][k])) {
                koliduje = true;
              }
            }
            if(!koliduje) {
              nonColliding[j].push(newItems[i]);
              wstawiono = true;
              koliduje = false;
              break;
            }
            koliduje = false;
          }
          if(!wstawiono) {
            nonColliding.push([newItems[i]]);
          }
          wstawiono = false;
        // }
      }

      return response.json(nonColliding)
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