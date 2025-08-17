const { createApp } = require("../app");
const request = require("supertest");
const utils = require("./utils");

const variables = {
    email: utils.generateRandomEmail(),
    password: utils.generateRandomPassword(),
};

let app;

beforeAll(async () => {
    app = await createApp();
})

describe('Auth Mutations', () => {
    it('should sign up with valid credentials', async () => {
        const query = `
            mutation Signup($email: String!, $password: String!) {
                signup(data: {email: $email, password: $password}) {
                    token
                    refreshToken
                    user {
                        email
                    }
                    error
                }
            }
        `;

        const res = await request(app)
            .post('/graphql')
            .send({ query, variables });

        console.log(JSON.stringify(res.body))

        expect(res.status).toBe(200);
        expect(res.body.data.signup.token).not.toBe(null);
        expect(res.body.data.signup.refreshToken).not.toBe(null);
        expect(res.body.data.signup.user).not.toBe(null);
        expect(res.body.data.signup.user.email).toBe(variables.email);
        expect(res.body.data.signup.error).toBe(null);

    });

    it('should fail with an error message indicating duplicate credentials',
        async () => {
            const query = `
            mutation Signup($email: String!, $password: String!) {
                signup(data: {email: $email, password: $password}) {
                    token
                    refreshToken
                    user {
                        email
                    }
                    error
                }
            }
        `;

            const res = await request(app)
                .post('/graphql')
                .send({ query, variables });

            console.log(JSON.stringify(res.body))

            expect(res.status).toBe(200);
            expect(res.body.data.signup.token).toBe(null);
            expect(res.body.data.signup.refreshToken).toBe(null);
            expect(res.body.data.signup.user).toBe(null);
            expect(res.body.data.signup.error).toBe('User already exists');

    });

    it('should login with valid credentials', async () => {
        const query = `
            mutation Login($email: String!, $password: String!) {
                login(data: {email: $email, password: $password}) {
                    token
                    refreshToken
                    user {
                        email
                    }
                    error
                }
            }
        `;

        const res = await request(app)
            .post('/graphql')
            .send({ query, variables });

        console.log(JSON.stringify(res.body))

        expect(res.status).toBe(200);
        expect(res.body.data.login.token).not.toBe(null);
        expect(res.body.data.login.refreshToken).not.toBe(null);
        expect(res.body.data.login.user).not.toBe(null);
        expect(res.body.data.login.error).toBe(null);
        expect(res.body.data.login.user.email).toBe(variables.email);
    });

    it('should fail with an error message indicating the user does not exist', async () => {
        const query = `
            mutation Login($email: String!, $password: String!) {
                login(data: {email: $email, password: $password}) {
                    token
                    refreshToken
                    user {
                        email
                    }
                    error
                }
            }
        `;

        const variables = {
            email: 'this.user@doesnotexist.com',
            password: 'IDontExist!!!'
        };

        const res = await request(app)
            .post('/graphql')
            .send({ query, variables });

        console.log(JSON.stringify(res.body))

        expect(res.status).toBe(200);
        expect(res.body.data.login.token).toBe(null);
        expect(res.body.data.login.refreshToken).toBe(null);
        expect(res.body.data.login.user).toBe(null);
        expect(res.body.data.login.error).toBe("User does not exist");
    });

    it('should fail with an error message indicating the credentials are invalid', async () => {
        const query = `
            mutation Login($email: String!, $password: String!) {
                login(data: {email: $email, password: $password}) {
                    token
                    refreshToken
                    user {
                        email
                    }
                    error
                }
            }
        `;

        variables.password = "InvalidPassword123";

        const res = await request(app)
            .post('/graphql')
            .send({ query, variables });

        console.log(JSON.stringify(res.body))

        expect(res.status).toBe(200);
        expect(res.body.data.login.token).toBe(null);
        expect(res.body.data.login.refreshToken).toBe(null);
        expect(res.body.data.login.user).toBe(null);
        expect(res.body.data.login.error).toBe("Invalid credentials");
    });
})
