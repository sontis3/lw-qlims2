import axios from 'axios';

// помощник для уменьшения редактирования кода
const getUrl = getters => getters.collectionsUrl;
// const setDsMutation = 'setDsSystemObjects';
// const getAction = 'getSystemObjects';

// удалить коллекцию
export const dropCollection = async ({ getters }, id) => {
  const url = `${getUrl(getters)}/${id}`;

  const response = await axios.delete(url);
  // await dispatch(getAction);
  return response;
};

// востановить коллекцию
export const restoreCollection = async ({ getters }, id) => {
  const url = `${getUrl(getters)}/${id}`;

  const response = await axios.post(url);
  // await dispatch(getAction);
  return response;
};
