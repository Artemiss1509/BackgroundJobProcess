const express = require('express');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());






async function startServer() {
  try {
    app.listen(port, () => {
      logger.info('AsyncFlow API started', { port });
    });
  } catch (error) {
    logger.error('Unable to start AsyncFlow API', { message: error.message, stack: error.stack });
    process.exit(1);
  }
}

startServer();

module.exports = app;
