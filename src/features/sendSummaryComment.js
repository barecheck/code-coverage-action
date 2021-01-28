const github = require('@actions/github');
const core = require('@actions/core');

const { uncoveredFileLinesByFileNames } = require('../lcov');

// TODO: add pagibated loop to grap all files
const getChangedFileNames = async () => {
  const githubToken = core.getInput('github-token');

  if (github.context.payload.pull_request) {
    core.info(`get all github PR files`);

    const octokit = github.getOctokit(githubToken);

    const changedFiles = await octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
      {
        repo: github.context.repo.repo,
        owner: github.context.repo.owner,
        pull_number: github.context.payload.pull_request.number
      }
    );

    return changedFiles.data.map(({ filename }) => filename);
  }
};

const sendSummaryComment = async (diff, totalCoverage, compareFileData) => {
  const githubToken = core.getInput('github-token');
  const sendSummaryComment = core.getInput('send-summary-comment');

  if (sendSummaryComment && github.context.payload.pull_request) {
    core.info(`send-summary-comment is enabled for this workflow`);

    const octokit = github.getOctokit(githubToken);
    const arrow = diff === 0 ? '' : diff < 0 ? '▾' : '▴';

    const changedFilesNames = await getChangedFileNames();
    const uncoveredFileLines = uncoveredFileLinesByFileNames(
      changedFilesNames,
      compareFileData
    );
    console.log(uncoveredFileLines);

    const uncoveredLines = uncoveredFileLines.map(({ file, lines }) => {
      const formatlines = (line) =>
        Array.isArray(line) ? line.join('-') : line;
      return `${file}: ${lines.map(formatlines).join(', ')}`;
    });

    await octokit.issues.createComment({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      issue_number: github.context.payload.pull_request.number,
      body: `<h3>Code coverage report</h3>Total: <b>${totalCoverage}%</b>:\n\nYour code coverage diff: <b>${diff}% ${arrow}</b>\n\n${uncoveredLines}`
    });
  }
};

module.exports = {
  sendSummaryComment,
  getChangedFileNames
};
