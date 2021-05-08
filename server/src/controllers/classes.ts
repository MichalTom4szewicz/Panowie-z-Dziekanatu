import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {Request, Response} from "express"
import {compareClasses, alterKeys, processCollisions, listCollisions} from "../support/support"

const logger = require('../utils/logger')
const classesRouter = require('express').Router()

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

///////////////////////////////////////////////////////////////////////////////////////////////////

// classesRouter.delete('/deleteDummy', async (request: Request, response: Response) => {
//   await getConnection()
//     .createQueryBuilder()
//     .delete()
//     .from(Class)
//     .where("class.id > :id", { id: 0 })
//     .execute()
//     .then(() => {
//       return response.json({status: "jest w pyte"})
//     })
//     .catch(error => logger.error(error));
// })

// classesRouter.post('/addDummy', async (request: Request, response: Response) => {
//   const css = [
//     {
//       name: "Zastosowania informatyki w gospodarce",
//       weekDay: "wDay",
//       startTime: "17:05",
//       endTime: "18:35",
//       host: "Mgr inż. Tomasz Szandala",
//       building: "C-1",
//       room: "104",
//       groupKey: "Z05-20a",
//       typ: 'p'
//     },
//     {
//       name: "Zastosowania informatyki w gospodarce",
//       weekDay: "wDay",
//       startTime: "18:55",
//       endTime: "20:35",
//       host: "Mgr inż. Tomasz Szandala",
//       building: "C-1",
//       room: "104",
//       groupKey: "Z05-20b",
//       typ: 'p'
//     },
//     {
//       name: "Zastosowania informatyki w gospodarce",
//       weekDay: "wDay",
//       startTime: "18:00",
//       endTime: "20:35",
//       host: "Mgr inż. Tomasz Szandala",
//       building: "C-1",
//       room: "104",
//       groupKey: "Z05-20c",
//       typ: 'W'
//     },
//     {
//       name: "Zastosowania informatyki w gospodarce",
//       weekDay: "wDay",
//       startTime: "18:05",
//       endTime: "19:00",
//       host: "Mgr inż. Tomasz Szandala",
//       building: "C-1",
//       room: "104",
//       groupKey: "Z05-20d",
//       typ: 'W'
//     },
//     {
//       name: "Zastosowania informatyki w gospodarce",
//       weekDay: "wDay",
//       startTime: "20:40",
//       endTime: "21:35",
//       host: "Mgr inż. Tomasz Szandala",
//       building: "C-1",
//       room: "104",
//       groupKey: "Z05-20e",
//       typ: 'W'
//     }
//   ]

//   await getConnection()
//     .createQueryBuilder()
//     .insert()
//     .into(Class)
//     .values(css)
//     .execute()
//     .then(() => {
//       return response.json(css)
//     })
//     .catch(error => logger.error(error));
// })


export default classesRouter;