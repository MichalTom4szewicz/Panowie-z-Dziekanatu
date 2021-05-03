import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {SchedulePart} from "../entity/schedulePart";
import {User} from '../entity/User'
import {Request, Response} from "express"

const logger = require('../utils/logger')

const schedulePart = require('express').Router()

schedulePart.delete('/deleteDummy', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(SchedulePart)
    .where("schedulePart.id > :id", { id: 0 })
    .execute()
    .then(() => {
      return response.json({status: "jest w pyte"})
    })
    .catch(error => logger.error(error));
})

schedulePart.post('/addDummy', async (request: Request, response: Response) => {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User)
    const classRepository = connection.getRepository(Class)

    const usr1 = await userRepository.findOne({id: 2});
    const usr2 = await userRepository.findOne({id: 4});

    const cls1 = await classRepository.findOne({id: 15})
    const cls2 = await classRepository.findOne({id: 16})


    const css = [
        {
            name: "plandwa",
            owner: usr1,
            class: cls1
        },
        {
            name: "plandwa",
            owner: usr1,
            class: cls2
        },
        {
            name: "plancztery",
            owner: usr2,
            class: cls2
        }
    ]

    await getConnection()
    .createQueryBuilder()
    .insert()
    .into(SchedulePart)
    .values(css)
    .execute()
    .then(() => {
      return response.json(css)
    })
    .catch(error => logger.error(error));
})

//all scheduleparts
schedulePart.get('/', async (request: Request, response: Response) => {
    const connection = await getConnection();
    const sPartRepository = connection.getRepository(SchedulePart)

    const sParts = await sPartRepository.find();

    return response.json(sParts)
})




export default schedulePart;