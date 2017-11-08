require('dotenv').config({ path: '.env' });

const app = require('./app');
const databaseConnection = require('./db');
const log = require('./utils/logger');

(async () => {
  try {
    await databaseConnection;

    const server = app.listen(process.env.PORT || 3000, () => {
      log.info(`Application running on port: ${server.address().port}`);
    });

    process.on('SIGINT', () => {
      databaseConnection.close();
      serverConnection.close();
      log.info('Server was shut down.');
    });
  } catch (error) {
    log.error(`Server error:\n${error}`);
  }
})();
