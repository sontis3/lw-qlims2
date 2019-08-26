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
  const regValueParsed = obj.reg_date.split('.');
  if (!regValueParsed.length === 3) {
    return null;
  }

  const regDateIso = `${regValueParsed[2]}-${regValueParsed[1]}-${regValueParsed[0]}`;

  const deadValueParsed = obj.deadline_date.split('.');
  if (!deadValueParsed.length === 3) {
    return null;
  }
  const deadlineDateIso = `${deadValueParsed[2]}-${deadValueParsed[1]}-${deadValueParsed[0]}`;
  const customerObjId = obj.customer ? obj.customer.id : null;

  const postData = {
    reg_code: obj.reg_code,
    theme: obj.theme,
    reg_date: regDateIso,
    deadline_date: deadlineDateIso,
    customerId: customerObjId,
  };

  const response = await axios.post(url, postData);
  await dispatch(getAction);
  return response;
};
