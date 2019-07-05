/* eslint-disable quote-props */
import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = (getters, roleId) => getters.rulesUrl(roleId);
const getUrl0 = getters => getters.rulesUrl0;
const setDsMutation = 'setDsRolePermissions';
const getAction = 'getRules';

// получить полный источник данных
export const getRules = async ({ commit, getters }, roleId) => {
  const url = getUrl0(getters);
  const response = await axios.get(url, { params: { 'roleId': roleId } })
    .then((resp) => {
      commit(setDsMutation, resp.data);
      commit('preparePermissionViewData');
      return resp;
    })
    .catch((err) => {
      // очистка ds и проброс ошибки
      commit(setDsMutation, []);
      throw err;
    });
  return response;
};

// добавить документ
export const addRules = async ({ getters, dispatch }, postData) => {
  const url = getUrl(getters, postData.roleId);
  const payload = {
    system_objectIds: postData.system_objectIds,
    actionIds: postData.actionIds,
  };

  const response = await axios.post(url, payload);
  await dispatch('getRoles');
  // await dispatch(getAction, postData.roleId);
  return response;
};

// удалить документ
export const deleteRule = async ({ getters, dispatch }, id) => {
  const url = `${getUrl(getters)}/${id}`;

  const response = await axios.delete(url);
  await dispatch(getAction);
  return response;
};
