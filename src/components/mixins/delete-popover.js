export const DeletePopover = {
  data() {
    return {
      popoverStyle: {
        backgroundColor: 'red',
        minWidth: '0px',
        display: 'inline-flex',
        flexWrap: 'nowrap',
      },
    };
  },

  methods: {
    showPopover() {
      // выставить ширину как у строки таблицы
      // this.popoverStyle.minWidth = `${this.$el.querySelector('.q-table tbody tr').clientWidth}px`;
      this.popoverStyle.minWidth = '400px';
    },

    // удалить документ
    // row - поля документа
    // fieldName - имя поля для сообщения
    // deleteFunc - функция удаления
    onDeleteDocument(row, fieldName, deleteFunc) {
      const { id } = row;
      this.setLoading(true);
      const res = deleteFunc(id);
      res.then((response) => {
        let msg = 'Действие отменено. Не хватает прав на выполнение!';
        let clr = 'negative';
        if (response !== null) {
          msg = `Документ '${response.data[fieldName]}' успешно удален.`;
          clr = 'positive';
        }
        this.$q.notify({
          color: clr,
          position: 'top',
          message: msg,
          icon: 'delete',
        });
        this.getDocuments();
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

  },
};
