require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const cors = require('cors');
const helmet = require('helmet');

const keys = require('./config/keys');
const routes = require('./routes');
const socket = require('./socket');
const setupDB = require('./utils/db');
const analytics = require('./services/analytics');

const { port } = keys;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);
app.use(cors());

setupDB();
require('./config/passport')(app);
app.use(routes);

const server = app.listen(port, () => {
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
});

socket(server);

console.log(
  `${chalk.green('✓')} ${chalk.blue(`Pulseboard analytics ${analytics.describe()}`)}`
);

// Best-effort: give queued analytics events a moment to be delivered before exiting.
['SIGTERM', 'SIGINT'].forEach(signal => {
  process.once(signal, () => {
    analytics.shutdown(3000).then(
      () => process.exit(0),
      () => process.exit(0)
    );
  });
});
