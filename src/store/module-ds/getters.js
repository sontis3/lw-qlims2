// получить адреса сервисов web API
// адреса админки
export const systemObjectsUrl = state => `${state.apiUrl}/${state.adminPartUrl}/${state.systemObjectsPartUrl}`;
export const systemObjectActionsUrl = state => `${state.apiUrl}/${state.adminPartUrl}/${state.systemObjectActionsPartUrl}`;
export const rolesUrl = state => `${state.apiUrl}/${state.adminPartUrl}/${state.rolesPartUrl}`;
export const permissionsUrl = (state, getters) => roleId => `${getters.rolesUrl}/${roleId}/${state.permissionsPartUrl}`;

// адреса справочников
export const customersUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.customersPartUrl}`;
export const countriesUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.countriesPartUrl}`;

export const testObjectsUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.testObjectsPartUrl}`;
export const deliveryMethodsUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.deliveryMethodsPartUrl}`;

export const studiesUrl = state => `${state.apiUrl}/${state.catalogsPartUrl}/${state.studiesPartUrl}`;
export const studyContentUrl = (state, getters) => studyId => `${getters.studiesUrl}/${studyId}/${state.contentPartUrl}`;
export const studyContentInfoUrl = (state, getters) => studyId => `${getters.studyContentUrl(studyId)}/${state.infoPartUrl}`;

export const regUrl = state => `${state.apiUrl}/${state.regPartUrl}`;
export const loginUrl = state => `${state.apiUrl}/${state.loginPartUrl}`;

// получить действующие страны
export const getEnabledCountries = state => state.dsCountries.filter(el => el.enabled);

// активные системные объекты не используемые ролью (для показа в списке выбора)
export const getRoleNotUsedSystemObjects = state => (index) => {
  const toRemove = state.dsRoles.length !== 0 ? state.dsRoles[index].permissions.map(item => item.system_object.id) : [];
  return state.dsSystemObjects.filter(el => el.enabled && !toRemove.includes(el.id));
};
