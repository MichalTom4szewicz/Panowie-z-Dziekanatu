import { Request, Response } from "express"
import { nextTick } from "node:process"
const logger = require('./logger')

const requestLogger = (request: Request, response: Response, next: any) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request: Request, response: Response, next: any) => {
  response.status(404).send({ error: 'unknown endpoint' })
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint
}