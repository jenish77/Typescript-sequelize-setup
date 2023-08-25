import { Column, DataType, Model, Table } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

@Table({ tableName: "admins", underscored: false, modelName: 'Admin', timestamps: false })
export class Admin extends Model<Admin> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    id: number;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.TEXT)
    email: string;

    @Column(DataType.TEXT)
    password: string;

    @Column(DataType.TEXT)
    assign_role: string;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 1, // sets default value for the column
        comment: "0 - disable, 1 - enable" // adds a comment to the column
    })
    status: number
    
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

  