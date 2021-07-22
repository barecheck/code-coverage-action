const { getAppName } = require("../input");
const { githubCommentTitle } = require("../config");

const buildGithubCommentTitle = () => {
  const appName = getAppName();

  return `${appName !== "" ? appName : "Barecheck"} - ${githubCommentTitle}`;
};

module.exports = {
  buildGithubCommentTitle
};
