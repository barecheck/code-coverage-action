const github = require("@actions/github");
const { githubApi } = require("barecheck");

const { getBarecheckGithubAppToken, getGithubToken } = require("../input");

let octokit = null;

const getPullRequestContext = () => {
  if (!github.context.payload.pull_request) return false;

  const { owner, repo } = github.context.repo;

  const pullNumber = github.context.payload.pull_request.number;

  return {
    owner,
    repo,
    pullNumber
  };
};

const getOctokit = async () => {
  if (!octokit)
    octokit = await githubApi.createOctokitClient(
      getBarecheckGithubAppToken(),
      getGithubToken()
    );

  return octokit;
};

const cleanOctokit = () => {
  octokit = null;
};

module.exports = {
  getPullRequestContext,
  getOctokit,
  cleanOctokit
};
