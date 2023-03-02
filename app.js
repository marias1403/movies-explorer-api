require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { validateUserBody, validateAuthentication } = require('./middlewares/validations');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/users');
const rateLimiterUsingThirdParty = require('./middlewares/rateLimiter');
const errorsHandler = require('./middlewares/errorsHandler');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000, MONGO_DSN } = process.env;
const app = express();

app.use(helmet());
app.use(rateLimiterUsingThirdParty);

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_DSN, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  const requestHeaders = req.headers['access-control-request-headers'];
  const { method } = req;

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  next();
});

app.post('/signup', validateUserBody, createUser);
app.post('/signin', validateAuthentication, login);

app.use(auth);

app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
