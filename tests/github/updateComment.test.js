const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { assert } = require('chai');

const defaultMocks = {
  github: () => ({ context: {} }),
  octokitClient: { request: () => null }
};

const updateCommentMock = (mocks) => {
  const { octokitClient, github } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire('../../src/github/updateComment', {
    './getOctokitClient': () => octokitClient,
    '@actions/github': github
  });
};

describe('github/updateComment', () => {
  it('octokit.issues.updateComment should be called once', async () => {
    const body = 'some body';
    const repo = 'tesstRepo';
    const owner = 'testOwner';
    const commentId = 123;

    const updateCommentRes = { data: { test: 1 } };
    const github = {
      context: {
        repo: { repo, owner }
      }
    };

    const octokitClient = { request: sinon.stub().returns(updateCommentRes) };

    const updateComment = updateCommentMock({ octokitClient, github });

    const res = await updateComment(commentId, body);

    assert.isTrue(octokitClient.request.calledOnce);
    assert.deepEqual(octokitClient.request.firstCall.args, [
      'PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}',
      {
        repo,
        owner,
        comment_id: commentId,
        body
      }
    ]);
    assert.deepEqual(res, updateCommentRes.data);
  });
});
