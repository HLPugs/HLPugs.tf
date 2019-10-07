import * as fs from 'fs';
import * as config from 'config';
import * as path from 'path';

const logDirectory: string = config.get('winston.logDirectory');
if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory);
}
