const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const notifications = [];
const typeDefs = `
  type Query { notifications: [Notification] }
  type Notification { label: String }
  type Mutation { pushNotification(label: String!): Notification }
`;
const resolvers = {
  Query: { notifications: () => notifications },
  Mutation: {
      pushNotification: (root, args) => {
        const newNotification = { label: args.label };
        notifications.push(newNotification);

        return newNotification;
      },
  },
};
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});
