const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { assert } = require('chai');

const defaultMocks = {
  github: () => ({ context: {} }),
  octokitClient: { request: () => null }
};

const getChangedFilesMock = (mocks) => {
  const { octokitClient, github } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire('../../src/github/getChangedFiles', {
    './getOctokitClient': () => octokitClient,
    '@actions/github': github
  });
};

describe('github/getChangedFiles', () => {
  it('octokit.request should be called once', async () => {
    const repo = 'tesstRepo';
    const owner = 'testOwner';
    const pullNumber = 123;

    const changedFiles = { data: [{ test: 1 }] };
    const github = {
      context: {
        repo: { repo, owner },
        payload: { pull_request: { number: pullNumber } }
      }
    };

    const octokitClient = { request: sinon.stub().returns(changedFiles) };

    const getChangedFiles = getChangedFilesMock({ octokitClient, github });

    const res = await getChangedFiles();

    assert.isTrue(octokitClient.request.calledOnce);
    assert.deepEqual(octokitClient.request.firstCall.args, [
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
      {
        repo,
        owner,
        pull_number: pullNumber,
        per_page: 100
      }
    ]);
    assert.deepEqual(res, changedFiles.data);
  });
});
