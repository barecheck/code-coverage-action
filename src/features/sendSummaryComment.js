const github = require('@actions/github');
const core = require('@actions/core');

const getChangedFiles = require('../github/getChangedFiles');
const createComment = require('../github/createComment');
const buildBody = require('../github/comment/buildBody');

const sendSummaryComment = async (
  coverageDiff,
  totalCoverage,
  compareFileData
) => {
  const githubToken = core.getInput('github-token');
  const sendSummaryComment = core.getInput('send-summary-comment');

  if (sendSummaryComment && github.context.payload.pull_request) {
    core.info(`send-summary-comment is enabled for this workflow`);

    const changedFiles = await getChangedFiles();
    const body = buildBody(changedFiles, coverageDiff, compareFileData);

    // we can add an option how comments should be added create | update | none
    await createComment(body);
  }
};

module.exports = {
  sendSummaryComment
};
