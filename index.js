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
                const userData = await User.find();
                return userData;
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
mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB Connected");
        return server.listen({ port: 5000 });
    })
    .then((res) => {
        console.log(`Server running ar ${res.url}`)
    });