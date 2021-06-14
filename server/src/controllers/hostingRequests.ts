import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {HostingRequest} from "../entity/HostingRequest";
import {User} from '../entity/User'
import {Request, Response} from "express"
import { Status } from "../enums/status";
import {insertObjectIntoTable, alterTimes, alterKeys, validateValues, compareClasses} from "../support/support"

const logger = require('../utils/logger')
const hostingRequestRouter = require('express').Router()

//PZD-35
//deleteRejectedForUser
hostingRequestRouter.delete('/rejected', async (request: Request, response: Response) => {
  const username = request.header('caller');

  const connection = await getConnection();

  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({ username });

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
    .where("status = :status AND userUsername = :user", {status: "rejected", user: user.username})
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
  const username = request.header('caller');
  const object = request.body.object
  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const classesRepository = connection.getRepository(Class)

  const user = await userRepository.findOne({ username });
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
  const username = request.header('caller');
  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const hrRepository = connection.getRepository(HostingRequest)

  const user = await userRepository.findOne({where: { username }})

  if(!user) {
    return response.status(500).json({
      status: "failure",
      message: "specified user not found"
    })
  }

  const hrs = await hrRepository.find({where: {user}, relations: ['user', 'class', 'class.course', 'class.course.supervisor']});

  let table : any [][] = new Array(7).fill(false).map(() => []);
  for(let h of hrs) {
    table[(h.class.weekDay-1)%7].push(h);
  }
  for(let row of table) {
    row.sort((a,b) => compareClasses(a.class, b.class))
    for(let hr of row) {
      hr.class = alterTimes(hr.class)
    }
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
  const status = request.query.status as string;
  if(!validateValues(status, Status, response)) return

  const connection = await getConnection();
  const hrRepository = connection.getRepository(HostingRequest)
  let hrs = await hrRepository.find({where: {status}, relations: ['user', 'class']})

  for(let hr of hrs) {
    hr.class = alterTimes(hr.class)
  }
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
  const status = request.query.status as string;
  const classId = request.query.groupKey as string;

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
  const username = request.header('caller');

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
  const username = request.header('caller');
  const objects = request.body.objects

  const connection = await getConnection();
  const classRepository = connection.getRepository(Class)
  const userRepository = connection.getRepository(User)

  const hrRepository = connection.getRepository(HostingRequest)

  let newhostingRequests = []
  for (let groupKey of objects.map((c: { groupKey: string; }) => c.groupKey)) {
    const clas = await classRepository.findOne({groupKey});
    const user = await userRepository.findOne({username});

    if (clas != undefined && user != undefined) {
      const hr = await hrRepository.findOne({where: {user, class: clas}})

      if(!hr) {
        newhostingRequests.push({
          status: "pending",
          user,
          class: clas
        })
      }
    }
  }

  insertObjectIntoTable(newhostingRequests, HostingRequest, response);
})

//PZD27
//rejectHostingRequests
hostingRequestRouter.put('/reject', async (request: Request, response: Response) => {
  const objects = request.body.objects
  let ids = objects.map((o: { id: any; }) => o.id)

  const connection = await getConnection();
  const hrRepository = connection.getRepository(HostingRequest)
  console.log(objects)

  ids.forEach(async (id: any) => {
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
  const username = request.header('caller');
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
  .then(async () => {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User)
    const hrRepository = connection.getRepository(HostingRequest)

    const hr = await hrRepository.findOne({where: {id}, relations: ['class']})
    const host = await userRepository.findOne({username})

    if(!host || !hr) {
      return response.status(500).json({
        status: "failure",
        message: "bad user or hostingRequest"
      })
    }

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
