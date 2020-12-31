const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { assert } = require('chai');

const actionsCoreStub = require('../stubs/actionsCore.stub');

const defaultMocks = {
  ...actionsCoreStub,
  octokit: {
    issues: {
      createComment: () => null
    }
  },
  context: {}
};

const sendSummaryCommentMock = (mocks) => {
  const { getInput, info, setFailed, octokit, context } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire('../../src/features/sendSummaryComment', {
    '@actions/core': { getInput, info },
    '@actions/github': { getOctokit: () => octokit, context }
  });
};

describe('features/sendSummaryComment', () => {
  describe('sendSummaryComment', () => {
    it("octokit.issues.createComment shouldn't be called", async () => {
      const sendSummaryCommentInput = false;
      const githubTokenInput = '1-2-3';
      const coverageDiff = 0;
      const totalCoverage = 0;

      const getInput = sinon.stub();
      getInput
        .withArgs('send-summary-comment')
        .returns(sendSummaryCommentInput);
      getInput.withArgs('github-token').returns(githubTokenInput);
      const octokit = {
        issues: {
          createComment: sinon.spy()
        }
      };

      const { sendSummaryComment } = sendSummaryCommentMock({
        getInput,
        octokit
      });
      await sendSummaryComment(coverageDiff, totalCoverage);

      assert.isFalse(octokit.issues.createComment.calledOnce);
    });

    it("octokit.issues.createComment shouldn't be called for not pull request events", async () => {
      const sendSummaryCommentInput = true;
      const githubTokenInput = '1-2-3';
      const coverageDiff = 0;
      const totalCoverage = 0;
      const context = {
        payload: {}
      };

      const getInput = sinon.stub();
      getInput
        .withArgs('send-summary-comment')
        .returns(sendSummaryCommentInput);
      getInput.withArgs('github-token').returns(githubTokenInput);
      const octokit = {
        issues: {
          createComment: sinon.spy()
        }
      };

      const { sendSummaryComment } = sendSummaryCommentMock({
        getInput,
        octokit,
        context
      });
      await sendSummaryComment(coverageDiff, totalCoverage);

      assert.isFalse(octokit.issues.createComment.calledOnce);
    });

    it('octokit.issues.createComment should be called once', async () => {
      const sendSummaryCommentInput = true;
      const githubTokenInput = '1-2-3';
      const coverageDiff = 12;
      const totalCoverage = 65;
      const context = {
        payload: {
          pull_request: {
            number: 123
          }
        },
        repo: {
          repo: 'test repo',
          owner: 'owner repo'
        }
      };

      const getInput = sinon.stub();
      getInput
        .withArgs('send-summary-comment')
        .returns(sendSummaryCommentInput);
      getInput.withArgs('github-token').returns(githubTokenInput);
      const octokit = {
        issues: {
          createComment: sinon.spy()
        }
      };

      const { sendSummaryComment } = sendSummaryCommentMock({
        getInput,
        octokit,
        context
      });
      await sendSummaryComment(coverageDiff, totalCoverage);

      assert.isTrue(octokit.issues.createComment.calledOnce);
    });
  });
});
