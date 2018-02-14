const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { PubSub } = require('graphql-subscriptions');
const cors = require('cors');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const pubsub = new PubSub();
const NOTIFICATION_SUBSCRIPTION_TOPIC = 'newNotifications';

const notifications = [];
const typeDefs = `
  type Query { notifications: [Notification] }
  type Notification { label: String }
  type Mutation { pushNotification(label: String!): Notification }
  type Subscription { newNotification: Notification }
`;
const resolvers = {
  Query: { notifications: () => notifications },
  Mutation: {
      pushNotification: (root, args) => {
        const newNotification = { label: args.label };
        notifications.push(newNotification);
        pubsub.publish(NOTIFICATION_SUBSCRIPTION_TOPIC, { newNotification: newNotification });

        return newNotification;
      },
  },
  Subscription: {
    newNotification: {
      subscribe: () => pubsub.asyncIterator(NOTIFICATION_SUBSCRIPTION_TOPIC)
    }
  },
};
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
app.use('*', cors({ origin: `http://localhost:3000` }));
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
}));
const ws = createServer(app);
ws.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');

  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});
