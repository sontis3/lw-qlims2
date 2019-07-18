export default {
  // текущая выбранная акция
  selectedActionId: 'Customers',

  // данные для шаблона дерева акций
  treeActionsTemplate: [
    {
      id: 'Administration',
      label: 'Администрирование',
      selectable: false,
      children: [
        { id: 'Collections', label: 'Коллекции' },
        { id: 'SystemObjects', label: 'Системные объекты' },
        { id: 'SystemObjectsActions', label: 'Действия над объектами' },
        { id: 'Roles', label: 'Роли' },
        { id: 'Users', label: 'Пользователи' },
      ],
    },
    {
      id: 'Directory',
      label: 'Справочники',
      selectable: false,
      children: [
        { id: 'Customers', label: 'Заказчики' },
        { id: 'Countries', label: 'Страны' },
      ],
    },
    {
      id: 'Catalogs',
      label: 'Реестры',
      selectable: false,
      children: [
        { id: 'MasterSchedules', label: 'План-график исследований', lazy: true },
        { id: 'StandardSamples', label: 'Реестр стандартных образцов', lazy: true },
      ],
    },
  ],

  // индикатор показа диалога добавления документа
  showAddDialog: false,
  // массив уведомлений системных ошибок
  errorNotifications: [
    // {
    //   dateTime: new Date(),
    //   message: 'Это заглушка 1',
    //   descr: 'Статус ошибки 123',
    // },
    // {
    //   dateTime: new Date(),
    //   message: 'Это заглушка 2',
    //   descr: 'Статус ошибки 123',
    // },
  ],

  // источник данных Администрирование/Коллекции
  dsCollections: [
    {
      name: 'Системные объекты', tag: 'systemObject', canDropCollection: true, canRestoreCollection: true,
    },
    {
      name: 'Действия над объектами', tag: 'systemObjectAction', canDropCollection: true, canRestoreCollection: true,
    },
    {
      name: 'Роли', tag: 'role', canDropCollection: true, canRestoreCollection: true,
    },
    {
      name: 'Пользователи', tag: 'user', canDropCollection: false, canRestoreCollection: false,
    },
    {
      name: 'Заказчики', tag: 'customer', canDropCollection: false, canRestoreCollection: false,
    },
    {
      name: 'Страны', tag: 'country', canDropCollection: false, canRestoreCollection: false,
    },
  ],
};
