import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import '../styles/app.css';
// import '../components/SnackBar/SnackBar.css'
import '../styles/snackbar.css';
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

</link>
export default function App({ Component, pageProps }) {
    return (
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }