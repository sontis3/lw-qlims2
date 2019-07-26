import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.systemObjectActionsUrl;
const setDsMutation = 'setDsSystemObjectsActions';
const getAction = 'getSystemObjectsActions';
const sysObject = 'systemObjectAction';          // название сист. объекта

// получить полный источник данных
export const getSystemObjectsActions = async ({ commit, getters }) => {
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
export const addSystemObjectAction = async ({ commit, getters, dispatch }, obj) => {
  // проверка разрешений
  if (!getters.isGranted('create', sysObject)) {
    commit(setDsMutation, []);
    return null;
  }

  const url = getUrl(getters);
  const postData = {
    name: obj.name,
    tag: obj.tag,
    enabled: obj.enabled,
  };

  const response = await axios.post(url, postData);
  await dispatch(getAction);
  return response;
};

// удалить документ
export const deleteSystemObjectAction = async ({ commit, getters, dispatch }, id) => {
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
export const updateSystemObjectAction = async ({ commit, getters }, obj) => {
  // проверка разрешений
  if (!getters.isGranted('update', sysObject)) {
    commit(setDsMutation, []);
    return null;
  }

  const url = `${getUrl(getters)}/${obj.id}`;
  const putData = {
    name: obj.name,
    tag: obj.tag,
    enabled: obj.enabled,
  };

  const header = { 'Content-type': 'application/json' };
  const response = await axios.put(url, putData, { headers: header });
  return response;
};
