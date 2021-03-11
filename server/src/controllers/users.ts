import {createConnection} from "typeorm";
import {User} from "../entity/User";
import {Request, Response} from "express"

const logger = require('../utils/logger')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


usersRouter.get('/', async (request: Request, response: Response) => {
  createConnection().then(async connection => {
    const users = await connection.manager.find(User);
    return response.json(users)
  })
  .catch(error => logger.error(error));
})

usersRouter.get('/:id', async (request: Request, response: Response) => {
  createConnection().then(async connection => {
    const user = await connection.manager.findOne(request.params.id);
    return response.json(user)
  })
  .catch(error => logger.error(error));
})


export default usersRouter;