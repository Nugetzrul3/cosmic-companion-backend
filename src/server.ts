import createApp from './app';
import sequelize from './db';

const startServer = async () => {
    const app = await createApp();

    await sequelize.sync({ alter: true });

    app.listen(3000, 'localhost', () => {
        console.log("Server started on port 3000");
    })

}

startServer();