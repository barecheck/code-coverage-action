const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const actionsCoreStub = require("../stubs/actionsCore.stub");

const defaultMocks = {
  ...actionsCoreStub,
  github: {},
  githubApi: {},
  getBarecheckGithubAppToken: () => null,
  getGithubToken: () => null
};

const getGitHubLibMock = (mocks) => {
  const { github, githubApi, getBarecheckGithubAppToken, getGithubToken } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire("../../src/lib/github", {
    "@actions/github": github,
    "@barecheck/core": { githubApi },
    "../input": { getBarecheckGithubAppToken, getGithubToken }
  });
};

describe("lib/github", () => {
  describe("getPullRequestContext()", () => {
    it("should return value from github context", () => {
      const github = {
        context: {
          repo: {
            owner: "barecheck",
            repo: "barecheck"
          },
          payload: {
            pull_request: {
              number: 123
            }
          }
        }
      };
      const { getPullRequestContext } = getGitHubLibMock({ github });

      const pullRequestContext = getPullRequestContext();

      assert.deepEqual(pullRequestContext, {
        owner: "barecheck",
        repo: "barecheck",
        pullNumber: 123
      });
    });

    it("should return false when there is no Pull request context", () => {
      const github = {
        context: {
          repo: {
            owner: "barecheck",
            repo: "barecheck"
          },
          payload: {}
        }
      };
      const { getPullRequestContext } = getGitHubLibMock({ github });

      const pullRequestContext = getPullRequestContext();

      assert.isFalse(pullRequestContext);
    });
  });

  describe("getOctokit()", () => {
    it("should return octokit from githubApi.createOctokitClient", async () => {
      const octokit = { test: 2 };
      const createOctokitClient = sinon.stub().returns(octokit);
      const getBarecheckGithubAppToken = sinon.stub().returns("app-token");
      const getGithubToken = sinon.stub().returns("github-token");

      const githubApi = {
        createOctokitClient
      };

      const { getOctokit, cleanOctokit } = getGitHubLibMock({
        githubApi,
        getBarecheckGithubAppToken,
        getGithubToken
      });

      await getOctokit();
      const resOctokit = await getOctokit();
      cleanOctokit();

      assert.equal(resOctokit, octokit);
      assert.isTrue(createOctokitClient.calledOnce);
    });
  });

  describe("getBaseRefSha()", () => {
    it("should return ref from Pull Request context", async () => {
      const github = {
        context: {
          ref: "some-unused-ref",
          payload: {
            before: "some-unused-sha",
            pull_request: {
              base: {
                ref: "feat-some-test-branch",
                sha: "7e1102a88c46b7816221fc2318c8289149229fae"
              }
            }
          }
        }
      };

      const { getBaseRefSha } = getGitHubLibMock({
        github
      });

      const { ref, sha } = await getBaseRefSha();

      assert.equal(ref, "feat-some-test-branch");
      assert.equal(sha, "7e1102a88c46b7816221fc2318c8289149229fae");
    });

    it("should return ref from github context", async () => {
      const github = {
        context: {
          ref: "feat-some-test-branch",
          payload: {
            before: "7e1102a88c46b7816221fc2318c8289149229fae"
          }
        }
      };

      const { getBaseRefSha } = getGitHubLibMock({
        github
      });

      const { ref, sha } = await getBaseRefSha();

      assert.equal(ref, "feat-some-test-branch");
      assert.equal(sha, "7e1102a88c46b7816221fc2318c8289149229fae");
    });

    it("should clean ref from heads prefix", async () => {
      const github = {
        context: {
          ref: "refs/heads/feat-some-test-branch",
          payload: {
            before: "7e1102a88c46b7816221fc2318c8289149229fae"
          }
        }
      };

      const { getBaseRefSha } = getGitHubLibMock({
        github
      });

      const { ref, sha } = await getBaseRefSha();

      assert.equal(ref, "feat-some-test-branch");
      assert.equal(sha, "7e1102a88c46b7816221fc2318c8289149229fae");
    });
  });

  describe("getCurrentRefSha()", () => {
    it("should return ref from Pull Request context", async () => {
      const github = {
        context: {
          ref: "some-unused-ref",
          sha: "7e1102a88c46b7816221fc2318c8289149229fae",
          payload: {
            pull_request: {
              head: {
                ref: "feat-some-test-branch"
              }
            }
          }
        }
      };

      const { getCurrentRefSha } = getGitHubLibMock({
        github
      });

      const { ref, sha } = await getCurrentRefSha();

      assert.equal(ref, "feat-some-test-branch");
      assert.equal(sha, "7e1102a88c46b7816221fc2318c8289149229fae");
    });

    it("should return ref from github context", async () => {
      const github = {
        context: {
          ref: "feat-some-test-branch",
          sha: "7e1102a88c46b7816221fc2318c8289149229fae",
          payload: {}
        }
      };

      const { getCurrentRefSha } = getGitHubLibMock({
        github
      });

      const { ref, sha } = await getCurrentRefSha();

      assert.equal(ref, "feat-some-test-branch");
      assert.equal(sha, "7e1102a88c46b7816221fc2318c8289149229fae");
    });

    it("should clean ref from heads prefix", async () => {
      const github = {
        context: {
          ref: "refs/heads/feat-some-test-branch",
          sha: "7e1102a88c46b7816221fc2318c8289149229fae",
          payload: {}
        }
      };

      const { getCurrentRefSha } = getGitHubLibMock({
        github
      });

      const { ref, sha } = await getCurrentRefSha();

      assert.equal(ref, "feat-some-test-branch");
      assert.equal(sha, "7e1102a88c46b7816221fc2318c8289149229fae");
    });
  });
});
