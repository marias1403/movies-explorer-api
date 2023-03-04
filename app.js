require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const mainRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiterUsingThirdParty = require('./middlewares/rateLimiter');
const errorsHandler = require('./middlewares/errorsHandler');
const NotFoundError = require('./errors/not-found-error');
const validationConstants = require('./utils/constants');
const config = require('./utils/config');

const { PORT = 3000, MONGO_DSN = config.DEV_MODE_MONGO_DB_IP } = process.env;

const app = express();

app.use(helmet());

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_DSN, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(rateLimiterUsingThirdParty);

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

app.use(mainRouter);

app.use((req, res, next) => {
  next(new NotFoundError(validationConstants.ROUTE_NOT_FOUND_ERROR));
});

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
