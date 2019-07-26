import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.rolesUrl;
const getPermissionsUrl = (getters, roleId) => getters.permissionsUrl(roleId);
const setDsMutation = 'setDsRoles';
const getAction = 'getRoles';
const sysObject = 'role';          // название сист. объекта
const sysObject2 = 'role.permission';         // название сист. объекта

// получить полный источник данных
export const getRoles = async ({ commit, getters }) => {
  // проверка разрешений
  if (!getters.isGranted('read', sysObject)) {
    commit(setDsMutation, []);
    return null;
  }

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
export const addRole = async ({ commit, getters, dispatch }, obj) => {
  // проверка разрешений
  if (!getters.isGranted('create', sysObject)) {
    commit(setDsMutation, []);
    return null;
  }

  const url = getUrl(getters);
  const postData = {
    name: obj.name,
    tag: obj.tag,
    enabled: true,
  };

  const response = await axios.post(url, postData);
  await dispatch(getAction);
  return response;
};

// удалить документ
export const deleteRole = async ({ commit, getters, dispatch }, id) => {
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

// добавить встроенные документы разрешений
export const addPermissions = async ({ getters, dispatch }, obj) => {
  // проверка разрешений
  if (!getters.isGranted('create', sysObject2)) {
    // commit(setDsMutation, []);
    return null;
  }

  const url = getPermissionsUrl(getters, obj.roleId);
  const payload = {
    system_objectIds: obj.system_objectIds,
    actionIds: obj.actionIds,
  };

  const response = await axios.post(url, payload);
  await dispatch('getRoles');
  // await dispatch(getAction, obj.roleId);
  return response;
};

// изменить разрешение
export const updatePermission = async ({ getters, dispatch }, obj) => {
  // проверка разрешений
  if (!getters.isGranted('update', sysObject2)) {
    // commit(setDsMutation, []);
    return null;
  }

  const url = `${getPermissionsUrl(getters, obj.roleId)}/${obj.system_objectId}`;
  const putData = {
    actionId: obj.actionId,
    granted: obj.granted,
  };

  const header = { 'Content-type': 'application/json' };
  const response = await axios.put(url, putData, { headers: header });
  await dispatch('getRoles');
  return response;
};

// удалить разрешение
export const deletePermission = async ({ getters, dispatch }, obj) => {
  // проверка разрешений
  if (!getters.isGranted('delete', sysObject2)) {
    // commit(setDsMutation, []);
    return null;
  }

  const url = `${getPermissionsUrl(getters, obj.roleId)}/${obj.system_objectId}`;
  const response = await axios.delete(url);
  await dispatch('getRoles');
  return response;
};
