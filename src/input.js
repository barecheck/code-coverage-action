const core = require("@actions/core");

const getShowAnnotations = () => {
  const availableAnnotations = ["warning", "error"];

  const showAnnotations = core.getInput("show-annotations");

  if (showAnnotations === "") return false;

  if (!availableAnnotations.includes(showAnnotations)) {
    throw new Error(
      `'show-annotations' param should be empty or one of the following options ${availableAnnotations.join(
        ","
      )}`
    );
  }

  return showAnnotations;
};

const getGithubToken = () => core.getInput("github-token");

const getAppName = () => core.getInput("app-name");

const getBarecheckGithubAppToken = () =>
  core.getInput("barecheck-github-app-token");

const getBarecheckApiKey = () => core.getInput("barecheck-api-key");

module.exports = {
  getShowAnnotations,
  getGithubToken,
  getBarecheckGithubAppToken,
  getBarecheckApiKey,
  getAppName
};
