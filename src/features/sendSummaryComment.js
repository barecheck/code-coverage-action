const github = require("@actions/github");
const core = require("@actions/core");
const { getCoverageReportBody, githubApi } = require("barecheck");

const sendSummaryComment = async (
  changedFiles,
  coverageDiff,
  totalCoverage
) => {
  const sendSummaryCommentInput = core.getInput("send-summary-comment");

  if (sendSummaryCommentInput && github.context.payload.pull_request) {
    core.info(`send-summary-comment is enabled for this workflow`);

    const title = "Code coverage report";

    const body = getCoverageReportBody(
      changedFiles,
      title,
      coverageDiff,
      totalCoverage
    );

    // we can add an option how comments should be added create | update | none
    await githubApi.createOrUpdateComment(title, body);
  }
};

module.exports = {
  sendSummaryComment
};
