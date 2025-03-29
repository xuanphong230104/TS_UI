export const PATH = {
  home: "",
  login: "/login",
  report: "/report",
  checkins: "check-ins",
  report: "report",
  createTask: "create",
  teamselect: "/team-select",
  users: "/users",
  reports: "/report",
  team: "/teams/:teamId",
};

export const API_ENDPOINTS = {
  LOGIN: "/auth/token/login/",
  LOGOUT: "/auth/token/logout/",
  USER: "/auth/users/",
  USER_ME: "/auth/users/me/",
  TASK: "/core/api/v1/task",
  TEAM: "/core/api/v1/team",
  COMMENT: "/core/api/v1/comment",
  CHECKIN: "/core/api/v1/check-in",
  REPORT: "/core/api/v1/report",
  FIND_REPORT_BY_ID: "/core/api/v1/report/find",
  FIND_CHECKIN_BY_ID: "/core/api/v1/check-in/find",
  REPORT_BY_ID: "/core/api/v1/report/{id}",
  CHECKIN_BY_ID: "/core/api/v1/check-in/{id}",
};
