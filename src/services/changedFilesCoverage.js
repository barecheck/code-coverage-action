const { githubApi } = require("@barecheck/core");
const path = require("path");

const { getPullRequestContext, getOctokit } = require("../lib/github");
const { getWorkspacePath } = require("../input");

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

  const workspacePath = getWorkspacePath();
  const changedFilesCoverage = coverage.data.reduce(
    (allFiles, { file, lines }) => {
      const filePath = workspacePath ? path.join(workspacePath, file) : file;

      const changedFile = changedFiles.find(
        ({ filename }) => filename === filePath
      );

      if (changedFile) {
        return [
          ...allFiles,
          {
            file: filePath,
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
