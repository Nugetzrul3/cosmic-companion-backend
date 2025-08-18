const { gql } = require('apollo-server-express');

module.exports = gql`
    type User {
        id: ID!
        email: String!
        username: String!
        first_name: String!
        last_name: String
    }
    
    type AuthPayload {
        token: String
        user: User
        error: String
    },
    
    type RefreshPayload {
        user: User
        token: String
        error: String
    }
    
    input RegisterBody {
        firstName: String!
        lastName: String!
        username: String!
        email: String!
        password: String!
    }
    
    input LoginBody {
        email: String!
        password: String!
    }
    
    type Query {
        me: User
        error: String
    }
    
    type Mutation {
        signup(data: RegisterBody): AuthPayload!
        login(data: LoginBody): AuthPayload!
        refresh: RefreshPayload!
    }
`;
