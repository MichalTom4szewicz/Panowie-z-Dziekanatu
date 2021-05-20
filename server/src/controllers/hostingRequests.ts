import {getConnection, getRepository} from "typeorm";
import {Class} from "../entity/Class";
import {HostingRequest} from "../entity/HostingRequest";
import {User} from '../entity/User'
import {Request, Response} from "express"
import { Status } from "../enums/status";
import {insertObjectIntoTable, alterKeys, isTime, validateValues} from "../support/support"
import { report } from "node:process";

const logger = require('../utils/logger')
const hostingRequestRouter = require('express').Router()

hostingRequestRouter.delete('/:id', async (request: Request, response: Response) => {
  const id = parseInt(request.params.id)
  const connection = await getConnection();
  const hrRepository = connection.getRepository(HostingRequest)
  const hr = await hrRepository.findOne({id});

  if (hr == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "hosting request not found"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(HostingRequest)
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

hostingRequestRouter.post('/', async (request: Request, response: Response) => {
  const object = request.body.object
  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const classesRepository = connection.getRepository(Class)

  const user = await userRepository.findOne({username: object.user.username});
  const clas = await classesRepository.findOne({groupKey: object.class.groupKey});

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

  const newRequest = {
    class: clas,
    user: user,
    status: "pending"
  }

  insertObjectIntoTable(newRequest, HostingRequest, response)
})

// PZD-10
// accepted/rejected/pending
hostingRequestRouter.get('/user/:username/status/:status', async (request: Request, response: Response) => {
  const status = request.params.status
  const username = request.params.username

  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username})

  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .select("hostingRequest")
    .from(HostingRequest, "hostingRequest")
    .where("hostingRequest.userUsername = :username AND hostingRequest.status = :status", {username, status})
    .execute()
    .then(items => {
      return response.status(200).json(alterKeys(items, "hostingRequests"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

// PZD-27
// getHostingRequests by class
// accepted/rejected/pending
hostingRequestRouter.get('/class:id/status/:status', async (request: Request, response: Response) => {
  const status = request.params.status
  const classId = request.params.class

  const connection = await getConnection();
  const classRepository = connection.getRepository(Class)
  const cls = await classRepository.findOne({groupKey: classId})

  if (cls == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified class does not exist"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .select("hostingRequest")
    .from(HostingRequest, "hostingRequest")
    .where("hostingRequest.classGroupKey = :groupKey AND hostingRequest.status = :status", {groupKey: cls.groupKey, status})
    .execute()
    .then(items => {
      return response.status(200).json(alterKeys(items, "hostingRequests"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

hostingRequestRouter.get('/user/:username', async (request: Request, response: Response) => {
  const username = request.params.username

  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username})

  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .select("hostingRequest")
    .from(HostingRequest, "hostingRequest")
    .where("hostingRequest.userUsername = :username", {username})
    .execute()
    .then(items => {
      return response.status(200).json(alterKeys(items, "hostingRequests"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

//all h requests
hostingRequestRouter.get('/', async (request: Request, response: Response) => {
    const connection = await getConnection();
    const hRequestRepository = connection.getRepository(HostingRequest)

    const hRequests = await hRequestRepository.find();

    return response.json(alterKeys(hRequests, "hostingRequests"))
})

// PZD-10
// zatwierdz badz odrzuc prowadzacego prowadzacego
// localhost:8000/hrequests/resolve/blabla
hostingRequestRouter.put('/resolve/:id', async (request: Request, response: Response) => {
  const id = parseInt(request.params.id)
  const status = request.body.object.status

  if(!validateValues(status, Status, response)) return

  const connection = await getConnection();
  const hRequestRepository = await connection.getRepository(HostingRequest)

  await getConnection()
    .createQueryBuilder()
    .update(HostingRequest)
    .set({status})
    .where("id = :id", { id })
    .execute()
    .then(async () => {
      if(status === "accepted") {
        const hr = await hRequestRepository.findOne({id})

        if(hr === undefined) {
          return response.status(500).json({
            status: "failure",
            message: "hosting request not found"
          })
        }

        const host = hr.user
        await getConnection()
        .createQueryBuilder()
        .update(Class)
        .set({host})
        .where("groupKey = :groupKey", { groupKey: hr.class.groupKey })
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
      }
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
// zapiszMnieNaKursy(objects: Classes[]): void
// localhost:8000/hrequests
hostingRequestRouter.post('/plan', async (request: Request, response: Response) => {
  const objects = request.body.objects
  const username = request.body.username

  const connection = await getConnection();
  const classRepository = connection.getRepository(Class)
  const userRepository = connection.getRepository(User)

  let newhostingRequests = []
  for (let groupKey of objects.map((c: { groupKey: string; }) => c.groupKey)) {
    const clas = await classRepository.findOne({groupKey});
    const user = await userRepository.findOne({username});

    if (clas != undefined && user != undefined) {
      newhostingRequests.push({
        status: "pending",
        user,
        class: clas
      })
    }
  }

  insertObjectIntoTable(newhostingRequests, HostingRequest, response);
})

//PZD27
//rejectHostingRequests
hostingRequestRouter.put('/:id', async (request: Request, response: Response) => {
  const objects = request.body.objects
  let ids = objects.map((o: { id: any; }) => o.id)

  const connection = await getConnection();
  const hrRepository = connection.getRepository(HostingRequest)

  ids.array.forEach(async (id: any) => {
    const tmpHr = await hrRepository.findOne({id});
    if(tmpHr !== undefined) {
      await getConnection()
      .createQueryBuilder()
      .update(HostingRequest)
      .set({
        status: "rejected"
      })
      .where("id = :id", {id: tmpHr.id})
      .execute()
    }
  });

  return response.status(200).json({
    status: "success"
  })
})

hostingRequestRouter.put('/:id', async (request: Request, response: Response) => {
  const object = request.body.object
  const id = parseInt(request.params.id)

  const connection = await getConnection();
  const classesRepository = connection.getRepository(Class)
  const clas = await classesRepository.findOne({groupKey: object.class.groupKey});

  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: object.user.username});

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

  if(!validateValues(object.status, Status, response)) return

  await getConnection()
    .createQueryBuilder()
    .update(HostingRequest)
    .set({
      status: object.status,
      user,
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

export default hostingRequestRouter;