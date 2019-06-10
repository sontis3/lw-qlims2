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
        { id: 'SystemObjects', label: 'Системные объекты' },
        { id: 'SystemObjectActions', label: 'Действия над объектами' },
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
};
