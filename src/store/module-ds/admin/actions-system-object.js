import axios from 'axios';

// получить полный источник данных
export const getSystemObjects = async ({ commit, getters }) => {
  const response = await axios.get(getters.systemObjectsUrl)
    .then((resp) => { commit('setDsSystemObjects', resp.data); return resp; })
    .catch((err) => {
      // очистка ds и проброс ошибки
      commit('setDsSystemObjects', []);
      throw err;
    });
  return response;
};

// добавить документ
export const addSystemObject = async ({ getters, dispatch }, obj) => {
  const url = getters.systemObjectsUrl;

  const postData = {
    name: obj.name,
    enabled: obj.enabled,
  };

  const response = await axios.post(url, postData);
  await dispatch('getSystemObjects');
  return response;
};

// удалить документ
export const deleteSystemObject = async ({ getters, dispatch }, id) => {
  const url = `${getters.systemObjectsUrl}/${id}`;

  const response = await axios.delete(url);
  await dispatch('getSystemObjects');
  return response;
};

// изменить документ
export const updateSystemObject = async ({ getters }, obj) => {
  const url = `${getters.systemObjectsUrl}/${obj.id}`;

  const putData = {
    name: obj.name,
    enabled: obj.enabled,
  };

  const header = { 'Content-type': 'application/json' };
  const response = await axios.put(url, putData, { headers: header });
  return response;
};

// добавочные специализированные акции
// // получить источник данных (имя, ид объекта)
// export const getShortEnabledCustomers = async ({ commit, getters }) => {
//   const resp = await axios.get(getters.customersUrl, { params: { enabled: true, short: true } })
//     .then((rawResponse) => {
//       const response = rawResponse.data.map(item => ({ label: item.name, value: item.id }));
//       commit('setDsShortCustomers', response);
//       return response;
//     });
//   return resp;
// };
