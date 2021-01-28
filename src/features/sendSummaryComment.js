const github = require('@actions/github');
const core = require('@actions/core');

const { uncoveredFileLinesByFileNames } = require('../lcov');
const getChangedFilesNames = require('../github/getChangedFilesNames');
const buildCommentDetails = require('../github/comment/buildDetails');

const sendSummaryComment = async (diff, totalCoverage, compareFileData) => {
  const githubToken = core.getInput('github-token');
  const sendSummaryComment = core.getInput('send-summary-comment');

  if (sendSummaryComment && github.context.payload.pull_request) {
    core.info(`send-summary-comment is enabled for this workflow`);

    const octokit = github.getOctokit(githubToken);
    const arrow = diff === 0 ? '' : diff < 0 ? '▾' : '▴';

    const changedFilesNames = await getChangedFilesNames();
    const uncoveredFileLines = uncoveredFileLinesByFileNames(
      changedFilesNames,
      compareFileData
    );

    const commentDetailsMessage = buildCommentDetails(uncoveredFileLines);

    await octokit.issues.createComment({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      issue_number: github.context.payload.pull_request.number,
      body: `<h3>Code coverage report</h3>Total: <b>${totalCoverage}%</b>:\n\nYour code coverage diff: <b>${diff}% ${arrow}</b>\n\n${commentDetailsMessage}`
    });
  }
};

module.exports = {
  sendSummaryComment
};
