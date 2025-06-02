import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const setToken = async (token) => {
  await AsyncStorage.setItem('userToken', token);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('userToken');
};

export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};