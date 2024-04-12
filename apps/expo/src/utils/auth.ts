import * as SecureStore from "expo-secure-store";

export const getAuthToken = () => {
  return SecureStore.getItem("auth_session_id");
};

export const setAuthToken = (token: string) => {
  return SecureStore.setItem("auth_session_id", token);
};

export const clearAuthTOken = () => {
  SecureStore.setItem("auth_session_id", "");
};
