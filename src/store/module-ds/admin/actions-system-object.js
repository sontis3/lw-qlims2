import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.systemObjectsUrl;
const setDsMutation = 'setDsSystemObjects';
const getAction = 'getSystemObjects';

// получить полный источник данных
export const getSystemObjects = async ({ commit, getters }) => {
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
export const addSystemObject = async ({ getters, dispatch }, obj) => {
  const url = getUrl(getters);

  const postData = {
    name: obj.name,
    enabled: obj.enabled,
  };

  const response = await axios.post(url, postData);
  await dispatch(getAction);
  return response;
};

// удалить документ
export const deleteSystemObject = async ({ getters, dispatch }, id) => {
  const url = `${getUrl(getters)}/${id}`;

  const response = await axios.delete(url);
  await dispatch(getAction);
  return response;
};

// изменить документ
export const updateSystemObject = async ({ getters }, obj) => {
  const url = `${getUrl(getters)}/${obj.id}`;

  const putData = {
    name: obj.name,
    enabled: obj.enabled,
  };

  const header = { 'Content-type': 'application/json' };
  const response = await axios.put(url, putData, { headers: header });
  return response;
};
