// мутация смены текущей акции
export const changeSelectedAction = (state, newAction) => {
  state.selectedActionId = newAction;
};
