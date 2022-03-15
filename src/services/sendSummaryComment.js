const github = require("@actions/github");
const core = require("@actions/core");
const { getCoverageReportBody, githubApi } = require("barecheck");

const sendSummaryComment = async (
  changedFiles,
  coverageDiff,
  totalCoverage
) => {
  const sendSummaryCommentInput = core.getInput("send-summary-comment");
  const appToken = core.getInput("barecheck-github-app-token");

  if (sendSummaryCommentInput && github.context.payload.pull_request) {
    core.info(`send-summary-comment is enabled for this workflow`);

    const title = "Code coverage report";

    const body = getCoverageReportBody({
      changedFiles,
      title,
      coverageDiff,
      totalCoverage
    });

    const octokit = githubApi.createOctokitClient(appToken);
    // we can add an option how comments should be added create | update | none
    await githubApi.createOrUpdateComment(octokit, {
      owner: "barecheck",
      repo: "code-coverage-action",
      issueNumber: "154",
      searchBody: title,
      body
    });
  }
};

module.exports = sendSummaryComment;
