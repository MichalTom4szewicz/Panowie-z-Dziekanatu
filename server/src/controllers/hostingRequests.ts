import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {HostingRequest} from "../entity/HostingRequest";
import {User} from '../entity/User'
import {Request, Response} from "express"
import { Status } from "../enums/status";
import {insertObjectIntoTable, alterKeys, verify, validateValues, compareClasses} from "../support/support"

const logger = require('../utils/logger')
const hostingRequestRouter = require('express').Router()

//PZD-35
//deleteRejectedForUser
hostingRequestRouter.delete('/rejected', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const id = parseInt(request.query.id as string);
  const connection = await getConnection();
  const hrRepository = connection.getRepository(HostingRequest)
  const hr = await hrRepository.findOne({id});

  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: decoded.username});
  const username = decoded.username

  if (hr == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "hosting request not found"
    })
  }
  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "user not found"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(HostingRequest)
    .where("id = :id AND userUsername = :username", {id, username})
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

//removeById
hostingRequestRouter.delete('', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const id = parseInt(request.query.id as string);
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

// addHR
hostingRequestRouter.post('/', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const object = request.body.object
  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const classesRepository = connection.getRepository(Class)

  const user = await userRepository.findOne({username: decoded.username});
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
// getByUsernameWithType
hostingRequestRouter.get('/user', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const status = request.query.status as string;
  const username = request.query.username as string;

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

//PZD-34
//getAllOfUserSorted
hostingRequestRouter.get('/sorted', async (request: Request, response: Response) => {
  // const token = request.header('token');
  // const decoded = await verify(token, response)
  // if(!decoded) return
  const decoded = {username: "mt"};

  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const hrRepository = connection.getRepository(HostingRequest)

  const user = await userRepository.findOne({where: {username: decoded.username}})

  if(!user) {
    return response.status(500).json({
      status: "failure",
      message: "specified user not found"
    })
  }

  const hrs = await hrRepository.find({where: {user}, relations: ['user', 'class']});

  let table : any [][] = new Array(7).fill(false).map(() => []);
  for(let h of hrs) {
    table[h.class.weekDay].push(h);
  }
  for(let row of table) {
    row.sort((a,b) => compareClasses(a.class, b.class))
  }

  if (hrs) {
    return response.status(200).json(table)
  }
  return response.status(500).json({
    status: "failure",
    message: "specified hosting requests not found"
  })
})

//getAllByStatus
hostingRequestRouter.get('/status', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const status = request.query.status as string;
  if(!validateValues(status, Status, response)) return

  const connection = await getConnection();
  const hrRepository = connection.getRepository(HostingRequest)
  const hrs = await hrRepository.find({where: {status}, relations: ['user', 'class']})
  if (hrs) {
    return response.status(200).json(hrs)
  }
  return response.status(500).json({
    status: "failure",
    message: "specified hosting requests not found"
  })
})

// PZD-27
// getHostingRequests by class
// accepted/rejected/pending
hostingRequestRouter.get('/class', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const status = request.query.status as string;
  const classId = request.query.class as string;

  const connection = await getConnection();
  const classRepository = connection.getRepository(Class)
  const hrRepository = connection.getRepository(HostingRequest)
  const cls = await classRepository.findOne({groupKey: classId})

  if (cls == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified class does not exist"
    })
  }

  const hr = await hrRepository.find({where: {class: cls, status}, relations: ['user']})

  if (hr) {
    return response.status(200).json(hr)
  }
  return response.status(200).json([]);
})

//getByUsername
hostingRequestRouter.get('', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const username = decoded.username

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
      return response.status(200).json(alterKeys(items, "hostingRequest"))
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
// zatwierdz badz odrzuc prowadzacego prowadzacego
// localhost:8000/hrequests/resolve/blabla
hostingRequestRouter.put('/resolve', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const id = parseInt(request.query.id as string);
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
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const objects = request.body.objects
  const username = decoded.username

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
hostingRequestRouter.put('/reject', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

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

//PZD27
//acceptSingleHostingRequest
hostingRequestRouter.put('/accept', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const object = request.body.objects
  let id = object.id

  await getConnection()
  .createQueryBuilder()
  .update(HostingRequest)
  .set({
    status: "accepted"
  })
  .where("id = :id", {id})
  .execute()
  .then(() => {
    return response.status(200).json({
      status: "success"
    })
  })
  .catch(error => {
    return response.status(500).json({
      status: "failure",
      message: error.message
    })
  })
})

//modifyByID
hostingRequestRouter.put('', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response);
  if(!decoded) return;

  const object = request.body.object;
  const id = parseInt(request.query.id as string);

  const connection = await getConnection();
  const classesRepository = connection.getRepository(Class);
  const clas = await classesRepository.findOne({groupKey: object.class.groupKey});

  const userRepository = connection.getRepository(User);
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