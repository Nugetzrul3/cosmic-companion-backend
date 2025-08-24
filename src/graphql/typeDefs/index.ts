import { gql } from 'graphql-tag';
import userTypeDefs from './user';


export default gql`
    ${userTypeDefs}
`;
