// получить данные для построения дерева акций
export const getActionsTreeData = state => state.treeActionsTemplate;

// сформировать сообщение об ошибке от сервера
/* eslint no-unused-vars: ["error", { "args": "none" }] */
export const getErrorDescription = state => (httpMethod, err) => {
  /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: false}}] */
  const responseURL = err.request.responseURL ? err.request.responseURL : err.config.url;
  const { method } = err.config;

  let ErrorDescription;
  if (err.response) {
    ErrorDescription = `Status: ${err.response.status}.  ${err.response.data.message} = ${method} ${responseURL}`;
  } else {
    ErrorDescription = `${err.message} = ${httpMethod} ${responseURL}`;
  }

  return ErrorDescription;
};

export { getActionsTreeData as default };
