const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const defaultMocks = {
  getGithubToken: () => null,
  getOctokit: () => null
};

const getOctokitClientMock = (mocks) => {
  const { getGithubToken, getOctokit } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire("../../src/github/getOctokitClient", {
    "@actions/github": { getOctokit },
    "../input": { getGithubToken }
  });
};

describe("github/getOctokitClient", () => {
  it("should throw error once token is undefined", async () => {
    const getGithubToken = sinon.stub().returns(false);
    const getOctokit = sinon.spy();

    const getOctokitClient = getOctokitClientMock({
      getGithubToken,
      getOctokit
    });

    assert.throws(
      () => getOctokitClient(),
      "github-token property is required"
    );

    assert.isFalse(getOctokit.calledOnce);
    assert.isTrue(getGithubToken.calledOnce);
  });

  it("should return octokit client", async () => {
    const octokit = { test: 1 };
    const getGithubToken = sinon.stub().returns("32332223");
    const getOctokit = sinon.stub().returns(octokit);

    const getOctokitClient = getOctokitClientMock({
      getGithubToken,
      getOctokit
    });

    assert.equal(getOctokitClient(), octokit);
  });
});
