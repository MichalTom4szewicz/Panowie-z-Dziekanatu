import {NextFunction, Request, Response} from 'express';
import axios from 'axios';
const logger = require('./logger')

const requestLogger = (request: Request, response: Response, next: any) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const headerToken = request.header('token');
  const auth = await axios.get("https://localhost:4848/verify",
    { headers: {'token': headerToken }});
  if (auth.status === 200 && auth.data.success) {
    request.headers['caller'] = auth.data.token.username;
    next();
  } else {
    return response.status(401);
  }
}

const unknownEndpoint = (request: Request, response: Response, next: any) => {
  response.status(404).send({ error: 'unknown endpoint' })
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenMiddleware
}
