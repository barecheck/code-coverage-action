const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const actionsCoreStub = require("../stubs/actionsCore.stub");

const defaultMocks = {
  ...actionsCoreStub,
  getChangedFiles: () => [],
  createOrUpdateComment: () => true,
  buildBody: () => "",
  context: {},
  buildGithubCommentTitle: () => "Barecheck - Code coverage report"
};

const sendSummaryCommentMock = (mocks) => {
  const {
    getInput,
    info,
    context,
    getChangedFiles,
    createOrUpdateComment,
    buildBody,
    buildGithubCommentTitle
  } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire("../../src/features/sendSummaryComment", {
    "@actions/core": { getInput, info },
    "@actions/github": { context },
    "../github/getChangedFiles": getChangedFiles,
    "../github/createOrUpdateComment": createOrUpdateComment,
    "../github/comment/buildBody": buildBody,
    "../github/utils": { buildGithubCommentTitle }
  });
};

describe("features/sendSummaryComment", () => {
  describe("sendSummaryComment", () => {
    it("github.createOrUpdateComment shouldn't be called", async () => {
      const sendSummaryCommentInput = false;
      const githubTokenInput = "1-2-3";
      const coverageDiff = 0;
      const totalCoverage = 0;

      const createOrUpdateComment = sinon.spy();
      const getInput = sinon.stub();
      getInput
        .withArgs("send-summary-comment")
        .returns(sendSummaryCommentInput);
      getInput.withArgs("github-token").returns(githubTokenInput);

      const { sendSummaryComment } = sendSummaryCommentMock({
        getInput,
        createOrUpdateComment
      });
      await sendSummaryComment(coverageDiff, totalCoverage, []);

      assert.isFalse(createOrUpdateComment.calledOnce);
    });

    it("github.createOrUpdateComment shouldn't be called for not pull request events", async () => {
      const sendSummaryCommentInput = true;
      const githubTokenInput = "1-2-3";
      const coverageDiff = 0;
      const totalCoverage = 0;
      const context = {
        payload: {}
      };

      const createOrUpdateComment = sinon.spy();
      const getInput = sinon.stub();
      getInput
        .withArgs("send-summary-comment")
        .returns(sendSummaryCommentInput);
      getInput.withArgs("github-token").returns(githubTokenInput);

      const { sendSummaryComment } = sendSummaryCommentMock({
        getInput,
        createOrUpdateComment,
        context
      });
      await sendSummaryComment(coverageDiff, totalCoverage, []);

      assert.isFalse(createOrUpdateComment.calledOnce);
    });

    it("github.createOrUpdateComment should be called once", async () => {
      const sendSummaryCommentInput = true;
      const githubTokenInput = "1-2-3";
      const coverageDiff = 12;
      const totalCoverage = 65;
      const body = "test body";
      const context = {
        payload: {
          pull_request: {
            number: 123
          }
        }
      };

      const createOrUpdateComment = sinon.spy();
      const buildBody = sinon.stub().returns(body);
      const getInput = sinon.stub();
      getInput
        .withArgs("send-summary-comment")
        .returns(sendSummaryCommentInput);
      getInput.withArgs("github-token").returns(githubTokenInput);

      const { sendSummaryComment } = sendSummaryCommentMock({
        getInput,
        createOrUpdateComment,
        context,
        buildBody
      });
      await sendSummaryComment(coverageDiff, totalCoverage, []);

      assert.isTrue(createOrUpdateComment.calledOnce);
      assert.deepEqual(createOrUpdateComment.firstCall.args, [
        "Barecheck - Code coverage report",
        body
      ]);
    });

    it("buildBody should be called with proper args", async () => {
      const sendSummaryCommentInput = true;
      const githubTokenInput = "1-2-3";
      const coverageDiff = 12;
      const totalCoverage = 65;
      const body = "test body";
      const changedFiles = [{ file: "test.txt" }];
      const compareFileData = [{ test: 1 }];
      const context = {
        payload: {
          pull_request: {
            number: 123
          }
        }
      };

      const createOrUpdateComment = sinon.spy();
      const buildBody = sinon.stub().returns(body);
      const getChangedFiles = sinon.stub().returns(changedFiles);
      const getInput = sinon.stub();
      getInput
        .withArgs("send-summary-comment")
        .returns(sendSummaryCommentInput);
      getInput.withArgs("github-token").returns(githubTokenInput);

      const { sendSummaryComment } = sendSummaryCommentMock({
        getInput,
        createOrUpdateComment,
        context,
        buildBody,
        getChangedFiles
      });

      await sendSummaryComment(coverageDiff, totalCoverage, compareFileData);

      assert.isTrue(buildBody.calledOnce);
      assert.deepEqual(buildBody.firstCall.args, [
        changedFiles,
        coverageDiff,
        totalCoverage,
        compareFileData
      ]);
    });
  });
});
