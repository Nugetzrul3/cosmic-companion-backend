import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
let sequelize: Sequelize;

if (process.env.NODE_ENV === 'test') {
    sequelize = new Sequelize(
        {
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false
        }
    );
} else {
    if (!process.env.DATABASE_URL) {
        throw new Error("Missing DATABASE_URL");
    }

    sequelize = new Sequelize(
        process.env.DATABASE_URL,
        {
            dialect: 'postgres',
            logging: false,
        }
    );
}

export default sequelize;
