export const ping = `query Ping($id: String) {
  ping(id: $id) {
    id 
  }
}
`;
export const getTubState = `query GetTubState {
  getTubState {
    lastReportedTemperature
    lastReportTimestamp
    lastSeenTimestamp
    targetTemperature
  }
}
`;
export const setTubState = `query SetTubState($targetTemperature: Float) {
  setTubState(targetTemperature: $targetTemperature) {
    lastReportedTemperature
    lastReportTimestamp
    lastSeenTimestamp
    targetTemperature
  }
}
`;


