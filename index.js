const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const mongoose = require("mongoose");

const User = require("./Models/User");
const { MONGODB } = require("./config.js");



const typeDefs = gql`

    type Data {
        name: String!
        username: String!
        email: String!
        password: String!
    }
  type Query {
      getData: [Data]
  }
`;

const resolvers = {
    Query: {
        async getData() {
            try {
                const data = await User.find();
                return data;
            } catch (err) {
                throw new Error(err);
            }
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

// Conecting with MongoDB Database
mongoose
    .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected");
        return server.listen({ port: 5000 });
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`)
    });