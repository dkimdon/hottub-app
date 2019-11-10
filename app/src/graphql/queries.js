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
    targetTemperature
  }
}
`;

