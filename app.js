const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');

const { DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/handleErrors');
const routes = require('./routes');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');

const app = express();

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

app.use(requestLogger);

app.use(routes);

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());
app.use(handleErrors);

mongoose.connect(DB_URL, { useNewUrlParser: true });

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
