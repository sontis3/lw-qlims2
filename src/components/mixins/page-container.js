import { extend, date } from 'quasar';

export const PageContainer = {
  data() {
    return {
      showDialog: false,    // показать/скрыть диалог добавления
      popupEditData: '.',   // буфер для всплывающего редактора (. для установки начального значения)
      addFormValid: true,   // форма добавления документа валидна?
    };
  },

  methods: {
    // форматирование даты для показа в таблице
    formatDateTime(dateField) {
      return date.formatDate(dateField, 'DD.MM.YYYY HH:mm');
    },

    // создать документ
    onAddDocument() {
      this.showDialog = true;
    },

    // обработка события закрытия диалога создания нового документа
    async onAdd(fieldName) {
      const res = this.addDocument(this.addFormFields);
      res.then((response) => {
        let msg = 'Действие отменено. Не хватает прав на выполнение!';
        let clr = 'negative';
        if (response !== null) {
          msg = `Документ '${response.data[fieldName]}' успешно создан.`;
          clr = 'positive';
        }
        this.$q.notify({
          color: clr,
          position: 'top',
          message: msg,
          icon: 'save',
        });
        this.getDocuments();
      })
        .catch((err) => {
          const errDescription = this.getErrorDescription('post', err);
          this.addErrorNotification({ message: err.message, description: errDescription });

          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: errDescription,
            icon: 'report_problem',
          });
        });
    },

    // изменить документ
    onUpdateDocument(val, row, col, fieldName) {
      // debugger;
      this.setLoading(true);
      // создание копии и её изменение
      const updatedRow = extend({}, row);
      updatedRow[col] = val;
      const res = this.updateDocument(updatedRow);
      res.then((response) => {
        let msg = 'Действие отменено. Не хватает прав на выполнение!';
        let clr = 'negative';
        if (response !== null) {
          msg = `Документ '${response.data[fieldName]}' успешно изменен. Поле [${col}]`;
          clr = 'positive';
        }
        this.$q.notify({
          color: clr,
          position: 'top',
          message: msg,
          icon: 'update',
        });
        this.getDocuments();
      })
        .catch((err) => {
          const errDescription = this.getErrorDescription('put', err);
          this.addErrorNotification({ message: err.message, description: errDescription });
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: errDescription,
            icon: 'report_problem',
          });
        })
        .finally(() => {
          this.setLoading(false);
        });
    },

    // заполнение буфера всплывающего редактора данными из vuex таблицы
    onShowPopup(row, col) {
      // debugger;
      this.popupEditData = row[col];
    },

    // валидация формы добавления документа
    validateAndClose(fieldName) {
      this.$v.addFormFields.$touch();
      if (this.$v.addFormFields.$error) {
        this.addFormValid = false;
        return;
      }
      this.addFormValid = true;
      this.onAdd(fieldName);
    },

  },
};
