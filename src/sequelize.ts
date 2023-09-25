import { Sequelize } from 'sequelize-typescript';
import { Student } from '../src/components/users/models/student';
import { Admin } from '../src/components/users/models/Admin';
import { Category } from '../src/components/users/models/category';
import { Text } from '../src/components/users/models/text';

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
sequelizeInstance.addModels([Category]);
sequelizeInstance.addModels([Text]);

export default sequelizeInstance;
