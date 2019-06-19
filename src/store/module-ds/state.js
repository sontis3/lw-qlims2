function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => (start + idx).toString());
}

export default {
  // адреса web API
  apiUrl: 'http://localhost:3000/api',
  dirPartUrl: 'dir',
  adminPartUrl: 'admin',
  catalogsPartUrl: 'catalogs',

  // администрирование
  systemObjectsPartUrl: 'system-objects',
  systemObjectActionsPartUrl: 'system-objects-actions',

  // справочники
  customersPartUrl: 'customers',
  countriesPartUrl: 'countries',

  testObjectsPartUrl: 'test-objects',
  deliveryMethodsPartUrl: 'delivery-methods',
  studiesPartUrl: 'studies',
  contentPartUrl: 'content',
  infoPartUrl: 'info',

  regPartUrl: 'register',
  loginPartUrl: 'login',

  // источники данных
  // Администрирование
  dsSystemObjects: [],        // Системные объекты
  dsSystemObjectsActions: [], // Действия над Системными объектами

  // Справочники
  dsCustomers: [],        // Заказчики
  dsShortCustomers: [],   // Заказчики для QSelect
  dsCountries: [],        // Страны

  // dsTestObjects: [],      // Тестируемые объекты
  // dsShortTestObjects: [], // Тестируемые объекты для QSelect
  // dsDeliveryMethods: [],  // Методы доставки
  // dsMasterSchedules: {},  // План-график исследований (именем свойства является номер года)

  // годы
  dsYears: range(2016, (new Date()).getFullYear() + 1),

  // индикатор загрузки данных
  isLoading: false,

  // данные пользователя
  userData: null,

  // объект управления авторизацией
  ability: null, // new Ability(),

  // удостоверения
  // credentials: [
  //   {
  //     id: null,
  //   },
  // ],
};
