import logger                     from './logger';

const handleError = function(e: Error, data?: object) {
  if (data) {
	logger.error(e.stack, data);
  } else {
	logger.error(e.stack);
  }
};

export default handleError;
