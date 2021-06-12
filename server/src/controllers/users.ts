import {getConnection} from "typeorm";
import {User} from "../entity/User";
import {Request, Response} from "express"
import {alterKeys, verify, validateValues, insertObjectIntoTable} from "../support/support"
import {Degree} from "../enums/degree"

const logger = require('../utils/logger')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request: Request, response: Response) => {
  //
  // const token = request.header('token');
  // const decoded = await verify(token, response)
  // if(!decoded) return

  const object = request.body.object

  if(!validateValues(object.degree, Degree, response)) return

  const newUser: User = {
    firstName: object.firstName,
    lastName: object.lastName,
    username: object.username,
    password: "none",
    degree: object.degree,
    courses: [],
    hostingRequests: [],
    classes: [],
    myclasses: []
  }

  insertObjectIntoTable(newUser, User, response);
})

usersRouter.put('/:username', async (request: Request, response: Response) => {

  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const object = request.body.object
  const password = await bcrypt.hash(object.password, 10)
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
        firstName: object.firstName,
        lastName: object.lastName,
        // username: body.username, // can't update username
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

  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

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
  //
  // const token = request.header('token');
  // const decoded = await verify(token, response)
  // if(!decoded) return

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
    return response.status(200).json({
      status: "failure",
      message: "user not found"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .where("user.username = :username", {username: username})
    .execute()
    .then(items => {
      return response.status(200).json(alterKeys(items, "user")[0])
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
  // const token = request.header('token');
  // const decoded = await verify(token, response)
  // if(!decoded) return

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
