const storage = {
  setValueIntoKey: (key, value) => localStorage.setItem(key, value),
  getValueFromKey: (key) => localStorage.getItem(key),
  setObjectIntoKey: (key, obj) =>
    localStorage.setItem(key, JSON.stringify(obj)),
  getObjectFromKey: (key) => JSON.parse(localStorage.getItem(key) || "{}"),
  setAuthToken: (token) => localStorage.setItem("authToken", token),
  getAuthToken: () => localStorage.getItem("authToken"),
  removeItem: (key) => localStorage.removeItem(key),
  removeAuthToken: () => localStorage.removeItem("authToken"),
};

export default storage;
