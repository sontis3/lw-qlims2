function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => (start + idx).toString());
}

export default {
  // адреса web API
  apiUrl: 'http://localhost:3000/api',
  dirPartUrl: 'dir',
  catalogsPartUrl: 'catalogs',
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
  dsCustomers: [],        // Заказчики
  dsShortCustomers: [],   // Заказчики для QSelect
  dsCountries: [],        // Страны

  dsTestObjects: [],      // Тестируемые объекты
  dsShortTestObjects: [], // Тестируемые объекты для QSelect
  dsDeliveryMethods: [],  // Методы доставки
  dsMasterSchedules: {},  // План-график исследований (именем свойства является номер года)

  // годы
  dsYears: range(2016, (new Date()).getFullYear() + 1),

  // индикатор загрузки данных
  isLoading: false,

  // учетные данные
  credentials: [
    {
      id: null,
    },
  ],
};
