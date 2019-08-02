import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.manufacturersUrl;
const setDsMutation = 'setDsManufacturers';
const getAction = 'getManufacturers';
const sysObject = 'manufacturer';          // название сист. объекта

// получить полный источник данных
export const getManufacturers = async ({ commit, getters }) => {
  // проверка разрешений
  if (!getters.isGranted('read', sysObject)) {
    commit(setDsMutation, []);
    return null;
  }

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
export const addManufacturer = async ({ commit, getters, dispatch }, obj) => {
  // проверка разрешений
  if (!getters.isGranted('create', sysObject)) {
    commit(setDsMutation, []);
    return null;
  }

  const url = getUrl(getters);
  const countryObjId = obj.country ? obj.country.id : null;

  const postData = {
    name_ru: obj.name_ru,
    name_en: obj.name_en,
    countryId: countryObjId,
  };

  const response = await axios.post(url, postData);
  await dispatch(getAction);
  return response;
};

// удалить документ
export const deleteManufacturer = async ({ commit, getters, dispatch }, id) => {
  // проверка разрешений
  if (!getters.isGranted('delete', sysObject)) {
    commit(setDsMutation, []);
    return null;
  }

  const url = `${getUrl(getters)}/${id}`;
  const response = await axios.delete(url);
  await dispatch(getAction);
  return response;
};

// изменить документ
export const updateManufacturer = async ({ commit, getters }, obj) => {
  // проверка разрешений
  if (!getters.isGranted('update', sysObject)) {
    commit(setDsMutation, []);
    return null;
  }

  const url = `${getUrl(getters)}/${obj.id}`;
  const countryObjId = obj.country ? obj.country.id : null;

  const putData = {
    name_ru: obj.name_ru,
    name_en: obj.name_en,
    countryId: countryObjId,
  };

  const header = { 'Content-type': 'application/json' };
  const response = await axios.put(url, putData, { headers: header });
  return response;
};

// добавочные специализированные акции
// получить источник данных (имя, ид объекта)
// export const getShortEnabledCustomers = async ({ commit, getters }) => {
//   const url = getUrl(getters);
//   const resp = await axios.get(url, { params: { enabled: true, short: true } })
//     .then((rawResponse) => {
//       const response = rawResponse.data.map(item => ({ label: item.name, value: item.id }));
//       commit('setDsShortCustomers', response);
//       return response;
//     });
//   return resp;
// };
