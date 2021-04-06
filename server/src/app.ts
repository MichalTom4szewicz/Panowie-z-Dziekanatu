
require('express-async-errors');

import express from 'express';
import usersRouter from './controllers/users'

const app = express();
const cors = require('cors');
const middleware = require('./utils/middleware');


app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.get('/', (req: express.Request, res: express.Response) => res.send('Hola amigo!!!'));
app.use('/users', usersRouter);

app.use(middleware.unknownEndpoint);


export default app;