import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {SchedulePart} from "../entity/SchedulePart";
import {User} from '../entity/User'
import {Request, Response} from "express"
import {insertObjectIntoTable, alterTimes, verify, alterKeys} from "../support/support"

const logger = require('../utils/logger')
const schedulePartRouter = require('express').Router()

// PZD-10
// zapiszPlan(objects: Classes[], name: string, user)
schedulePartRouter.post('/schedule', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const objects = request.body.objects
  const name = request.body.name
  const username = decoded.username

  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username});

  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    })
  }

  const classRepository = connection.getRepository(Class)

  let newScheduleParts: SchedulePart[] = []
  for (let groupKey of objects.map((c: { groupKey: string; }) => c.groupKey)) {
    const clas = await classRepository.findOne({groupKey});
    if (clas != undefined) {
      newScheduleParts.push({
        name,
        owner: user,
        class: clas
      })
    }
  }

  insertObjectIntoTable(newScheduleParts, SchedulePart, response);
})

// addSingleItemOfSchedule(scheduleName, Class)
schedulePartRouter.post('/', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const object = request.body.object

  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: decoded.username});

  const classRepository = connection.getRepository(Class)
  const clas = await classRepository.findOne({groupKey: object.class.groupKey});

  if (clas == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified class not found"
    })
  }
  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    })
  }

  const newSchedulePart = {
    name: object.name,
    owner: user,
    class: clas
  }

  insertObjectIntoTable(newSchedulePart, SchedulePart, response);
})

// deleteSchedule(name: string)
schedulePartRouter.delete('/schedule', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response);
  if(!decoded) return;

  const name = request.query.name as string;

  const connection = await getConnection();
  const spRepository = connection.getRepository(SchedulePart);
  const sp = await spRepository.findOne({name});

  if (sp == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified schedule does not exist"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(SchedulePart)
    .where("name = :iname", {name})
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

// deleteSingleSchedulePart
schedulePartRouter.delete('', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response);
  if(!decoded) return;

  const id = parseInt(request.query.id as string);

  const connection = await getConnection();
  const spRepository = connection.getRepository(SchedulePart);
  const sp = await spRepository.findOne({id});

  if (sp == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "part of schedule not found"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(SchedulePart)
    .where("id = :id", {id})
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

// changeSchedulePart(id)
schedulePartRouter.put('', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response);
  if(!decoded) return;

  const object = request.body.object;
  const id = parseInt(request.query.id as string);

  const connection = await getConnection();
  const classesRepository = connection.getRepository(Class);
  const clas = await classesRepository.findOne({groupKey: object.class.groupKey});

  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: object.owner.username});

  if (clas == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified class not found"
    })
  }
  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .update(SchedulePart)
    .set({
      name: object.name,
      owner: user,
      class: clas
    })
    .where("id = :id", {id})
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


// PZD-10
// getPlan(nazwa) -> Classes[]
// localhost:8000/scheduleparts/schedule/mojplan
schedulePartRouter.get('/schedule', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response);
  if(!decoded) return;

  const name = request.query.name;

  const connection = await getConnection();
  const spRepository = connection.getRepository(SchedulePart);
  let sp = await spRepository.find({where: {name: name}, relations: ['class']});

  if (sp) {
    for(let s of sp) {
      s.class = alterTimes(s.class)
    }
    return response.status(200).json(sp.map(s => s.class))
  }
  return response.status(200).json([]);
})


// getNAzwyMoichPlanów
schedulePartRouter.get('/names', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response);
  if(!decoded) return;

  const username = decoded.username;

  const connection = await getConnection();
  const userRepository = connection.getRepository(User);
  const spRepository = connection.getRepository(SchedulePart);
  const user = await userRepository.findOne({username});

  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    })
  }

  const schedulePart = await spRepository.find({where: { owner: user}});

  if(schedulePart == []) {
    return response.status(200).json([]);
  }

  return response.status(200).json(Array.from(new Set(schedulePart.map(element => element.name))));
})

schedulePartRouter.get('/', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response);
  if(!decoded) return;

  const connection = await getConnection();
  const spRepository = connection.getRepository(SchedulePart);

  const sps = await spRepository.find();

  return response.status(200).json(alterKeys(sps, "scheduleParts"));
})


export default schedulePartRouter;