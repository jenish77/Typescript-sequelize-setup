import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: "roles", underscored: false, modelName: 'Role', timestamps: false })
export class Role extends Model<Role> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    id: number;

    @Column(DataType.STRING)
    name: string;

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

  