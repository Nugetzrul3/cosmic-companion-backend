const { startServer } = require("../index");
const request = require("supertest");

let app;

beforeAll(async () => {
    app = await startServer();
});

describe('Auth Mutations', () => {
    it('should login with valid credentials', async () => {
        const query = `
            mutation Login($email: String!, $password: String!) {
                login(data: {email: $email, password: $password}) {
                    token
                    user {
                        email
                    }
                }
            }
        `;

        const variables = {
            email: "test@example.com",
            password: "Test123$",
        };

        const res = await request(app)
            .post('/graphql')
            .send({ query, variables });

        expect(res.status).toBe(200);
        expect(res.body.data.login.token).toBeDefined();
        expect(res.body.data.login.user.email).toBe("test@example.com");
    });
})
