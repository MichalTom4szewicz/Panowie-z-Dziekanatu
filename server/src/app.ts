require('express-async-errors');

import express from 'express';
import usersRouter from './controllers/users'
import classesRouter from './controllers/classes'
import coursesRouter from './controllers/courses'
import hostingRequestRouter from './controllers/hostingRequests'

const app = express();
const cors = require('cors');
const middleware = require('./utils/middleware');


app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.get('/', (req: express.Request, res: express.Response) => res.send('Hola amigo!!!'));
app.use('/users', usersRouter);
app.use('/classes', classesRouter);
app.use('/courses', coursesRouter);
app.use('/hrequests', hostingRequestRouter);

app.use(middleware.unknownEndpoint);


export default app;