import React from "react";

import * as queries from "./graphql/queries";
import { API, graphqlOperation } from "aws-amplify";

import { withRouter } from "react-router-dom";
import { RadioGroup, Radio } from "react-radio-group";

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
        lastSeenTimestamp: res.data.getTubState.lastSeenTimestamp,
        targetTemperature: res.data.getTubState.targetTemperature.toString(),
        stateDescription:
          "The tub is set to heat to or maintain a temperature of " +
          res.data.getTubState.targetTemperature.toString() +
          " °F"
      });
    } else {
      this.setState({
        lastReportedTemperature: res.data.getTubState.lastReportedTemperature,
        lastReportTimestamp: res.data.getTubState.lastReportTimestamp,
        lastSeenTimestamp: res.data.getTubState.lastSeenTimestamp,
        targetTemperature: "off",
        stateDescription: "The tub is at rest."
      });
    }
  }
  async setTubState(targetTemperature) {
    var res;
    if (targetTemperature === "off") {
      res = await API.graphql(
        graphqlOperation(queries.setTubState, {
          targetTemperature: null
        })
      );
    } else {
      res = await API.graphql(
        graphqlOperation(queries.setTubState, {
          targetTemperature: parseInt(targetTemperature)
        })
      );
    }

    if (res.data.setTubState.targetTemperature) {
      this.setState({
        targetTemperature: res.data.setTubState.targetTemperature.toString()
      });
    } else {
      this.setState({
        targetTemperature: "off"
      });
    }
  }
  async componentDidMount() {
    this.setState({});

    this.getTubState();
  }

  seconds_format(secs) {
    var hours = Math.floor(secs / 60 / 60);
    var minutes = Math.floor(secs / 60);
    if (hours !== 0) {
      if (hours === 1) {
        return hours + ' hour';
      } else {
        return hours + ' hours';
      }
    }
    if (minutes !== 0) {
      if (minutes === 1) {
        return minutes + ' minute';
      } else {
        return minutes + ' minutes';
      }
    }
    if (secs === 1) {
      return secs + ' second';
    } else {
      return secs + ' seconds';
    }
  }

  render() {

    if (!this.state.stateDescription) {
        return (<div></div>);
    }
    return (
      <div>
        <ul>
          <li>
            { this.seconds_format((Math.floor(Date.now() / 1000) - this.state.lastReportTimestamp)) +
              " ago the water temperature was " +
              this.state.lastReportedTemperature +" °F."}
          </li>
          <li>
            {"The last communication with the tub occurred " +
              this.seconds_format((Math.floor(Date.now() / 1000) - this.state.lastSeenTimestamp) ) + " ago."}
          </li>
          <li> {this.state.stateDescription} </li>
        </ul>
        Control tub desired state below:
        <RadioGroup
          name="desiredTemperature"
          selectedValue={this.state.targetTemperature}
          onChange={this.setTubState}
        >
          <ul>
            <li>
              <Radio value="106" /> 106
            </li>
            <li>
              <Radio value="105" /> 105
            </li>
            <li>
              <Radio value="104" /> 104
            </li>
            <li>
              <Radio value="103" /> 103
            </li>
            <li>
              <Radio value="102" /> 102
            </li>
            <li>
              <Radio value="off" /> rest
            </li>
          </ul>
        </RadioGroup>
      </div>
    );
  }
}

export default withRouter(BwaConsole);
