import { gql } from 'graphql-tag';

export default gql`
    type UserPayload {
        id: ID
        email: String
        username: String
        first_name: String
        last_name: String
        error: String
    }
    
    type AuthPayload {
        token: String
        refreshToken: String
        user: UserPayload
        error: String
    },
    
    type RefreshPayload {
        user: UserPayload
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
        me: UserPayload
        refresh: RefreshPayload
    }
    
    type Mutation {
        signup(data: RegisterBody): AuthPayload!
        login(data: LoginBody): AuthPayload!
    }
`;
