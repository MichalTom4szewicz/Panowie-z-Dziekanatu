import {getConnection} from "typeorm";
import {User} from "../entity/User";
import {Request, Response} from "express"
import {alterKeys} from "../support/support"

const logger = require('../utils/logger')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

usersRouter.post('/', async (request: Request, response: Response) => {
  const body = request.body
  const password = await bcrypt.hash(body.password, 10)

  const newUser: User = {
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
      status: "failure",
      message: error.message
    })
  });
})

usersRouter.put('/:username', async (request: Request, response: Response) => {
  const body = request.body
  const password = await bcrypt.hash(body.password, 10)
  const username = request.params.username

  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const usr = await userRepository.findOne({username: username});

  if (usr == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "user not found"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({
        firstName: body.firstName,
        lastName: body.lastName,
        // username: body.username,
        password,
    })
    .where("username = :username", { username: username })
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

usersRouter.delete('/:username', async (request: Request, response: Response) => {
  const username = request.params.username

  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const usr = await userRepository.findOne({username: username});

  if (usr == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "user not found"
    })
  }
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("username = :username", { username: username})
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

usersRouter.get('/usernames', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("user.username")
    .from(User, "user")
    .execute()
    .then(items => {
      return response
      .status(200)
      .json(alterKeys(items, "user").map((item: { username: string; }) => item.username))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

usersRouter.get('/:username', async (request: Request, response: Response) => {
  const username = request.params.username

  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const usr = await userRepository.findOne({username: username});

  if (usr == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "user not found"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .where("user.username = :username", {username: request.params.username})
    .execute()
    .then(items => {
      return response.status(200).json(alterKeys(items, "user"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

usersRouter.get('/', async (request: Request, response: Response) => {
  await getConnection()
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .execute()
    .then(items => {
      return response.status(200).json(alterKeys(items, "user"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
        status: "failure",
        message: error.message
      })
    });
})

export default usersRouter;