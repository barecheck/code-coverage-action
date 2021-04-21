const github = require("@actions/github");
const core = require("@actions/core");
const getChangedFiles = require("../github/getChangedFiles");
const createOrUpdateComment = require("../github/createOrUpdateComment");
const buildBody = require("../github/comment/buildBody");

const { commentTitle } = require("../config");

const sendSummaryComment = async (
  coverageDiff,
  totalCoverage,
  compareFileData
) => {
  const sendSummaryCommentInput = core.getInput("send-summary-comment");

  if (sendSummaryCommentInput && github.context.payload.pull_request) {
    core.info(`send-summary-comment is enabled for this workflow`);

    const changedFiles = await getChangedFiles();

    const body = buildBody(
      changedFiles,
      coverageDiff,
      totalCoverage,
      compareFileData
    );

    // we can add an option how comments should be added create | update | none
    await createOrUpdateComment(commentTitle, body);
  }
};

module.exports = {
  sendSummaryComment
};
