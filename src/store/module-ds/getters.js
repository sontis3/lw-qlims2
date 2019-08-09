
// получить адреса сервисов web API
// адреса админки
export const systemObjectsUrl = state => `${state.apiUrl}/${state.adminPartUrl}/${state.systemObjectsPartUrl}`;
export const systemObjectActionsUrl = state => `${state.apiUrl}/${state.adminPartUrl}/${state.systemObjectActionsPartUrl}`;
export const rolesUrl = state => `${state.apiUrl}/${state.adminPartUrl}/${state.rolesPartUrl}`;
export const permissionsUrl = (state, getters) => roleId => `${getters.rolesUrl}/${roleId}/${state.permissionsPartUrl}`;
export const usersUrl = state => `${state.apiUrl}/${state.adminPartUrl}/${state.usersPartUrl}`;
export const collectionsUrl = state => `${state.apiUrl}/${state.adminPartUrl}/${state.collectionsPartUrl}`;

// адреса справочников
export const customersUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.customersPartUrl}`;
export const countriesUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.countriesPartUrl}`;
export const manufacturersUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.manufacturersPartUrl}`;

export const testObjectsUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.testObjectsPartUrl}`;
export const deliveryMethodsUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.deliveryMethodsPartUrl}`;

export const contractsUrl = state => `${state.apiUrl}/${state.catalogsPartUrl}/${state.contractsPartUrl}`;
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

// получить действующие роли
export const getEnabledRoles = state => state.dsRoles.filter(el => el.enabled);

// проверка прав
// action - действие
// sysObject - системный объект
export const isGranted = state => (action, sysObject) => {
  let subjArr;
  switch (sysObject) {
    case 'systemObject':
    case 'systemObjectAction':
    case 'role':
    case 'role.permission':
    case 'user':
      subjArr = ['all', 'allAdministration', sysObject];
      break;
    case 'customer':
    case 'country':
    case 'dosageForm':
    case 'manufacturer':
      subjArr = ['all', 'allDirectories', sysObject];
      break;

    default:
      subjArr = ['all', 'allCatalogs', sysObject];
      break;
  }

  return subjArr.reduce((res, currentItem) => res || state.ability.can(action, currentItem), false);
};
