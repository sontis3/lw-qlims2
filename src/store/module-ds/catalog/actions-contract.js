import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.contractsUrl;
const setDsMutation = 'setDsContracts';
// const getAction = 'getContracts';
const sysObject = 'contract';          // название сист. объекта

// получить полный источник данных
export const getContracts = async ({ commit, getters }) => {
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
