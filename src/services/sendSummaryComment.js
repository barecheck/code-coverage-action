const core = require("@actions/core");
const { getCoverageReportBody, githubApi } = require("@barecheck/core");

const { getPullRequestContext, getOctokit } = require("../lib/github");
const { getSendSummaryComment, getAppName } = require("../input");

// eslint-disable-next-line max-statements
const sendSummaryComment = async (
  changedFiles,
  coverageDiff,
  totalCoverage
) => {
  const isSendSummaryComment = getSendSummaryComment();
  const pullRequestContext = getPullRequestContext();

  if (isSendSummaryComment && pullRequestContext) {
    core.info(`send-summary-comment is enabled for this workflow`);

    const appName = getAppName() ? getAppName() : "Barecheck";

    const title = `${appName} - Code coverage report`;

    console.log(changedFiles);

    const body = getCoverageReportBody({
      changedFiles,
      title,
      coverageDiff,
      totalCoverage
    });

    const octokit = await getOctokit();
    const { repo, owner, pullNumber } = pullRequestContext;
    await githubApi.createOrUpdateComment(octokit, {
      owner,
      repo,
      issueNumber: pullNumber,
      searchBody: title,
      body
    });
  }
};

module.exports = sendSummaryComment;
