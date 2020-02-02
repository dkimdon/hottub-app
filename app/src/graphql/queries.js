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
    externalController
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
export const getSchedules = `query GetSchedules($startRangeBegin: Int!, $startRangeEnd: Int!) {
  getSchedules(startRangeBegin: $startRangeBegin, startRangeEnd: $startRangeEnd) {
     id
     email
     temperature
     start
     end
  }
}
`;
export const createSchedule = `query CreateSchedule($temperature: Int!, $start: Int!, $end:Int!) {
  createSchedule(temperature: $temperature, start: $start, end: $end) {
     id
     email
     temperature
     start
     end
  }
}
`;
export const updateSchedule = `query UpdateSchedule($id: Int!, $temperature: Int!, $start: Int!, $end:Int!) {
  updateSchedule(id: $id, temperature: $temperature, start: $start, end: $end) {
     id
     email
     temperature
     start
     end
  }
}
`;
export const deleteSchedule = `query DeleteSchedule($id: Int!) {
  deleteSchedule(id: $id) {
     id
  }
}
`;
