import {UserAttributes} from "../interfaces/models";
import { Model, DataTypes } from "sequelize";
import sequelize from "../db";

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public first_name!: string;
    public last_name!: string;
    public password!: string;
    public username!: string;
}

User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: { isEmail: true },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            }
    },
    {
        sequelize,
        timestamps: false,
        tableName: "users"
    }
)
