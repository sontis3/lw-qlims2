import axios from 'axios';

// регистрация пользователя
export const userRegistration = async ({ getters }, obj) => {
  const url = getters.regUrl;

  const postData = {
    name: obj.name,
    email: obj.email,
    password: obj.password,
  };

  const response = await axios.post(url, postData);
  return response;
};

// логин пользователя
export const userLogin = async ({ commit, getters }, obj) => {
  const url = getters.loginUrl;

  const postData = {
    name: obj.name,
    password: obj.password,
  };

  const response = await axios.post(url, postData).then((resp) => {
    commit('setUserData', resp.data);
    axios.defaults.headers.common.Authorization = resp.data.access_token;
    commit('updateAbility', resp.data.rules);

    return resp;
  });
  return response;
};
