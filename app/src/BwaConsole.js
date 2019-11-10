import React from "react";

import * as queries from "./graphql/queries";
import { API, graphqlOperation } from "aws-amplify";

import { withRouter } from "react-router-dom";

/*

 radio buttons

Choose one of:

off
100
101
102
103
104
105
106

Display last temperature and how long ago that emperature was read.


*/

class BwaConsole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastReportedTemperature: null,
      lastReportTimestamp: null,
      targetTemperature: null
    };
    //this.setTubState = this.setTubState.bind(this);
  }
  async componentDidMount() {
    this.setState({
    });

    var res = await API.graphql(graphqlOperation(queries.getTubState, {}));
    console.log(JSON.stringify(res.data));
    if (res.data.getTubState.targetTemperature) {
      this.setState({
        lastReportedTemperature: res.data.getTubState.lastReportedTemperature,
        lastReportTimestamp:  res.data.getTubState.lastReportTimestamp,
        targetTemperature:  res.data.getTubState.targetTemperature
      });
    } else {
      this.setState({
        targetTemperature: 'off'
      });
    }
  }

  render() {
    return (
      <div>
        <pre>
          {JSON.stringify(this.state, null, 4)}
        </pre>
        <ul>
          <li>The last reported water temperature is {this.state.lastReportedTemperature}F.</li>
          <li>The report is {Math.floor(Date.now() / 1000) - this.state.lastReportTimestamp} seconds old.</li>
          <li>The current desired temperature for the tub is {this.state.targetTemperature}F.</li>
        </ul>
      </div>
    );
  }
}

export default withRouter(BwaConsole);
