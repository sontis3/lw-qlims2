// Администрирование
// Системные объекты
export const setDsSystemObjects = (state, newDs) => {
  state.dsSystemObjects = newDs;
};

// Действия над Системными Объектами
export const setDsSystemObjectsActions = (state, newDs) => {
  state.dsSystemObjectsActions = newDs;
};

// Роли
export const setDsRoles = (state, newDs) => {
  state.dsRoles = newDs;
};

// Пользователи
export const setDsUsers = (state, newDs) => {
  state.dsUsers = newDs;
};

// Справочники
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
// export const updateDsCustomers = (state, payload) => {
//   payload.data[payload.column] = payload.newValue;
// };

// установка данных пользователя
export const setUserData = (state, userData) => { state.userData = userData; };


import axios from 'axios';

// выход из аккаунта
export const logout = (state) => {
  state.userData = null;
  axios.defaults.headers.common.Authorization = '';
};

// очистить источники данных
export const cleanOutDs = (state) => {
  // Администрирование
  state.dsSystemObjects = [];        // Системные объекты
  state.dsSystemObjectsActions = []; // Действия над Системными объектами
  state.dsRoles = [];                // Роли
  state.dsUsers = [];                // Пользователи

  // Справочники
  state.dsCustomers = [];        // Заказчики
  state.dsShortCustomers = [];   // Заказчики для QSelect
  state.dsCountries = [];        // Страны
};

// установка конфигурации авторизации
export const setAbility = (state, obj) => {
  state.ability = obj;
};

export const updateAbility = (state, obj) => {
  state.ability.update(obj);
};

// добавление данных для облегчения показа
export const preparePermissionViewData = (state) => {
  const arr = state.dsSystemObjectsActions.map(item => item.name);
  state.dsRoles.forEach((role) => {
    role.permissions.forEach((permission) => {
      // eslint-disable-next-line no-new-object
      permission.viewActions = new Object();
      arr.forEach((element) => {
        const action = permission.actions.find(a => a.action.name === element);
        if (action === undefined) {
          permission.viewActions[element] = false;
        } else {
          permission.viewActions[element] = action.granted;
        }
        // } else {
        //   permission.viewActions[element] = true;
        // }
      });
    });
  });
};
