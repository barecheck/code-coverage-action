const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const defaultMocks = {
  getGithubToken: () => null,
  getBarecheckGithubAppToken: () => undefined,
  getOctokit: () => null,
  createGithubAccessToken: () => null
};

const getOctokitClientMock = (mocks) => {
  const {
    getGithubToken,
    getOctokit,
    getBarecheckGithubAppToken,
    createGithubAccessToken
  } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire("../../src/github/getOctokitClient", {
    "@actions/github": { getOctokit },
    "../input": { getGithubToken, getBarecheckGithubAppToken },
    "../services/barecheckApi": { createGithubAccessToken }
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

    try {
      await getOctokitClient();
      assert.fail("getOctokitClient should throiw an error");
    } catch (e) {
      assert.isFalse(getOctokit.calledOnce);
      assert.isTrue(getGithubToken.calledOnce);
    }
  });

  it("should return octokit client", async () => {
    const octokit = { test: 1 };
    const getGithubToken = sinon.stub().returns("32332223");
    const getOctokit = sinon.stub().returns(octokit);

    const getOctokitClient = getOctokitClientMock({
      getGithubToken,
      getOctokit
    });

    assert.equal(await getOctokitClient(), octokit);
  });

  it("should call `createGithubAccessToken` with `barecheckGithubAppToken`", async () => {
    const octokit = { test: 1 };
    const barecheckGithubAppToken = "test-api-token:123";
    const getGithubToken = sinon.stub().returns(false);
    const createGithubAccessToken = sinon.stub().returns({});
    const getOctokit = sinon.stub().returns(octokit);
    const getBarecheckGithubAppToken = sinon
      .stub()
      .returns(barecheckGithubAppToken);

    const getOctokitClient = getOctokitClientMock({
      getGithubToken,
      getBarecheckGithubAppToken,
      createGithubAccessToken,
      getOctokit
    });

    await getOctokitClient();

    assert.isTrue(getOctokit.calledOnce);
    assert.isTrue(getBarecheckGithubAppToken.calledOnce);
    assert.isTrue(createGithubAccessToken.calledOnce);
    assert.deepEqual(createGithubAccessToken.firstCall.args, [
      barecheckGithubAppToken
    ]);
  });
});
