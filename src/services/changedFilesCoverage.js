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

  const changedFilesCoverage = coverage.data.reduce(
    (allFiles, { file, lines }) => {
      const changedFile = changedFiles.find(
        ({ filename }) => filename === file
      );

      if (changedFile) {
        return [
          ...allFiles,
          {
            file,
            url: changedFile.blob_url,
            lines
          }
        ];
      }
      return allFiles;
    },
    []
  );

  return changedFilesCoverage;
};

module.exports = getChangedFilesCoverage;
