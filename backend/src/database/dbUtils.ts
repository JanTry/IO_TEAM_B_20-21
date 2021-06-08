/* eslint-disable no-console */

import * as dotenv from 'dotenv';
import mongoose = require('mongoose');

dotenv.config();

const dbUrl = (
  databaseName,
  address,
  port,
  user,
  password
) => {
  if(user){
    return `mongodb+srv://${user}:${password}@${address}/${databaseName}`;
  }
  return `mongodb://${address}:${port}/${databaseName}`;
}

const dbConnect = (
  databaseName = process.env.DATABASE_NAME,
  address = process.env.DATABASE_ADDRESS,
  port = process.env.DATABASE_PORT,
  user = process.env.DATABASE_USER,
  password = process.env.DATABASE_PASSWORD
) => {
  const url = dbUrl(databaseName, address, port, user, password);
  mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on('error', console.error.bind(console, 'DATABASE CONNECTION ERROR')).once('open', () => {
    console.log('DATABASE CONNECTED');
  });
};

export default dbConnect;
