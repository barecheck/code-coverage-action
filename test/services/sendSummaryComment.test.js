const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const actionsCoreStub = require("../stubs/actionsCore.stub");

const defaultMocks = {
  ...actionsCoreStub,
  getCoverageReportBody: () => null,
  githubApi: () => ({}),
  getSendSummaryComment: () => null,
  getAppName: () => false,
  getPullRequestContext: () => null,
  getOctokit: () => null
};

const sendSummaryCommentMock = (mocks) => {
  const {
    getCoverageReportBody,
    githubApi,
    getSendSummaryComment,
    getAppName,
    getPullRequestContext,
    getOctokit,
    info
  } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire("../../src/services/sendSummaryComment", {
    barecheck: { getCoverageReportBody, githubApi },
    "@actions/core": { info },
    "../input": { getSendSummaryComment, getAppName },
    "../lib/github": { getPullRequestContext, getOctokit }
  });
};

describe("services/sendSummaryComment", () => {
  it("should call github API to update GitHub comment", async () => {
    const octokit = { test: 1 };
    const coverageReportBody = "coverage body";
    const getSendSummaryComment = sinon.stub().returns(true);
    const getPullRequestContext = sinon.stub().returns({
      repo: "barecheck",
      owner: "barecheck",
      pullNumber: 111
    });
    const getAppName = sinon.stub().returns(false);
    const getCoverageReportBody = sinon.stub().returns(coverageReportBody);
    const getOctokit = sinon.stub().returns(octokit);
    const createOrUpdateComment = sinon.stub().returns(null);
    const githubApi = { createOrUpdateComment };

    const changedFiles = [{ file: "test.js" }];
    const coverageDiff = 10;
    const totalCoverage = 45;

    const sendSummaryComment = sendSummaryCommentMock({
      getCoverageReportBody,
      githubApi,
      getSendSummaryComment,
      getAppName,
      getPullRequestContext,
      getOctokit
    });

    await sendSummaryComment(changedFiles, coverageDiff, totalCoverage);

    assert.deepEqual(createOrUpdateComment.firstCall.args[1], {
      owner: "barecheck",
      repo: "barecheck",
      issueNumber: 111,
      searchBody: "Barecheck - Code coverage report",
      body: coverageReportBody
    });
  });

  it("should call github API with custom App name", async () => {
    const octokit = { test: 1 };
    const coverageReportBody = "coverage body";
    const getSendSummaryComment = sinon.stub().returns(true);
    const getPullRequestContext = sinon.stub().returns({
      repo: "barecheck",
      owner: "barecheck",
      pullNumber: 111
    });
    const getAppName = sinon.stub().returns("Test");
    const getCoverageReportBody = sinon.stub().returns(coverageReportBody);
    const getOctokit = sinon.stub().returns(octokit);
    const createOrUpdateComment = sinon.stub().returns(null);
    const githubApi = { createOrUpdateComment };

    const changedFiles = [{ file: "test.js" }];
    const coverageDiff = 10;
    const totalCoverage = 45;

    const sendSummaryComment = sendSummaryCommentMock({
      getCoverageReportBody,
      githubApi,
      getSendSummaryComment,
      getAppName,
      getPullRequestContext,
      getOctokit
    });

    await sendSummaryComment(changedFiles, coverageDiff, totalCoverage);

    assert.deepEqual(createOrUpdateComment.firstCall.args[1], {
      owner: "barecheck",
      repo: "barecheck",
      issueNumber: 111,
      searchBody: "Test - Code coverage report",
      body: coverageReportBody
    });
  });

  [
    { sendSummaryComment: false, pullRequestContext: false },
    { sendSummaryComment: true, pullRequestContext: false },
    { sendSummaryComment: false, pullRequestContext: { owner: "barecheck" } }
  ].forEach(({ sendSummaryComment, pullRequestContext }) =>
    it(`github API should not be called when sendSummaryComment=${sendSummaryComment}, pullRequestContext=${pullRequestContext}`, async () => {
      const octokit = { test: 1 };
      const coverageReportBody = "coverage body";
      const getSendSummaryComment = sinon.stub().returns(sendSummaryComment);
      const getPullRequestContext = sinon.stub().returns(pullRequestContext);
      const getAppName = sinon.stub().returns("Test");
      const getCoverageReportBody = sinon.stub().returns(coverageReportBody);
      const getOctokit = sinon.stub().returns(octokit);
      const createOrUpdateComment = sinon.stub().returns(null);
      const githubApi = { createOrUpdateComment };

      const changedFiles = [{ file: "test.js" }];
      const coverageDiff = 10;
      const totalCoverage = 45;

      const isSendSummaryComment = sendSummaryCommentMock({
        getCoverageReportBody,
        githubApi,
        getSendSummaryComment,
        getAppName,
        getPullRequestContext,
        getOctokit
      });

      await isSendSummaryComment(changedFiles, coverageDiff, totalCoverage);

      assert.isFalse(createOrUpdateComment.calledOnce);
      assert.isFalse(getOctokit.calledOnce);
      assert.isFalse(getCoverageReportBody.calledOnce);
      assert.isFalse(getAppName.calledOnce);
    })
  );
});
