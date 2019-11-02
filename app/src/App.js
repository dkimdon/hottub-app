import React, { Component } from "react";
import "./App.css";
import {
  withAuthenticator,
  Greetings,
  SignIn,
  ConfirmSignIn,
  RequireNewPassword,
  VerifyContact,
  ForgotPassword,
  TOTPSetup
} from "aws-amplify-react";
import BwaConsole from "./BwaConsole";
import {BrowserRouter as Router } from "react-router-dom";

import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    region: process.env.AWS_REGION,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
  },

  aws_appsync_graphqlEndpoint: process.env.REACT_APP_AWS_APPSYNC_GRAPHQL_ENDPOINT,
  aws_appsync_region: process.env.AWS_REGION,
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <BwaConsole />
        </Router>
      </div>
    );
  }
}

export default withAuthenticator(App, {
  includeGreetings: true,
  authenticatorComponents: [
    <Greetings />,
    <SignIn />,
    <ConfirmSignIn />,
    <RequireNewPassword />,
    <VerifyContact />,
    <ForgotPassword />,
    <TOTPSetup />
  ]
});
