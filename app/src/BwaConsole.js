import React from "react";

import * as queries from "./graphql/queries";
import { API, graphqlOperation } from "aws-amplify";

import { withRouter } from "react-router-dom";
import {RadioGroup, Radio} from 'react-radio-group';

class BwaConsole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastReportedTemperature: null,
      lastReportTimestamp: null,
      targetTemperature: null
    };
    this.setTubState = this.setTubState.bind(this);
    this.getTubState = this.getTubState.bind(this);
  }
  async getTubState() {
    var res = await API.graphql(graphqlOperation(queries.getTubState, {}));
    if (res.data.getTubState.targetTemperature) {
      this.setState({
        lastReportedTemperature: res.data.getTubState.lastReportedTemperature,
        lastReportTimestamp: res.data.getTubState.lastReportTimestamp,
        targetTemperature: res.data.getTubState.targetTemperature.toString()
      });
    } else {
      this.setState({
        targetTemperature: 'off'
      });
    }
  }
  async setTubState(targetTemperature) {
    var res;
    if (targetTemperature === 'off') {
    	res = await API.graphql(graphqlOperation(queries.setTubState, {targetTemperature: null}));
    } else {
    	res = await API.graphql(graphqlOperation(queries.setTubState, {targetTemperature: parseInt(targetTemperature)}));
    }
    
    if (res.data.setTubState.targetTemperature) {
      this.setState({
        targetTemperature:  res.data.setTubState.targetTemperature.toString()
      });
    } else {
      this.setState({
        targetTemperature: 'off'
      });
    }
  }
  async componentDidMount() {
    this.setState({
    });

    this.getTubState();
  }

  render() {
    return (
      <div>
        <ul>
          <li>The last reported water temperature is {this.state.lastReportedTemperature}F.</li>
          <li>The report is {Math.floor(Date.now() / 1000) - this.state.lastReportTimestamp} seconds old.</li>
          <li>The current desired temperature for the tub is {this.state.targetTemperature}F.</li>
        </ul>
        Control tub desired state below:
        <RadioGroup name="desiredTemperature" selectedValue={this.state.targetTemperature} onChange={this.setTubState}>
          <ul>
        
          <li><Radio value="off" />off</li>
          <li><Radio value="106" />106</li>
          <li><Radio value="105" />105</li>
          <li><Radio value="104" />104</li>
          <li><Radio value="103" />103</li>
          <li><Radio value="102" />102</li>
          <li><Radio value="101" />101</li>
          <li><Radio value="100" />100</li>
          </ul>
        </RadioGroup>
      </div>
    );
  }
}

export default withRouter(BwaConsole);
