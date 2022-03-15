const core = require("@actions/core");

const valueOrFalse = (value) =>
  value === "" || value === "false" ? false : value;

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

const getBarecheckApiKey = () =>
  valueOrFalse(core.getInput("barecheck-api-key"));

const getLcovFile = () => core.getInput("lcov-file");

const getBaseLcovFile = () => valueOrFalse(core.getInput("base-lcov-file"));

module.exports = {
  getShowAnnotations,
  getGithubToken,
  getBarecheckGithubAppToken,
  getBarecheckApiKey,
  getAppName,
  getLcovFile,
  getBaseLcovFile
};
