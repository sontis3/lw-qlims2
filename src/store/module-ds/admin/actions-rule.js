import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.rulesUrl;
const setDsMutation = 'setDsRules';
const getAction = 'getRules';

// получить полный источник данных
export const getRules = async ({ commit, getters }) => {
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
export const addRule = async ({ getters, dispatch }, roleName) => {
  const url = getUrl(getters);

  const postData = {
    name: roleName,
    enabled: true,
  };

  const response = await axios.post(url, postData);
  await dispatch(getAction);
  return response;
};

// удалить документ
export const deleteRule = async ({ getters, dispatch }, id) => {
  const url = `${getUrl(getters)}/${id}`;

  const response = await axios.delete(url);
  await dispatch(getAction);
  return response;
};
