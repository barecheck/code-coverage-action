const core = require("@actions/core");

const valueOrFalse = (value) =>
  value === "" || value.toLowerCase() === "false" ? false : value;

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

const getGithubToken = () => valueOrFalse(core.getInput("github-token"));

const getAppName = () => valueOrFalse(core.getInput("app-name"));

const getBarecheckGithubAppToken = () =>
  valueOrFalse(core.getInput("barecheck-github-app-token"));

const getBarecheckApiKey = () =>
  valueOrFalse(core.getInput("barecheck-api-key"));

const getLcovFile = () => core.getInput("lcov-file");

const getBaseLcovFile = () => valueOrFalse(core.getInput("base-lcov-file"));

const getSendSummaryComment = () =>
  valueOrFalse(core.getInput("send-summary-comment"));

const getWorkspacePath = () => core.getInput("workspace-path");

const getPullNumber = () => {
  const rawValue = core.getInput("pull-number");
  const intValue = parseInt(rawValue, 10);
  const isNumber = !Number.isNaN(intValue);
  return isNumber && intValue > 0 ? intValue : false;
};

module.exports = {
  getShowAnnotations,
  getGithubToken,
  getBarecheckGithubAppToken,
  getBarecheckApiKey,
  getAppName,
  getLcovFile,
  getBaseLcovFile,
  getSendSummaryComment,
  getWorkspacePath,
  getPullNumber
};
