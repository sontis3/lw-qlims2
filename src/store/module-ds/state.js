import { Ability } from '@casl/ability';

// function range(start, end) {
//   return Array(end - start + 1).fill().map((_, idx) => (start + idx).toString());
// }

export default {
  // адреса web API
  apiUrl: 'http://localhost:3000/api',
  dirPartUrl: 'dir',
  adminPartUrl: 'admin',
  catalogPartUrl: 'catalog',

  // администрирование
  systemObjectsPartUrl: 'system-objects',
  systemObjectActionsPartUrl: 'system-objects-actions',
  rolesPartUrl: 'roles',
  rulesPartUrl: 'rules',
  permissionsPartUrl: 'permissions',
  usersPartUrl: 'users',
  collectionsPartUrl: 'collections',

  // справочники
  customersPartUrl: 'customers',
  countriesPartUrl: 'countries',
  manufacturersPartUrl: 'manufacturers',

  testObjectsPartUrl: 'test-objects',
  deliveryMethodsPartUrl: 'delivery-methods',
  contractsPartUrl: 'contracts',
  studiesPartUrl: 'studies',
  contentPartUrl: 'content',
  infoPartUrl: 'info',

  regPartUrl: 'register',
  loginPartUrl: 'login',

  // источники данных
  // Администрирование
  dsSystemObjects: [],        // Системные объекты
  dsSystemObjectsActions: [], // Действия над Системными объектами
  dsRoles: [],                // Роли
  dsUsers: [],                // Пользователи

  // Справочники
  dsCustomers: [],        // Заказчики
  dsShortCustomers: [],   // Заказчики для QSelect
  dsCountries: [],        // Страны
  dsManufacturers: [],    // Производители

  // dsTestObjects: [],      // Тестируемые объекты
  // dsShortTestObjects: [], // Тестируемые объекты для QSelect
  // dsDeliveryMethods: [],  // Методы доставки
  // Реестры
  dsContracts: [],        // Договоры
  dsMasterSchedules: [],  // План-график исследований (именем свойства является номер года)

  // годы
  // dsYears: range(2018, (new Date()).getFullYear() + 1),

  // индикатор загрузки данных
  isLoading: false,

  // данные пользователя
  userData: null,

  // объект управления авторизацией
  ability: new Ability(),

  // удостоверения
  // credentials: [
  //   {
  //     id: null,
  //   },
  // ],
};
