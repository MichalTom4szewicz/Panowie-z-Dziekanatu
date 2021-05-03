import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {HostingRequest} from "../entity/HostingRequest";
import {User} from '../entity/User'
import {Request, Response} from "express"

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

//all h requests
hostingRequestRouter.get('/', async (request: Request, response: Response) => {
    const connection = await getConnection();
    const hRequestRepository = connection.getRepository(HostingRequest)

    const hRequests = await hRequestRepository.find();

    return response.json(hRequests)
})




export default hostingRequestRouter;