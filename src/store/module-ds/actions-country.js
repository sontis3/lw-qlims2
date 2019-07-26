import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.countriesUrl;
const setDsMutation = 'setDsCountries';
const getAction = 'getCountries';
const sysObject = 'country';          // название сист. объекта

// получить полный источник данных
export const getCountries = async ({ commit, getters }) => {
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
export const addCountry = async ({ commit, getters, dispatch }, obj) => {
  // проверка разрешений
  if (!getters.isGranted('create', sysObject)) {
    commit(setDsMutation, []);
    return null;
  }

  const url = getUrl(getters);
  const response = await axios.post(url, obj);
  await dispatch(getAction);
  return response;
};

// удалить документ
export const deleteCountry = async ({ commit, getters, dispatch }, id) => {
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
export const updateCountry = async ({ commit, getters }, obj) => {
  // проверка разрешений
  if (!getters.isGranted('update', sysObject)) {
    commit(setDsMutation, []);
    return null;
  }

  const url = `${getUrl(getters)}/${obj.id}`;

  const putData = {
    name_ru: obj.name_ru,
    name_en: obj.name_en,
    enabled: obj.enabled,
  };

  const header = { 'Content-type': 'application/json' };
  const response = await axios.put(url, putData, { headers: header });
  return response;
};
