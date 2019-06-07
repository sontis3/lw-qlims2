// установить новый источник данных Заказчики
export const setDsCustomers = (state, newDs) => {
  state.dsCustomers = newDs;
};

export const setDsShortCustomers = (state, newDs) => {
  state.dsShortCustomers = newDs;
};

// установить новый источник данных Страны
export const setDsCountries = (state, newDs) => {
  state.dsCountries = newDs;
};

// установить новый источник данных Тестируемые объекты
export const setDsTestObjects = (state, newDs) => {
  state.dsTestObjects = newDs;
};

export const setDsShortTestObjects = (state, newDs) => {
  state.dsShortTestObjects = newDs;
};

// установить новый источник данных Способы доставки
export const setDsDeliveryMethods = (state, newDs) => {
  state.dsDeliveryMethods = newDs;
};

// установить новый источник данных План-график исследований
export const setDsMasterSchedules = (state, payload) => {
  // обход ограничения vue по отслеживанию изменений свойств объекта
  // state.dsMasterSchedules[payload.year] = payload.data;
  state.dsMasterSchedules = Object.assign({}, state.dsMasterSchedules, { [payload.year]: payload.data });
};

// установить значение индикатора загрузки
export const setLoading = (state, newValue) => {
  state.isLoading = newValue;
};

// изменить источник данных Заказчики
export const updateDsCustomers = (state, payload) => {
  payload.data[payload.column] = payload.newValue;
};

// установка данных пользователя
export const setUserData = (state, userData) => { state.userData = userData; };


import axios from 'axios';
// выход из аккаунта
export const logout = (state) => {
  state.userData = null;
  axios.defaults.headers.common.Authorization = '';
};

// установка конфигурации авторизации
export const setAbility = (state, obj) => {
  state.ability = obj;
};

export const updateAbility = (state, obj) => {
  state.ability.update(obj);
};
