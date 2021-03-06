import React from "react";

import * as queries from "./graphql/queries";
import { API, graphqlOperation } from "aws-amplify";

import { withRouter } from "react-router-dom";
import { RadioGroup, Radio } from "react-radio-group";
import  Thermometer from "react-ui-thermometer";

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
    var schedules = await API.graphql(
        graphqlOperation(queries.getSchedules, {
          startRangeBegin: 0,
          startRangeEnd: 1600000000
        })
    );
    var user;
    if (res.data.getTubState.externalController) {
        user = "the old app or the buttons on the front of the tub itself";
    } else {
        user = JSON.stringify(schedules.data.getSchedules[0].email)
    }
    if (res.data.getTubState.targetTemperature) {
      this.setState({
        lastReportedTemperature: res.data.getTubState.lastReportedTemperature,
        lastReportTimestamp: res.data.getTubState.lastReportTimestamp,
        lastSeenTimestamp: res.data.getTubState.lastSeenTimestamp,
        targetTemperature: res.data.getTubState.targetTemperature.toString(),
        stateDescription:
          "The tub is set to heat to or maintain a temperature of " +
          res.data.getTubState.targetTemperature.toString() +
          " °F",
        user
      });
    } else {
      this.setState({
        lastReportedTemperature: res.data.getTubState.lastReportedTemperature,
        lastReportTimestamp: res.data.getTubState.lastReportTimestamp,
        lastSeenTimestamp: res.data.getTubState.lastSeenTimestamp,
        targetTemperature: "off",
        stateDescription: "The tub is at rest.",
        user
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
      await API.graphql(
        graphqlOperation(queries.updateSchedule, {
          id: 1,
          temperature: 0,
          start: 0,
          end: 0
        })
      );
    } else {
      res = await API.graphql(
        graphqlOperation(queries.setTubState, {
          targetTemperature: parseInt(targetTemperature)
        })
      );
      await API.graphql(
        graphqlOperation(queries.updateSchedule, {
          id: 1,
          temperature: parseInt(targetTemperature),
          start: Math.round(new Date().getTime() / 1000),
          end: Math.round(new Date().getTime() / 1000)
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
    var statusLines = [];
    statusLines.push(
        <li key="tempLastMeasured">
        {
        "The water temperature was last measured " +
        this.seconds_format((Math.floor(Date.now() / 1000) - this.state.lastReportTimestamp)) +
        " ago."
        }
        </li>
    );
    statusLines.push(
        <li key="stateDesc">
        {
        this.state.stateDescription
        }
        </li>
    );
    statusLines.push(
        <li key="lastChangedBy">
        {
        "The last change to the tub settings was made by " +
        this.state.user +
        "."
        }
        </li>
    );

    if (Math.floor(Date.now() / 1000) - this.state.lastSeenTimestamp > 60 * 30) {
        statusLines.push(
            <li>
            <font color="red">
            {
            "Warning: The last communication with the tub occurred " +
            this.seconds_format((Math.floor(Date.now() / 1000) - this.state.lastSeenTimestamp) ) +
            " ago."}
            </font>
            </li>
        );
    }
    return (
      <div>
        <table>
        <tbody>
        <tr>
        <td>
        <ul>
          {statusLines}
        </ul>
        </td>
        <td>
        <Thermometer theme={'light'} value={this.state.lastReportedTemperature} format={{label:'°F', insertAfter: true}} steps={5} min={60} max={110} size={'large'} height={180} />
        </td>
        </tr>
        </tbody>
        </table>
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
