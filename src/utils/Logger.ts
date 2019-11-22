import winston, { createLogger, LoggerOptions, transports } from "winston";

const defaultLevel = process.env.LOG_LEVEL;

const options: LoggerOptions = {
    exitOnError: false,
    level: defaultLevel,
    transports: [
        new transports.File({
            filename: 'combined.log',
            level: "info", // info and below to rotate
        }),
        new transports.File({
            filename: 'errors.log',
            level: "error",
        }),
    ],
};

const logger = createLogger(options);

if (process.env.NODE_ENV === "dev") {
    logger.add(new transports.Console({
        level: 'debug',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
}

export default logger;