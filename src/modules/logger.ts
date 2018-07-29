import * as winston from 'winston';
import * as path    from 'path';
import * as fs      from 'fs';
import * as config  from 'config';

// Use /logs to store the .log files
const logDir = path.join(config.get('winston.logDirectory'), '/');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir); // Create log directory
}

const format = winston.format.combine(
	winston.format.colorize({ all: true }),
	winston.format.simple(),
	winston.format.timestamp({
	  format: 'YYYY-MM-DD HH:mm:ss',
}),
);

// TODO Setup proper file structures (/info/draft.log etc.)
const logger = winston.createLogger({
  format,
  level: 'info',
  transports: [
	//
	// - Write to all logs with level `info` and below to `combined.log`
	// - Write all logs error (and below) to `error.log`.
	//
    new winston.transports.File({ filename: path.join(logDir, 'error.log') }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format,
  }));
}

export default logger;
