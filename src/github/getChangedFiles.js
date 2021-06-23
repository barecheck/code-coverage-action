const github = require("@actions/github");
const getOctokitClient = require("./getOctokitClient");

/**
 * Returns first 100 files that were changed
 * TODO: decide if we need to show more than that in the details report
 *  */
const getChangedFiles = async () => {
  const octokit = await getOctokitClient();
  const changedFiles = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      pull_number: github.context.payload.pull_request.number,
      per_page: 100
    }
  );

  return changedFiles.data;
};

module.exports = getChangedFiles;
