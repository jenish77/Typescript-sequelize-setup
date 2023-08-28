// const express = require('express');
import express from 'express'
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const studentRoutes = require('../src/components/users/routes/studentRoute');
import sequelizeInstance from './sequelize'; 
import http from 'http';
import SocketHandler from './components/users/socketHandler';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3001',
}));


app.use(morgan('dev'));
app.use('/image', express.static('uploads/'))

app.use('/api/student', studentRoutes);

import { Server } from "socket.io";
const io = new Server(3004);

process.on('uncaughtException', (error, origin) => {
  console.log('----- Uncaught exception -----')
  console.log(error)
  console.log('----- Exception origin -----')
  console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('----- Unhandled Rejection at -----')
  console.log(promise)
  console.log('----- Reason -----')
  console.log(reason)
})

sequelizeInstance
  .authenticate()
  .then(async () => {
    console.log('Database connection established successfully.');

    await sequelizeInstance.sync();

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      io.on("connection", SocketHandler.chatHandler)
    });
  })
  .catch((error: any) => {
    console.error('Unable to connect to the database:', error);
  });
  
