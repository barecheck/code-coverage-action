const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const defaultMocks = {
  githubApi: () => null,
  getOctokit: () => true,
  getPullRequestContext: () => ({}),
  getWorkspacePath: () => null
};

const getChangedFilesCoverageMock = (mocks) => {
  const { githubApi, getPullRequestContext, getOctokit, getWorkspacePath } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire("../../src/services/changedFilesCoverage", {
    "@barecheck/core": { githubApi },
    "../lib/github": { getPullRequestContext, getOctokit },
    "../input": { getWorkspacePath }
  });
};

describe("services/changedFilesCoverage", () => {
  it("show return list of changed files with coverage", async () => {
    const pullRequestContext = {
      repo: "barecheck",
      owner: "barecheck",
      pullNumber: 123
    };
    const octokit = {
      test: 85
    };
    const changedFiles = [
      {
        filename: "changed1.js",
        blob_url: "https://github.com/pull/1"
      },
      {
        filename: "changed2.js",
        blob_url: "https://github.com/pull/2"
      }
    ];

    const coverage = {
      data: [
        {
          file: "changed1.js",
          lines: [1, 2],
          url: "https://github.com/pull/1"
        },
        {
          file: "not changed 3.js",
          lines: [1, 2]
        }
      ]
    };

    const getChangedFiles = sinon.stub().returns(changedFiles);

    const getPullRequestContext = sinon.stub().returns(pullRequestContext);
    const getOctokit = sinon.stub().returns(octokit);
    const githubApi = {
      getChangedFiles
    };

    const getChangedFilesCoverage = getChangedFilesCoverageMock({
      getPullRequestContext,
      getOctokit,
      githubApi
    });
    const res = await getChangedFilesCoverage(coverage);

    assert.deepEqual(res, [
      {
        file: "changed1.js",
        lines: [1, 2],
        url: "https://github.com/pull/1"
      }
    ]);
  });

  it("show return coverage data when there is not Pull Request context", async () => {
    const pullRequestContext = false;
    const coverage = {
      data: [
        {
          file: "changed1.js",
          lines: [1, 2]
        },
        {
          file: "not changed 3.js",
          lines: [1, 2]
        }
      ]
    };

    const getChangedFiles = sinon.spy();

    const getPullRequestContext = sinon.stub().returns(pullRequestContext);
    const getOctokit = sinon.spy();
    const githubApi = {
      getChangedFiles
    };

    const getChangedFilesCoverage = getChangedFilesCoverageMock({
      getPullRequestContext,
      getOctokit,
      githubApi
    });
    const res = await getChangedFilesCoverage(coverage);

    assert.deepEqual(res, coverage.data);
    assert.isFalse(getChangedFiles.calledOnce);
    assert.isFalse(getOctokit.calledOnce);
  });

  it("show return coverage data when workspace path is set", async () => {
    const pullRequestContext = {
      repo: "barecheck",
      owner: "barecheck",
      pullNumber: 123
    };
    const changedFiles = [
      {
        filename: "workspace/app1/changed1.js",
        blob_url: "https://github.com/pull/1"
      },
      {
        filename: "workspace/app2/changed2.js",
        blob_url: "https://github.com/pull/2"
      }
    ];

    const coverage = {
      data: [
        {
          file: "changed1.js",
          lines: [1, 2]
        },
        {
          file: "changed2.js",
          lines: [1, 2]
        }
      ]
    };

    const getChangedFiles = sinon.stub().returns(changedFiles);

    const getPullRequestContext = sinon.stub().returns(pullRequestContext);
    const getOctokit = sinon.spy();
    const getWorkspacePath = sinon.stub().returns("workspace/app1");
    const githubApi = {
      getChangedFiles
    };

    const getChangedFilesCoverage = getChangedFilesCoverageMock({
      getPullRequestContext,
      getOctokit,
      githubApi,
      getWorkspacePath
    });
    const res = await getChangedFilesCoverage(coverage);

    assert.deepEqual(res, [
      {
        file: "workspace/app1/changed1.js",
        lines: [1, 2],
        url: "https://github.com/pull/1"
      }
    ]);
    assert.isTrue(getChangedFiles.calledOnce);
    assert.isTrue(getOctokit.calledOnce);
  });
});
