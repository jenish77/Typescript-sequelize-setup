import { Column, DataType, Model, Table } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

@Table({ tableName: "categorys", underscored: false, modelName: 'Category', timestamps: false })
export class Category extends Model<Category> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    id: number;

    @Column(DataType.STRING)
    category_name: string;

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

  