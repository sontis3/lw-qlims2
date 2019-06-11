import { extend } from 'quasar';

export const PageContainer = {
  data() {
    return {
      showDialog: false,    // показать/скрыть диалог добавления
      popupEditData: '',    // буфер для всплывающего редактора
      addFormValid: true,   // форма добавления документа валидна?
      popoverStyle: {
        backgroundColor: 'red',
        minWidth: '0px',
        display: 'inline-flex',
        flexWrap: 'nowrap',
      },
    };
  },

  methods: {
    // создать документ
    onAddDocument() {
      this.showDialog = true;
    },

    // обработка события закрытия диалога создания нового документа
    async onAdd(fieldName) {
      const res = this.addDocument(this.addFormFields);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Документ '${response.data[fieldName]}' успешно создан.`,
          icon: 'save',
        });
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
      this.setLoading(true);
      // создание копии и её изменение
      const updatedRow = extend({}, row);
      updatedRow[col] = val;
      const res = this.updateDocument(updatedRow);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Документ '${response.data[fieldName]}' успешно изменен. Поле [${col}]`,
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

    // удалить документ
    onDeleteDocument(row, fieldName) {
      const { id } = row;
      this.setLoading(true);
      const res = this.deleteDocument(id);
      res.then((response) => {
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: `Документ '${response.data[fieldName]}' успешно удален.`,
          icon: 'delete',
        });
      })
        .catch((err) => {
          const errDescription = this.getErrorDescription('delete', err);
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
      this.popupEditData = row[col];
    },

    showPopover() {
      // выставить ширину как у строки таблицы
      this.popoverStyle.minWidth = `${this.$el.querySelector('.q-table tbody tr').clientWidth}px`;
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

  mounted() {
    this.setLoading(true);
    const res = this.getDocuments();
    res.then()
      .catch((err) => {
        const errDescription = this.getErrorDescription('get', err);
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
};
