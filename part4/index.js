// const http = require("http");
const app = require("./app");
const logger = require("./utils/logger");
const config = require("./utils/config");

// const server = http.createServer(app);
app.listen(config.PORT, () => {
  logger.info(`Server running  http://localhost:${config.PORT}`);
});
