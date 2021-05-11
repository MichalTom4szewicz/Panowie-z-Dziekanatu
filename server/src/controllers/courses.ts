import {getConnection} from "typeorm";
import {Class} from "../entity/Class";
import {Course} from "../entity/Course";
import {User} from '../entity/User'
import {Request, Response} from "express"
import {insertObjectIntoTable, alterKeys, processCollisions, listCollisions} from "../support/support"

const logger = require('../utils/logger')
const coursesRouter = require('express').Router()

coursesRouter.post('/', async (request: Request, response: Response) => {
  const body = request.body

  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: body.user.username});

  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "user not found"
    })
  }

  const newCourse: Course = {
    courseKey: body.courseKey,
    name: body.name,
    user,
    classes: []
  }

  insertObjectIntoTable(newCourse, Course, response)
})

coursesRouter.delete('/:courseKey', async (request: Request, response: Response) => {
  const courseKey = request.params.courseKey

  const connection = await getConnection();
  const courseRepository = connection.getRepository(Course)
  const course = await courseRepository.findOne({courseKey});

  if (course == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "course not found"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Course)
    .where("courseKey = :courseKey", {courseKey})
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

// PZD-10
// getNazwyKursow() -> String[]
// localhost:8000/courses/names
coursesRouter.get('/names', async (request: Request, response: Response) => {
    await getConnection()
    .createQueryBuilder()
    .select("course")
    .from(Course, "course")
    .execute()
    .then(items => {
      return response
      .status(200)
      .json(alterKeys(items, "course").map((item: { name: string; }) => item.name))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
          status: "failure",
          message: error.message
      })
    });
})

// coursesOfUser(username) -> Courses
coursesRouter.get('/user/:username', async (request: Request, response: Response) => {
  const username = request.params.username

  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username});

  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .select("course")
    .from(Course, "course")
    .where("userUsername = :user", {user: user.username})
    .execute()
    .then(items => {
      return response
      .status(200)
      .json(alterKeys(items, "course"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
          status: "failure",
          message: error.message
      })
    });
})

coursesRouter.get('/:courseKey', async (request: Request, response: Response) => {
  const courseKey = request.params.courseKey

  await getConnection()
    .createQueryBuilder()
    .select("course")
    .from(Course, "course")
    .where("courseKey = :courseKey", {courseKey})
    .execute()
    .then(items => {
      return response
      .status(200)
      .json(alterKeys(items, "course"))
    })
    .catch(error => {
      logger.error(error)
      return response.status(500).json({
          status: "failure",
          message: error.message
      })
    });
})

coursesRouter.get('/', async (request: Request, response: Response) => {
  const connection = await getConnection();
  const coursesRepository = connection.getRepository(Course)

  const courses = await coursesRepository.find();

  return response.status(200).json(courses)
})

coursesRouter.put('/:courseKey', async (request: Request, response: Response) => {
  const body = request.body
  const courseKey = request.params.courseKey

  const connection = await getConnection();
  const courseRepository = connection.getRepository(Course)
  const course = await courseRepository.findOne({courseKey});

  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: body.user.username});

  if (course == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "course not found"
    })
  }
  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    })
  }

  await getConnection()
    .createQueryBuilder()
    .update(Course)
    .set({
        name: body.name,
        courseKey: body.courseKey,
        user: user
    })
    .where("courseKey = :courseKey", {courseKey})
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

export default coursesRouter;