import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.usersUrl;
const setDsMutation = 'setDsUsers';
// const getAction = 'getUsers';

// получить полный источник данных
export const getUsers = async ({ commit, getters }) => {
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

// изменить документ
export const updateUser = async ({ getters }, obj) => {
  const url = `${getUrl(getters)}/${obj.id}`;
  const roleObjId = obj.role ? obj.role.id : null;

  const putData = {
    name: obj.name,
    enabled: obj.enabled,
    roleId: roleObjId,
    email: obj.email,
  };

  const header = { 'Content-type': 'application/json' };
  const response = await axios.put(url, putData, { headers: header });
  return response;
};
