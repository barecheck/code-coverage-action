const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { assert } = require('chai');

const defaultMocks = {
  getInput: () => null,
  getOctokit: () => null
};

const getOctokitClientMock = (mocks) => {
  const { getInput, getOctokit } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire('../../src/github/getOctokitClient', {
    '@actions/github': { getOctokit },
    '@actions/core': { getInput }
  });
};

describe('github/getOctokitClient', () => {
  it('should throw error once token is undefined', async () => {
    const getInput = sinon.stub().returns(false);
    const getOctokit = sinon.spy();

    const getOctokitClient = getOctokitClientMock({ getInput, getOctokit });

    assert.throws(
      () => getOctokitClient(),
      'github-token property is required'
    );

    assert.isFalse(getOctokit.calledOnce);
    assert.isTrue(getInput.calledOnce);
  });

  it('should return octokit client', async () => {
    const octokit = { test: 1 };
    const getInput = sinon.stub().returns('32332223');
    const getOctokit = sinon.stub().returns(octokit);

    const getOctokitClient = getOctokitClientMock({ getInput, getOctokit });

    assert.equal(getOctokitClient(), octokit);
  });
});
