const github = require("@actions/github");

const { getGithubToken, getBarecheckGithubAppToken } = require("../input");

const getOctokitClient = () => {
  const githubToken = getGithubToken();
  const barecheckGithubAppToken = getBarecheckGithubAppToken();

  // eslint-disable-next-line no-console
  console.log(barecheckGithubAppToken);

  if (!githubToken) {
    throw new Error("github-token property is required");
  }

  const octokit = github.getOctokit(githubToken);

  return octokit;
};

module.exports = getOctokitClient;
