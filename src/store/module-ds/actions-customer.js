import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.customersUrl;
const setDsMutation = 'setDsCustomers';
const getAction = 'getCustomers';

// получить полный источник данных
export const getCustomers = async ({ commit, getters }) => {
  const url = getUrl(getters);
  const response = await axios.get(url)
    .then((resp) => { commit(setDsMutation, resp.data); return resp; })
    .catch((err) => {
      // очистка ds и проброс ошибки
      commit(setDsMutation, []);
      throw err;
    });
  return response;
};

// добавить документ
export const addCustomer = async ({ getters, dispatch }, obj) => {
  const url = getUrl(getters);
  const countryObjId = obj.country ? obj.country.id : null;

  const postData = {
    name: obj.name,
    enabled: obj.enabled,
    countryId: countryObjId,
    email: obj.email,
    phone_1: obj.phone_1,
  };

  const response = await axios.post(url, postData);
  await dispatch(getAction);
  return response;
};

// удалить документ
export const deleteCustomer = async ({ getters, dispatch }, id) => {
  const url = `${getUrl(getters)}/${id}`;

  const response = await axios.delete(url);
  await dispatch(getAction);
  return response;
};

// изменить документ
export const updateCustomer = async ({ getters }, obj) => {
  const url = `${getUrl(getters)}/${obj.id}`;
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
  const url = getUrl(getters);
  const resp = await axios.get(url, { params: { enabled: true, short: true } })
    .then((rawResponse) => {
      const response = rawResponse.data.map(item => ({ label: item.name, value: item.id }));
      commit('setDsShortCustomers', response);
      return response;
    });
  return resp;
};
