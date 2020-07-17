const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const Database = require('./database');
const { Metrics } = require('./metrics');
const { morganLogger } = require('./morgan');

global.knex = new Database().knex;
const routes = require('./routes');

const {
  PORT,
  HOST,
  METRICS_ENABLED,
  NODE_APP_INSTANCE,
} = process.env;
const app = express();

app.use(helmet());
app.set('trust proxy', true);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
morganLogger(app);
app.use(routes);
app.listen(PORT, HOST, () => {
  console.log(`Server has been started on ${HOST}:${PORT}`);
});

if (NODE_APP_INSTANCE === '0' && METRICS_ENABLED) {
  Metrics.start();
}

process.on('uncaughtException', (reason, p) => {
  console.error('>>>uncaughtException', reason, p);
  process.exit(1);
});
