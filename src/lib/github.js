const github = require("@actions/github");
const { githubApi } = require("@barecheck/core");

const { getBarecheckGithubAppToken, getGithubToken } = require("../input");

let octokit = null;

const cleanRef = (fullRef) => fullRef.replace("refs/heads/", "");

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

const getBaseRefSha = () => {
  const { before: baseSha, pull_request: pullRequest } = github.context.payload;
  const { ref: fullRef } = github.context;

  const ref = pullRequest ? pullRequest.base.ref : cleanRef(fullRef);
  const sha = pullRequest ? pullRequest.base.sha : baseSha;

  return { ref, sha };
};

const getCurrentRefSha = () => {
  const { sha, ref: fullRef } = github.context;

  const pullRequest = github.context.payload.pull_request;
  const ref = pullRequest ? pullRequest.head.ref : cleanRef(fullRef);

  return { ref, sha };
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
  cleanOctokit,
  getBaseRefSha,
  getCurrentRefSha
};
