import * as winston from 'winston';
import * as path from 'path';
import * as config from 'config';
import * as moment from 'moment';

const logDirectory: string = config.get('winston.logDirectory');

const format = winston.format.combine(
	winston.format.printf(info => {
		const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
		return `${timestamp} - ${info.level.toUpperCase()}: ${info.message}`;
	})
);

const logger = winston.createLogger({
	format,
	levels: {
		debug: 3,
		info: 2,
		warning: 1,
		error: 0
	},
	transports: [
		new winston.transports.File({
			level: 'debug',
			filename: path.join(logDirectory, 'debug.log')
		}),
		new winston.transports.File({
			filename: path.join(logDirectory, 'events.log')
		})
	]
});

if (process.env.NODE_ENV === 'dev') {
	logger.add(
		new winston.transports.File({
			level: 'debug',
			filename: path.join(logDirectory, 'debug.log')
		})
	);
}

export default class Logger {
	static logInfo(eventName: string, eventData?: any) {
		if (eventData) {
			logger.log('info', `${eventName}: ${JSON.stringify(eventData)}`);
		} else {
			logger.log('info', eventName);
		}
	}

	static logDebug(eventName: string, eventData?: any) {
		if (eventData) {
			logger.log('debug', `${eventName}: ${JSON.stringify(eventData)}`);
		} else {
			logger.log('debug', eventName);
		}
	}

	static logError(error: any) {
		logger.log('error', error);
	}

	static logWarning(warningMessage: string, data?: any) {
		if (data) {
			logger.log('warning', `${warningMessage}: ${JSON.stringify(data)}`);
		} else {
			logger.log('warning', warningMessage);
		}
	}
}
