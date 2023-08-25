import { Sequelize } from 'sequelize-typescript';
import { Student } from '../src/components/users/models/student';
import { Admin } from '../src/components/users/models/Admin';

const sequelizeInstance = new Sequelize({
  host: "127.0.0.1",
  database: 'test',
  username: "root",
  password: "",
  dialect: "mysql",
  logging: false,
});

sequelizeInstance.addModels([Student]);
sequelizeInstance.addModels([Admin]);

export default sequelizeInstance;
