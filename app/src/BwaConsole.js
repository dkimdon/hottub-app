import React from "react";

import * as queries from "./graphql/queries";
import { API, graphqlOperation } from "aws-amplify";

import { withRouter } from "react-router-dom";

class BwaConsole extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Hello
      </div>
    );
  }
}

export default withRouter(BwaConsole);
