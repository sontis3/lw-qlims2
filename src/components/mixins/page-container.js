import { extend } from 'quasar';

export const PageContainer = {
  data() {
    return {
      showDialog: false,  // показать/скрыть диалог добавления
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
