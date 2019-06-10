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
export const addCustomer = async ({ getters, dispatch }, obj) => {
  const url = getters.customersUrl;
  const countryObjId = obj.country ? obj.country.id : null;

  const postData = {
    name: obj.name,
    enabled: obj.enabled,
    countryId: countryObjId,
    email: obj.email,
    phone_1: obj.phone_1,
  };

  const response = await axios.post(url, postData);
  await dispatch('getCustomers');
  return response;
};

// удалить документ
export const deleteCustomer = async ({ getters, dispatch }, id) => {
  const url = `${getters.customersUrl}/${id}`;

  const response = await axios.delete(url);
  await dispatch('getCustomers');
  return response;
};

// изменить документ
export const updateCustomer = async ({ getters }, obj) => {
  const url = `${getters.customersUrl}/${obj.id}`;
  const countryObjId = obj.country ? obj.country.id : null;

  const putData = {
    name: obj.name,
    enabled: obj.enabled,
    countryId: countryObjId,
    email: obj.email,
    phone_1: obj.phone_1,
  };

  const header = { 'Content-type': 'application/json' };
  const response = await axios.put(url, putData, { headers: header });
  return response;
};

// добавочные специализированные акции
// получить источник данных (имя, ид объекта)
export const getShortEnabledCustomers = async ({ commit, getters }) => {
  const resp = await axios.get(getters.customersUrl, { params: { enabled: true, short: true } })
    .then((rawResponse) => {
      const response = rawResponse.data.map(item => ({ label: item.name, value: item.id }));
      commit('setDsShortCustomers', response);
      return response;
    });
  return resp;
};
