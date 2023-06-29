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
