const { gql } = require('apollo-server-express');

module.exports = gql`
    type User {
        id: ID!
        email: String!
    }
    
    type AuthPayload {
        token: String!
        user: User!
    },
    
    type Query {
        me: User
    }
    
    type Mutation {
        signup(email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
    }
`;
