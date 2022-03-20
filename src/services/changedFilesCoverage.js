const { githubApi } = require("barecheck");

const { getPullRequestContext, getOctokit } = require("../lib/github");

const getChangedFilesCoverage = async (coverage) => {
  const { repo, owner, pullNumber } = getPullRequestContext();
  const octokit = await getOctokit();

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
