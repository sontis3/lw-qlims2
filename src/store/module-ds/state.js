function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => (start + idx).toString());
}

export default {
  // адреса web API
  apiUrl: 'http://localhost:3000/api',
  dirPartUrl: 'dir',
  catalogsPartUrl: 'catalogs',
  customersPartUrl: 'customers',
  testObjectsPartUrl: 'test-objects',
  deliveryMethodsPartUrl: 'delivery-methods',
  studiesPartUrl: 'studies',
  contentPartUrl: 'content',
  infoPartUrl: 'info',

  /* eslint no-multi-spaces: ["error", { ignoreEOLComments: true }] */
  // источники данных
  dsCustomers: [],        // Заказчики
  dsShortCustomers: [],   // Заказчики для QSelect
  dsTestObjects: [],      // Тестируемые объекты
  dsShortTestObjects: [], // Тестируемые объекты для QSelect
  dsDeliveryMethods: [],  // Методы доставки
  dsMasterSchedules: {},  // План-график исследований (именем свойства является номер года)

  // годы
  dsYears: range(2016, (new Date()).getFullYear() + 1),

  // индикатор загрузки данных
  isLoading: false,
};
