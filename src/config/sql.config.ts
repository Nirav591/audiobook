import { createConnection, Connection } from 'mysql2/promise';

export const connectToDatabase = async (): Promise<Connection> => {
  const connection = await createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "audiobook",
  });

  return connection;
};