const { gql } = require("apollo-server");

module.exports = gql`

    type Data {
        name: String!
        username: String!
        email: String!
        password: String!
    }
    
    type User {
      name: String!
        username: String!
        email: String!
        token: String!
        password: String!
    }

    input RegisterInput {
        name: String!
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
  }
    type Query {
      getData: [Data]
  }
    type Mutation {
      register(registerInput: RegisterInput): User!
      login(username: String, password: String!): User!
  }
`;