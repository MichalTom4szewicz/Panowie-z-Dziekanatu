import {getConnection, getRepository} from "typeorm";
import {Class} from "../entity/Class";
import {HostingRequest} from "../entity/HostingRequest";
import {User} from '../entity/User'
import {Request, Response} from "express"
import { Course } from "../entity/Course";
import {insertObjectIntoTable, alterKeys} from "../support/support"

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
  const body = request.body
  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const classesRepository = connection.getRepository(Class)

  const user = await userRepository.findOne({username: body.user.username});
  const clas = await classesRepository.findOne({groupKey: body.class.groupKey});

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
  const status = request.body.status

  const connection = await getConnection();
  const classRepository = await getRepository(Class)
  const hRequestRepository = await getRepository(HostingRequest)

  if(!(status == "accepted" || status == "rejected")) {
    return response.status(500).json({
      status: "failure",
      message: "specified new status is forbidden"
    })
  }

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
// zapiszMnieNaKursy(plan: Classes[]): void
// localhost:8000/hrequests
hostingRequestRouter.post('/plan', async (request: Request, response: Response) => {
  const plan = request.body.plan
  const username = request.body.username

  const connection = await getConnection();
  const classRepository = connection.getRepository(Class)
  const userRepository = connection.getRepository(User)

  let newhostingRequests = []
  for (let groupKey of plan.map((c: { groupKey: string; }) => c.groupKey)) {
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

hostingRequestRouter.put('/:id', async (request: Request, response: Response) => {
  const body = request.body
  const id = parseInt(request.params.id)

  const connection = await getConnection();
  const classesRepository = connection.getRepository(Class)
  const clas = await classesRepository.findOne({groupKey: body.class.groupKey});

  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: body.user.username});

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
    .update(HostingRequest)
    .set({
      status: body.status,
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