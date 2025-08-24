import request, { Response } from "supertest";
import { Application } from "express";
import createApp from "../app";

let app: Application;

beforeAll(async () => {
    app = await createApp();
});

describe('Auth Mutations', () => {
    const signupVariables = {
        firstName: "Graph",
        lastName: "QL",
        username: "graphql",
        email: "graphql@test.com",
        password: "GraphQL123",
    };

    const loginVariables = {
        email: signupVariables.email,
        password: signupVariables.password,
    };

    it('should sign up with valid credentials', async () => {
        const query = `
      mutation Signup(
        $firstName: String!, $lastName: String!, $username: String!, 
        $email: String!, $password: String!
      ) {
        signup(
          data: {
            firstName: $firstName,
            lastName: $lastName,
            username: $username,
            email: $email, 
            password: $password
          }
        ) {
          token
          refreshToken
          user {
            email
          }
          error
        }
      }
    `;

        const res: Response = await request(app)
            .post('/graphql')
            .send({ query, variables: signupVariables });

        expect(res.status).toBe(200);
        expect(res.body.data.signup.token).not.toBe(null);
        expect(res.body.data.signup.refreshToken).not.toBe(null);
        expect(res.body.data.signup.user).not.toBe(null);
        expect(res.body.data.signup.user.email).toBe(signupVariables.email);
        expect(res.body.data.signup.error).toBe(null);
    });

    it('should fail with an error message indicating duplicate credentials', async () => {
        const query = `
      mutation Signup(
        $firstName: String!, $lastName: String!, $username: String!, 
        $email: String!, $password: String!
      ) {
        signup(
          data: {
            firstName: $firstName,
            lastName: $lastName,
            username: $username,
            email: $email, 
            password: $password
          }
        ) {
          token
          refreshToken
          user {
            email
          }
          error
        }
      }
    `;

        const res: Response = await request(app)
            .post('/graphql')
            .send({ query, variables: signupVariables });

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

        const res: Response = await request(app)
            .post('/graphql')
            .send({ query, variables: loginVariables });

        expect(res.status).toBe(200);
        expect(res.body.data.login.token).not.toBe(null);
        expect(res.body.data.login.refreshToken).not.toBe(null);
        expect(res.body.data.login.user).not.toBe(null);
        expect(res.body.data.login.error).toBe(null);
        expect(res.body.data.login.user.email).toBe(loginVariables.email);
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

        const res: Response = await request(app)
            .post('/graphql')
            .send({ query, variables });

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

        const invalidLoginVariables = { ...loginVariables, password: "InvalidPassword123" };

        const res: Response = await request(app)
            .post('/graphql')
            .send({ query, variables: invalidLoginVariables });

        expect(res.status).toBe(200);
        expect(res.body.data.login.token).toBe(null);
        expect(res.body.data.login.refreshToken).toBe(null);
        expect(res.body.data.login.user).toBe(null);
        expect(res.body.data.login.error).toBe("Invalid credentials");
    });
});
