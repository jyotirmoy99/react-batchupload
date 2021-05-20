import { ApolloClient,createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: "http://3.7.47.235:8443/graphql?"
  });
  
const authLink = setContext((_, { headers }) => {
return {
    headers: {
    ...headers,
    //authorization: `Bearer FT6gFTshPKvocjSC3jRd6Qi7NQA5uMBZvES4X2jjBwSyNUFELZPrs0h0lN1MfpH9`,
    }
}
});
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

export default client;