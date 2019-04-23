// получить адреса сервисов web API
export const customersUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.customersPartUrl}`;
export const countriesUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.countriesPartUrl}`;

export const testObjectsUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.testObjectsPartUrl}`;
export const deliveryMethodsUrl = state => `${state.apiUrl}/${state.dirPartUrl}/${state.deliveryMethodsPartUrl}`;

export const studiesUrl = state => `${state.apiUrl}/${state.catalogsPartUrl}/${state.studiesPartUrl}`;
export const studyContentUrl = (state, getters) => studyId => `${getters.studiesUrl}/${studyId}/${state.contentPartUrl}`;
export const studyContentInfoUrl = (state, getters) => studyId => `${getters.studyContentUrl(studyId)}/${state.infoPartUrl}`;
