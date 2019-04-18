export default {
  // текущая выбранная акция
  selectedAction: 'Countries',

  // данные для шаблона дерева акций
  treeActionsTemplate: [
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
    {
      dateTime: new Date(),
      message: 'Это заглушка 1',
      status: 'Статус ошибки 123',
    },
    {
      dateTime: new Date(),
      message: 'Это заглушка 2',
      status: 'Статус ошибки 123',
    },
  ],
};
