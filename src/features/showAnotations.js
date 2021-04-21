const core = require("@actions/core");
const { getShowAnotations } = require("../input");

const showAnotations = async () => {
  const showAnotationsInput = getShowAnotations();

  if (showAnotationsInput) {
    core.info("Show anotations feature enabled");
  }
};

module.exports = {
  showAnotations
};
