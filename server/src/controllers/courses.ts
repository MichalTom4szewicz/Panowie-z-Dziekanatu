import {getConnection} from "typeorm";
import {Course} from "../entity/Course";
import {User} from '../entity/User'
import {Request, Response} from "express"
import {insertObjectIntoTable, verify, alterKeys} from "../support/support"

const logger = require('../utils/logger')
const coursesRouter = require('express').Router()

coursesRouter.post('/', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const object = request.body.object

  const connection = await getConnection();
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({username: decoded.username});

  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "user not found"
    })
  }

  const newCourse: Course = {
    courseKey: object.courseKey,
    name: object.name,
    supervisor: user,
    classes: []
  }

  insertObjectIntoTable(newCourse, Course, response)
})

coursesRouter.delete('', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const courseKey = request.query.courseKey as string;

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
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

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
coursesRouter.get('/user', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response);
  if(!decoded) return;

  const username = request.query.username as string;

  const connection = await getConnection();
  const userRepository = connection.getRepository(User);
  const user = await userRepository.findOne({username});

  if (user == undefined) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    });
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

coursesRouter.get('/key', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const courseKey = request.query.courseKey

  const connection = await getConnection();
  const coursesRepository = connection.getRepository(Course)

  const course = await coursesRepository.findOne({relations: ['supervisor'], where: {courseKey}});

  if(course !== undefined) {
    let newC: any = course
    newC.supervisor = {
      firstName: course.supervisor.firstName,
      lastName: course.supervisor.lastName,
      degree: course.supervisor.degree
    }
    return response
    .status(200)
    .json(course)
  } else {
    return response.status(500).json({
      status: "failure",
      message: "course not found"
    })
  }
})

coursesRouter.get('/', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response)
  if(!decoded) return

  const connection = await getConnection();
  const coursesRepository = connection.getRepository(Course)
  const userRepository = connection.getRepository(User)

  const user = await userRepository.findOne({username: decoded.username})

  if(!user) {
    return response.status(500).json({
      status: "failure",
      message: "specified user does not exist"
    })
  }

  const courses = await coursesRepository.find({where: {supervisor: user},relations: ['supervisor']});
  return response.status(200).json(courses)
})

coursesRouter.put('/', async (request: Request, response: Response) => {
  const token = request.header('token');
  const decoded = await verify(token, response);
  if(!decoded) return;

  const object = request.body.object;
  const courseKey = request.query.courseKey as string;

  const connection = await getConnection();
  const courseRepository = connection.getRepository(Course);
  const course = await courseRepository.findOne({courseKey});

  const userRepository = connection.getRepository(User);
  const user = await userRepository.findOne({username: object.supervisor.username});

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
        name: object.name,
        courseKey: object.courseKey,
        supervisor: user
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