import axios from 'axios';

// регистрация пользователя
export const userRegistration = async ({ getters }, obj) => {
  const url = getters.regUrl;

  const postData = {
    name: obj.name,
    email: obj.email,
    password: obj.password,
    // repeatPassword: obj.repeatPassword,
  };

  const response = await axios.post(url, postData);
  return response;
};