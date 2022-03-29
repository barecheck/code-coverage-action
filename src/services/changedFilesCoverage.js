const { githubApi } = require("@barecheck/core");

const { getPullRequestContext, getOctokit } = require("../lib/github");

const getChangedFilesCoverage = async (coverage) => {
  const pullRequestContext = getPullRequestContext();

  if (!pullRequestContext) return coverage.data;

  const octokit = await getOctokit();

  const { repo, owner, pullNumber } = pullRequestContext;
  const changedFiles = await githubApi.getChangedFiles(octokit, {
    repo,
    owner,
    pullNumber
  });

  const changedFilesNames = changedFiles.map(({ filename }) => filename);

  const changedFilesCoverage = coverage.data.filter(({ file }) =>
    changedFilesNames.includes(file)
  );

  return changedFilesCoverage;
};

module.exports = getChangedFilesCoverage;
