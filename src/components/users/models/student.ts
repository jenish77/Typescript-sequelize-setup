import { Column, DataType, Model, Table } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

@Table({ tableName: "students", underscored: false, modelName: 'Student', timestamps: false })
export class Student extends Model<Student> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    id: number;

    @Column(DataType.STRING)
    first_name: string;

    @Column(DataType.STRING)
    last_name: string;

    @Column(DataType.STRING)
    user_name: string;

    @Column(DataType.STRING)
    mobile: string;

    @Column(DataType.TEXT)
    email: string;

    @Column(DataType.TEXT)
    password: string;

    @Column({
        type: DataType.TEXT,
        get() {
            let value: String = this.getDataValue('image');
            if (value) {
                return `http://localhost:3001`+'/image/' +  value;
            }
        }
    })
    image: string;

    @Column(DataType.TEXT)
    token: string;
    
    @Column({
        type: DataType.DATE,
        defaultValue: new Date() // sets default 
    })
    createdAt: Date | any;

    @Column({
        type: DataType.DATE,
        defaultValue: new Date() // sets default 
    })
    updatedAt: Date | any;
  }

  