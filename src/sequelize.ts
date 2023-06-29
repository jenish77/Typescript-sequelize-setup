import { Sequelize } from 'sequelize-typescript';
import { Student } from '../src/components/users/models/student';

const sequelizeInstance = new Sequelize({
  host: "127.0.0.1",
  database: 'test',
  username: "root",
  password: "",
  dialect: "mysql",
  logging: false,
});

sequelizeInstance.addModels([Student]);

export default sequelizeInstance;
