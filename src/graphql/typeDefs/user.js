const { gql } = require('apollo-server-express');

module.exports = gql`
    type User {
        id: ID!
        email: String!
    }
    
    type AuthPayload {
        token: String
        refreshToken: String
        user: User
        error: String
    },
    
    type RefreshPayload {
        user: User
        token: String
        error: String
    }
    
    type Query {
        me: User
        error: String
    }
    
    type Mutation {
        signup(email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        refreshToken(token: String!): RefreshPayload!
    }
`;
