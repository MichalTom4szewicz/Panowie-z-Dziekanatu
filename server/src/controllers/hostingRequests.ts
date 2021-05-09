import {getConnection, getRepository} from "typeorm";
import {Class} from "../entity/Class";
import {HostingRequest} from "../entity/HostingRequest";
import {User} from '../entity/User'
import {Request, Response} from "express"
import { Course } from "../entity/Course";

const logger = require('../utils/logger')

const hostingRequestRouter = require('express').Router()

hostingRequestRouter.delete('/deleteDummy', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(HostingRequest)
    .where("hostingRequest.id > :id", { id: 0 })
    .execute()
    .then(() => {
      return response.json({status: "jest w pyte"})
    })
    .catch(error => logger.error(error));
})

hostingRequestRouter.post('/addDummy', async (request: Request, response: Response) => {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User)
    const classesRepository = connection.getRepository(Class)

    const usr1 = await userRepository.findOne({id: 2});
    const usr2 = await userRepository.findOne({id: 4});
    const cls = await classesRepository.findOne({id: 15});

    const css = [
        {
            class: cls,
            user: usr1
        },
        {
            class: cls,
            user: usr2
        }
    ]

    await getConnection()
    .createQueryBuilder()
    .insert()
    .into(HostingRequest)
    .values(css)
    .execute()
    .then(() => {
      return response.json(css)
    })
    .catch(error => logger.error(error));
})

// PZD-10
// localhost:8000/hrequests?id=blablablc?status=accepted
// accepted/rejected/pending
// userid
hostingRequestRouter.get('/', async (request: Request, response: Response) => {
  const id = request.query.id
  const status = request.query.status
  const connection = await getConnection();
  const hRequestRepository = connection.getRepository(HostingRequest)
  const userRepository = connection.getRepository(User)
  const classRepository = connection.getRepository(Class)
  const courseRepository = connection.getRepository(Course)

  const user = await userRepository.findOne({where: {id: id}})
  const course = await courseRepository.findOne({where: {user: user}})
  const clas = await classRepository.findOne({where: {course: course}})
  const hr = await hRequestRepository.find({where: {class: clas, status: status}})

  return response.status(200).json(hr)
})

//all h requests
hostingRequestRouter.get('/', async (request: Request, response: Response) => {
    const connection = await getConnection();
    const hRequestRepository = connection.getRepository(HostingRequest)

    const hRequests = await hRequestRepository.find();

    return response.json(hRequests)
})

// PZD-10
// zatwierdz badz odrzuc prowadzacego prowadzacego
// localhost:8000/hrequests/blabla
hostingRequestRouter.put('/:id', async (request: Request, response: Response) => {
  const id = request.params.id
  const newStatus = request.body.status

  const connection = await getConnection();
  const classRepository = await getRepository(Class)
  const hRequestRepository = await getRepository(HostingRequest)

  await getConnection()
    .createQueryBuilder()
    .update(HostingRequest)
    .set({status: newStatus})
    .where("id = :id", { id: id })
    .execute()
    .then(async () => {
      if(newStatus === "accepted") {
        const hr = await hRequestRepository.find({where: {id: id}})
        const host = hr[0].user
        await getConnection()
        .createQueryBuilder()
        .update(Class)
        .set({host: host})
        .where("id = :id", { id: hr[0].class.id })
        .execute()
        .then(() => {
          return response.status(200).json({
            status: "success"
          })
        })
        .catch(error => {
          logger.error(error)
          return response.status(500).json({
            status: "failure"
          })
        });
      }
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure"
      })
    });


})

// PZD-10
// zapiszMnieNaKursy(plan: Classes[]): void
// localhost:8000/hrequests
hostingRequestRouter.post('/', async (request: Request, response: Response) => {
  const plan = request.body.plan

  await getConnection()
  .createQueryBuilder()
  .insert()
  .into(HostingRequest)
  .values(plan)
  .execute()
  .then(() => {
    return response.status(200).json({
      status: "success"
    })
  })
  .catch(error => {
    logger.error(error)
    return response.status(200).json({
      status: "failure"
    })
  });
})



export default hostingRequestRouter;