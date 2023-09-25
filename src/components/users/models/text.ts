import { Column, DataType, Model, Table } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

@Table({ tableName: "texts", underscored: false, modelName: 'Text', timestamps: false })
export class Text extends Model<Text> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    id: number;

    @Column(DataType.BIGINT)
    category_id: number

    @Column(DataType.TEXT)
    text: string;

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

  