export const mutateTubState = `mutation MutateTubState($targetTemperature: Float) {
  mutateTubState(targetTemperature: $targetTemperature) {
    lastReportedTemperature
    lastReportTimestamp
    lastSeenTimestamp
    targetTemperature
  }
}
`;
