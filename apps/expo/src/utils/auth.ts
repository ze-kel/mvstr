import * as SecureStore from "expo-secure-store";

export const getAuthToken = () => {
  return SecureStore.getItem("auth_session_id");
};

export const setAuthToken = (token: string) => {
  return SecureStore.setItem("auth_session_id", token);
};

export const clearAuthTokenSync = () => {
  SecureStore.setItem("auth_session_id", "");
};

export const clearAuthToken = async () => {
  await SecureStore.deleteItemAsync("auth_session_id");
};
