import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: "role_has_permissions", underscored: false, modelName: 'Rolehaspermission', timestamps: false })
export class Rolehaspermission extends Model<Rolehaspermission> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
    id: number;

    @Column(DataType.BIGINT)
    permission_id: number

    @Column(DataType.BIGINT)
    role_id: number
    
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

  