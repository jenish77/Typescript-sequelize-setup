import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: "permissions", underscored: false, modelName: 'Permission', timestamps: false })
export class Permission extends Model<Permission> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    id: number;

    @Column(DataType.STRING)
    name: string;
    
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

  