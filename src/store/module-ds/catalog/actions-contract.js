import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.contractsUrl;
const setDsMutation = 'setDsContracts';
const getAction = 'getContracts';
const sysObject = 'contract';          // название сист. объекта

// получить полный источник данных
export const getContracts = async ({ commit, getters }, obj) => {
  // проверка разрешений
  if (!getters.isGranted('read', sysObject)) {
    commit(setDsMutation, []);
    return null;
  }

  const url = getUrl(getters);
  const response = await axios.get(url, { params: { year: obj } })
    .then((resp) => { commit(setDsMutation, resp.data); return resp; })
    .catch((err) => {
      // очистка ds и проброс ошибки
      commit(setDsMutation, []);
      throw err;
    });
  return response;
};

// добавить документ
export const addContract = async ({ commit, getters, dispatch }, obj) => {
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
