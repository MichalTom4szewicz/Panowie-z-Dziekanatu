import {getConnection} from "typeorm";
import {User} from "../entity/User";
import {Request, Response} from "express"

const logger = require('../utils/logger')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

usersRouter.post('/', async (request: Request, response: Response) => {
  const body = request.body
  const password = await bcrypt.hash(body.password, 10)

  const newUser: User = {
    pesel: body.pesel,
    firstName: body.firstName,
    lastName: body.lastName,
    username: body.username,
    password,
    courses: [],
    hostingRequests: [],
    classes: [],
    myclasses: []
  }

  await getConnection()
  .createQueryBuilder()
  .insert()
  .into(User)
  .values(newUser)
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
})

usersRouter.put('/:pesel', async (request: Request, response: Response) => {
  const body = request.body
  const password = await bcrypt.hash(body.password, 10)

  const newUser: User = {
    pesel: body.pesel,
    firstName: body.firstName,
    lastName: body.lastName,
    username: body.username,
    password,
    courses: [],
    hostingRequests: [],
    classes: [],
    myclasses: []
  }

  await getConnection()
  .createQueryBuilder()
  .insert()
  .into(User)
  .values(newUser)
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
})

usersRouter.get('/', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("user")
    .from(User, "")
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