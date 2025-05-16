import fs from "fs";
import winston from "winston";

const fsPromise = fs.promises;
// promises are object which allow us to create and write
// data into files asynchronously, without using callbacks.

///Logging and storing data in log.txt using NodeJS traditional fs module approach
async function log(logData) {
  try {
    // fs.writeFile() ; Overrite contents & replace older with new
    // fs.appendFile() ; don't overrite contents
    fsPromise.appendFile("log.txt", logData);
  } catch (err) {
    console.log(err);
  }
}

///Logging and storing data in logs.txt using NodeJS winston Library
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

const loggerMiddleware = async (req, res, next) => {
  //   console.log(req.body);
  if (!req.url.includes("signin")) {
    const logData = `\n ${new Date().toString()} - ${
      req.url
    } - ${JSON.stringify(req.body)}`;
    // await log(logData);
    logger.info(logData);
  }
  next();
};

export default loggerMiddleware;
