const github = require("@actions/github");
const core = require("@actions/core");

const { commentTitle } = require("../config");

const createOrUpdateComment = require("../github/createOrUpdateComment");
const buildBody = require("../github/comment/buildBody");

const sendSummaryComment = async (
  changedFiles,
  coverageDiff,
  totalCoverage,
  compareFileData
) => {
  const sendSummaryCommentInput = core.getInput("send-summary-comment");

  if (sendSummaryCommentInput && github.context.payload.pull_request) {
    core.info(`send-summary-comment is enabled for this workflow`);



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
