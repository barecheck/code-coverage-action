const github = require('@actions/github');
const getOctokitClient = require('./getOctokitClient');

// TODO: add pagibated loop to grap all files
const getChangedFiles = async () => {
  const octokit = getOctokitClient();
  const changedFiles = await octokit.request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
    {
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      pull_number: github.context.payload.pull_request.number
    }
  );

  return changedFiles.data;
};

module.exports = getChangedFiles;
