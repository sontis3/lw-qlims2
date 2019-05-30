// мутация смены текущей акции
export const changeSelectedAction = (state, newAction) => { state.selectedActionId = newAction; };

// сохранение уведомления об ошибке
export const addErrorNotification = (state, obj) => {
  const errNotification = {
    dateTime: new Date(),
    message: obj.message,
    descr: obj.description,
  };

  state.errorNotifications.push(errNotification);
};

// удаление уведомления об ошибке
export const deleteErrorNotification = (state, index) => { state.errorNotifications.splice(index, 1); };
