import { getConnectionOptions, createConnection } from 'typeorm';

export const createTypeormConn = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  await createConnection(connectionOptions);
};
