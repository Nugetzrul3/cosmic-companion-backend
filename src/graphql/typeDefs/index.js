const { gql } = require('apollo-server-express');
const userTypeDefs = require('./user');

module.exports = gql`
    ${userTypeDefs}
`;
