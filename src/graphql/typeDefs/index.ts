import { gql } from 'apollo-server-express';
import userTypeDefs from './user';


export default gql`
    ${userTypeDefs}
`;
