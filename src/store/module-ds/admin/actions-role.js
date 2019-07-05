import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.rolesUrl;
const setDsMutation = 'setDsRoles';
const getAction = 'getRoles';

// получить полный источник данных
export const getRoles = async ({ commit, getters }) => {
  const url = getUrl(getters);
  const response = await axios.get(url)
    .then((resp) => { commit(setDsMutation, resp.data); commit('preparePermissionViewData'); return resp; })
    .catch((err) => {
      // очистка ds и проброс ошибки
      commit(setDsMutation, []);
      throw err;
    });
  return response;
};

// добавить документ
export const addRole = async ({ getters, dispatch }, roleName) => {
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
export const deleteRole = async ({ getters, dispatch }, id) => {
  const url = `${getUrl(getters)}/${id}`;

  const response = await axios.delete(url);
  await dispatch(getAction);
  return response;
};
