const github = require("@actions/github");

const { getGithubToken, getBarecheckGithubAppToken } = require("../input");
const { createGithubAccessToken } = require("../services/barecheckApi");

let githubAccessToken = null;

const createNewAccessToken = async (barecheckGithubAppToken) => {
  const { token } = await createGithubAccessToken(barecheckGithubAppToken);

  return token;
};

const getOctokitClient = async () => {
  const githubToken = getGithubToken();
  const barecheckGithubAppToken = getBarecheckGithubAppToken();

  if (barecheckGithubAppToken) {
    if (!githubAccessToken)
      githubAccessToken = await createNewAccessToken(barecheckGithubAppToken);
  } else {
    if (!githubToken) {
      throw new Error("github-token property is required");
    }

    githubAccessToken = githubToken;
  }

  const octokit = github.getOctokit(githubAccessToken);

  return octokit;
};

module.exports = getOctokitClient;
