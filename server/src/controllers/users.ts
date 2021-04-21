import {getConnection} from "typeorm";
import {User} from "../entity/User";
import {Request, Response} from "express"

const logger = require('../utils/logger')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


usersRouter.get('/', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .execute()
    .then(items => {
      return response.json(items)
    })
    .catch(error => logger.error(error));
})

usersRouter.get('/:id', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .where("user.id = :id", {id: request.params.id})
    .execute()
    .then(item => {
      return response.json(item)
    })
    .catch(error => logger.error(error));
})


export default usersRouter;