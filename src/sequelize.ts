import { Sequelize } from 'sequelize-typescript';
import { Student } from '../src/components/users/models/student';
import { Admin } from '../src/components/users/models/Admin';
import { Category } from '../src/components/users/models/category';
import { Text } from '../src/components/users/models/text';
import { Role } from '../src/components/users/models/role';
import { Permission } from '../src/components/users/models/permission';
import { Rolehaspermission } from '../src/components/users/models/roleHasPermission';

const sequelizeInstance = new Sequelize({
  host: "127.0.0.1",
  database: 'test',
  username: "root",
  password: "",
  dialect: "mysql",
  logging: false,
});

sequelizeInstance.addModels([Student,Admin,Category,Text,Role,Permission,Rolehaspermission]);

export default sequelizeInstance;
