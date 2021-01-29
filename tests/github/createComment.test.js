const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { assert } = require('chai');

const defaultMocks = {
  github: () => ({ context: {} }),
  octokitClient: { request: () => null }
};

const createCommentMock = (mocks) => {
  const { octokitClient, github } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire('../../src/github/createComment', {
    './getOctokitClient': () => octokitClient,
    '@actions/github': github
  });
};

describe('github/createComment', () => {
  it('octokit.issues.createComment should be called once', async () => {
    const body = 'some body';
    const repo = 'tesstRepo';
    const owner = 'testOwner';
    const pullNumber = 123;

    const createCommentRes = { test: 1 };
    const github = {
      context: {
        repo: { repo, owner },
        payload: { pull_request: { number: pullNumber } }
      }
    };

    const octokitClient = {
      issues: { createComment: sinon.stub().returns(createCommentRes) }
    };

    const createComment = createCommentMock({ octokitClient, github });

    const res = await createComment(body);

    assert.isTrue(octokitClient.issues.createComment.calledOnce);
    assert.deepEqual(octokitClient.issues.createComment.firstCall.args, [
      {
        repo,
        owner,
        issue_number: pullNumber,
        body
      }
    ]);
    assert.deepEqual(res, createCommentRes);
  });
});
