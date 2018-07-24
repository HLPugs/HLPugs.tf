import logger                     from './logger';

const handleError = function(e: Error, operational = false, data: any) {
  const timestamp = new Date();
  const message = `${e.stack}`;
  data.date = timestamp;
  data.operational = operational;
  logger.log('error', message, data);

  // Crash on programmer error
  if (!operational)
    process.exit(1); // 1 indicates failure
};

export default handleError;
