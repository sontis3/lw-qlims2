function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => (start + idx).toString());
}

export default {
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
        { id: 'Manufacturers', label: 'Производители' },
      ],
    },
    {
      id: 'Catalogs',
      label: 'Реестры',
      selectable: false,
      children: [
        {
          id: 'Contracts',
          label: 'Договоры',
          selectable: false,
          // lazy: true,
          children: range(2018, (new Date()).getFullYear() + 1).map(item => ({ id: `Contracts.${item}`, label: item })),
        },
        {
          id: 'MasterSchedules',
          label: 'План-график исследований',
          selectable: false,
          // lazy: true,
          children: range(2018, (new Date()).getFullYear() + 1).map(item => ({ id: `MasterSchedules.${item}`, label: item })),
        },
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
      name: 'Страны', tag: 'country', canDropCollection: true, canRestoreCollection: true,
    },
    {
      name: 'Лекарственные формы', tag: 'dosageForm', canDropCollection: true, canRestoreCollection: true,
    },
    {
      name: 'Производители', tag: 'manufacturer', canDropCollection: true, canRestoreCollection: true,
    },
  ],
};
