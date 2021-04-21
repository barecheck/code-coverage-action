const core = require("@actions/core");

const getShowAnotations = () => {
  const availableAnotations = ["warning", "error"];

  const showAnotations = core.getInput("show-anotations");

  if (showAnotations === "") return false;

  if (!availableAnotations.includes(showAnotations)) {
    throw new Error(
      `'show-anotations' param should be empty or one of the following options ${availableAnotations.join(
        ","
      )}`
    );
  }

  return showAnotations;
};

module.exports = {
  getShowAnotations
};
