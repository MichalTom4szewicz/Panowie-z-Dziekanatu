import {getConnection} from "typeorm";
import {User} from "../entity/User";
import {Request, Response} from "express"
import {alterKeys, verify, validateValues, insertObjectIntoTable} from "../support/support"
import {Degree} from "../enums/degree"

const logger = require('../utils/logger')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

usersRouter.post('/', async (request: Request, response: Response) => {
  //dej_tokena_mikiconst token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2kiLCJwYXNzd29yZCI6IiQyYiQwNCRXTU40RmZtei5xLktkL0ZaTGJlYkplY3pHWWxNY1ZVa1BTT1hVOWpxV3lLdEUzaHovbFZmNiIsInJvbGUiOm51bGwsImlhdCI6MTYyMTM0Nzg5NCwiZXhwIjoxNjIxMzkxMDk0fQ.ybQe5coBXQikTWTIH0rv23UsK7M1wNs-7AAtluaNRK0"
  //dej_tokena_bodyconst token = request.body.token
  //dej_tokena_mikiif(!(await verify(token, response))) return
  const object = request.body.object
  const password = await bcrypt.hash(object.password, 10)

  if(!validateValues(object.degree, Degree, response)) return

  const newUser: User = {
    firstName: object.firstName,
    lastName: object.lastName,
    username: object.username,
    password,
    degree: object.degree,
    courses: [],
    hostingRequests: [],
    classes: [],
    myclasses: []
  }

  insertObjectIntoTable(newUser, User, response);
})

usersRouter.put('/:username', async (request: Request, response: Response) => {
  //dej_tokena_mikiconst token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2kiLCJwYXNzd29yZCI6IiQyYiQwNCRXTU40RmZtei5xLktkL0ZaTGJlYkplY3pHWWxNY1ZVa1BTT1hVOWpxV3lLdEUzaHovbFZmNiIsInJvbGUiOm51bGwsImlhdCI6MTYyMTM0Nzg5NCwiZXhwIjoxNjIxMzkxMDk0fQ.ybQe5coBXQikTWTIH0rv23UsK7M1wNs-7AAtluaNRK0"
  //dej_tokena_bodyconst token = request.body.token
  //dej_tokena_mikiif(!(await verify(token, response))) return

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
  //dej_tokena_mikiconst token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2kiLCJwYXNzd29yZCI6IiQyYiQwNCRXTU40RmZtei5xLktkL0ZaTGJlYkplY3pHWWxNY1ZVa1BTT1hVOWpxV3lLdEUzaHovbFZmNiIsInJvbGUiOm51bGwsImlhdCI6MTYyMTM0Nzg5NCwiZXhwIjoxNjIxMzkxMDk0fQ.ybQe5coBXQikTWTIH0rv23UsK7M1wNs-7AAtluaNRK0"
  //dej_tokena_bodyconst token = request.body.token
  //dej_tokena_mikiif(!(await verify(token, response))) return
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
  //dej_tokena_mikiconst token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2kiLCJwYXNzd29yZCI6IiQyYiQwNCRXTU40RmZtei5xLktkL0ZaTGJlYkplY3pHWWxNY1ZVa1BTT1hVOWpxV3lLdEUzaHovbFZmNiIsInJvbGUiOm51bGwsImlhdCI6MTYyMTM0Nzg5NCwiZXhwIjoxNjIxMzkxMDk0fQ.ybQe5coBXQikTWTIH0rv23UsK7M1wNs-7AAtluaNRK0"
  //dej_tokena_bodyconst token = request.body.token
  //dej_tokena_mikiif(!(await verify(token, response))) return
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

  //dej_tokena_mikiconst token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2kiLCJwYXNzd29yZCI6IiQyYiQwNCRXTU40RmZtei5xLktkL0ZaTGJlYkplY3pHWWxNY1ZVa1BTT1hVOWpxV3lLdEUzaHovbFZmNiIsInJvbGUiOm51bGwsImlhdCI6MTYyMTM0Nzg5NCwiZXhwIjoxNjIxMzkxMDk0fQ.ybQe5coBXQikTWTIH0rv23UsK7M1wNs-7AAtluaNRK0"
  //dej_tokena_bodyconst token = request.body.token
  //dej_tokena_mikiif(!(await verify(token, response))) return

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
    .where("user.username = :username", {username: username})
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
  //dej_tokena_mikiconst token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2kiLCJwYXNzd29yZCI6IiQyYiQwNCRXTU40RmZtei5xLktkL0ZaTGJlYkplY3pHWWxNY1ZVa1BTT1hVOWpxV3lLdEUzaHovbFZmNiIsInJvbGUiOm51bGwsImlhdCI6MTYyMTM0Nzg5NCwiZXhwIjoxNjIxMzkxMDk0fQ.ybQe5coBXQikTWTIH0rv23UsK7M1wNs-7AAtluaNRK0"
  //dej_tokena_bodyconst token = request.body.token
  //dej_tokena_mikiif(!(await verify(token, response))) return


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