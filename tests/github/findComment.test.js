const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { assert } = require('chai');

const defaultMocks = {
  github: () => ({ context: {} }),
  octokitClient: { request: () => null }
};

const findCommentMock = (mocks) => {
  const { octokitClient, github } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire('../../src/github/findComment', {
    './getOctokitClient': () => octokitClient,
    '@actions/github': github
  });
};

describe('github/findComment', () => {
  it('octokit.request should be called once', async () => {
    const bodyText = 'some body';
    const body = 'not match';
    const repo = 'tesstRepo';
    const owner = 'testOwner';
    const pullNumber = 123;

    const findCommentRes = { data: [{ body }] };
    const github = {
      context: {
        repo: { repo, owner },
        payload: { pull_request: { number: pullNumber } }
      }
    };

    const octokitClient = { request: sinon.stub().returns(findCommentRes) };

    const findComment = findCommentMock({ octokitClient, github });

    const res = await findComment(bodyText);

    assert.isTrue(octokitClient.request.calledOnce);
    assert.deepEqual(octokitClient.request.firstCall.args, [
      'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        repo,
        owner,
        issue_number: 123,
        per_page: 100
      }
    ]);
    assert.isUndefined(res);
  });

  it('should find one comment by text', async () => {
    const bodyText = 'some';
    const body = 'some text';
    const repo = 'tesstRepo';
    const owner = 'testOwner';
    const pullNumber = 123;

    const findCommentRes = { data: [{ body }] };
    const github = {
      context: {
        repo: { repo, owner },
        payload: { pull_request: { number: pullNumber } }
      }
    };

    const octokitClient = { request: sinon.stub().returns(findCommentRes) };

    const findComment = findCommentMock({ octokitClient, github });

    const res = await findComment(bodyText);

    assert.isTrue(octokitClient.request.calledOnce);
    assert.deepEqual(octokitClient.request.firstCall.args, [
      'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        repo,
        owner,
        issue_number: 123,
        per_page: 100
      }
    ]);
    assert.deepEqual(res, findCommentRes.data[0]);
  });
});
