const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const APIInfosRouter = require('./routes/api-infos');
const SpritesRouter = require('./routes/sprites');
const DataRouter = require('./routes/data');
const SearchRouter = require('./routes/search');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', swaggerUI.serve);
app.get('/', swaggerUI.setup(swaggerSpec));


app.use('/:version/:lang/search', SearchRouter);
app.use('/api-infos', APIInfosRouter);
app.use('/:version/sprites', SpritesRouter);
app.use('/data', DataRouter);

module.exports = app;
