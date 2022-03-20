const github = require("@actions/github");
const { githubApi } = require("barecheck");

const { getBarecheckGithubAppToken, getGithubToken } = require("../input");

let octokit = null;

const cleanRef = (fullRef) =>
  fullRef ? fullRef.replace("refs/heads/", "") : null;

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
  const { ref: currentRef } = github.context;

  const fullRef = pullRequest ? pullRequest.base.ref : currentRef;
  const ref = cleanRef(fullRef);

  const sha = pullRequest ? pullRequest.base.sha : baseSha;

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
  getBaseRefSha
};
