import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.countriesUrl;
const setDsMutation = 'setDsCountries';
const getAction = 'getCountries';

// получить полный источник данных
export const getCountries = async ({ commit, getters }) => {
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
export const addCountry = async ({ getters, dispatch }, obj) => {
  const url = getUrl(getters);

  const response = await axios.post(url, obj);
  await dispatch(getAction);
  return response;
};

// удалить документ
export const deleteCountry = async ({ getters, dispatch }, id) => {
  const url = `${getUrl(getters)}/${id}`;

  const response = await axios.delete(url);
  await dispatch(getAction);
  return response;
};

// изменить документ
export const updateCountry = async ({ getters }, obj) => {
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
