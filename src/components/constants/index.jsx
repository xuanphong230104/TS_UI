export const PATH = {
  home: "/",
  login: "/login",
  testDesign: "/test-design",
  users: "/users",
  testScript: "/test-script",
  project: "/project",
  testRun: "/test-run",
  testWorkflow: "/test-workflow",
  runnerHost: "/runner-host",
  resetPassword: "/reset-password",
  confirmNewPassword: "/confirm-new-password",
};

export const API_ENDPOINTS = {
  LOGIN: "/auth/token/login/",
  LOGOUT: "/auth/token/logout/",
  USERS: "/auth/users/",
  USER_ME: "/auth/users/me/",
  RESET_PASSWORD: "/auth/users/reset_password/",
  RESET_PASSWORD_CONFIRM: "/auth/users/reset_password_confirm/",
  TEST_SCRIPT: "/hub/api/v1/testscript",
  PROJECT: "/hub/api/v1/project/",
  TEST_RUN: "/hub/api/v1/testrun/",
  RUNNER_HOST: "/hub/api/v1/runner-host/",
  API_VERSION: "/hub/api/v1/api_version",
};

export const ActionTypes = {
  update: "update",
  create: "create",
  view: "view",
};

export const DATE_FORMATS = {
  YYYY_MM_DD: "YYYY/MM/DD",
  YYYY_MM_DD_HH_MM_SS: "YYYY/MM/DD hh:mm:ss",
};

export const TEST_RUN_STATUS = {
  NEW: "NEW",
  RUNNING: "RUNNING",
  INIT: "INIT",
  PASSED: "PASSED",
  FAILED: "FAILED",
};

export const RUNNER_HOST_STATUS = {
  DOWN: "DOWN",
  UP: "UP",
};

export const STR_NA = "N/A";
