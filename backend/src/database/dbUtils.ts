/* eslint-disable no-console */

import * as dotenv from 'dotenv';
import mongoose = require('mongoose');

dotenv.config();

const dbConnect = (
  databaseName = process.env.DATABASE_NAME,
  address = process.env.DATABASE_ADDRESS,
  port = process.env.DATABASE_PORT
) => {
  const url = `mongodb://${address}:${port}/${databaseName}`;
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
