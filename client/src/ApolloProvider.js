import React from 'react';
import App from './App';
import { ApolloClient, ApolloLink } from 'apollo-boost'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
//import { setContext } from 'apollo-link-context';

const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
})


//end poin of sever
const httpLink = createHttpLink({
    uri: 'http://localhost:5000'
});

//storing cached data
const client = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache()
});

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);