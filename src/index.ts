const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const studentRoutes = require('../src/components/users/routes/studentRoute');
import sequelizeInstance from './sequelize'; 
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/api/student', studentRoutes);

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
    });
  })
  .catch((error: any) => {
    console.error('Unable to connect to the database:', error);
  });
  
