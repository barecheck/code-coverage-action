const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const actionsCoreStub = require("../stubs/actionsCore.stub");

const defaultMocks = {
  ...actionsCoreStub,
  barecheckApi: {},
  getBarecheckApiKey: () => null,
  getBaseRefSha: () => null,
  getCurrentRefSha: () => null
};

const apiLibMock = (mocks) => {
  const {
    info,
    barecheckApi,
    getBarecheckApiKey,
    getBaseRefSha,
    getCurrentRefSha
  } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire("../../src/lib/api", {
    "@actions/core": { info },
    barecheck: { barecheckApi },
    "../input": { getBarecheckApiKey },
    "./github": { getBaseRefSha, getCurrentRefSha }
  });
};

describe("lib/api", () => {
  describe("getBaseBranchCoverage()", () => {
    it("shoudl return false when there is no sha or ref", async () => {
      const project = { id: 1 };
      const accessToken = "access-token-str";
      const totalCoverage = 91.05;
      const sha = "sha-1";
      const ref = "ref-1";
      const getBaseRefSha = sinon.stub().returns({ ref, sha });
      const authProject = sinon.stub().returns({ project, accessToken });
      const coverageMetrics = sinon.stub().returns([{ totalCoverage }]);

      const barecheckApi = {
        authProject,
        coverageMetrics
      };

      const { cleanAuthProject, getBaseBranchCoverage } = apiLibMock({
        getBaseRefSha,
        barecheckApi
      });

      const res = await getBaseBranchCoverage();
      cleanAuthProject(); // clean projectAuth state

      assert.equal(res, totalCoverage);
      assert.isTrue(authProject.calledOnce);
    });
  });

  describe("sendCurrentCoverage()", () => {
    it("shoudl return false when there is no sha or ref", async () => {
      const project = { id: 1 };
      const accessToken = "access-token-str";
      const totalCoverage = 91.05;
      const sha = "sha-1";
      const ref = "ref-1";
      const getCurrentRefSha = sinon.stub().returns({ ref, sha });
      const authProject = sinon.stub().returns({ project, accessToken });
      const createCoverageMetric = sinon.stub().returns(null);

      const barecheckApi = {
        authProject,
        createCoverageMetric
      };

      const { cleanAuthProject, sendCurrentCoverage } = apiLibMock({
        getCurrentRefSha,
        barecheckApi
      });

      await sendCurrentCoverage(totalCoverage);
      cleanAuthProject(); // clean projectAuth state

      assert.isTrue(createCoverageMetric.calledOnce);
      assert.deepEqual(createCoverageMetric.firstCall.args, [
        accessToken,
        {
          projectId: project.id,
          ref,
          sha,
          totalCoverage
        }
      ]);
    });
  });

  describe("authProject()", () => {
    it("shoudl return projectId and accessToken", async () => {
      const project = { id: 1 };
      const accessToken = "access-token-str";
      const apiKey = "test-api-key";
      const getBarecheckApiKey = sinon.stub().returns(apiKey);

      const barecheckApi = {
        authProject: sinon.stub().returns({ project, accessToken })
      };

      const { cleanAuthProject, authProject } = apiLibMock({
        getBarecheckApiKey,
        barecheckApi
      });

      const res = await authProject();
      cleanAuthProject(); // clean projectAuth state

      assert.isTrue(barecheckApi.authProject.calledOnce);
      assert.deepEqual(barecheckApi.authProject.firstCall.args, [{ apiKey }]);
      assert.deepEqual(res, { projectId: project.id, accessToken });
    });

    it("shoudl return projectId and accessToken from cache", async () => {
      const project = { id: 1 };
      const accessToken = "access-token-str";
      const apiKey = "test-api-key";
      const getBarecheckApiKey = sinon.stub().returns(apiKey);

      const barecheckApi = {
        authProject: sinon.stub().returns({ project, accessToken })
      };

      const { cleanAuthProject, authProject } = apiLibMock({
        getBarecheckApiKey,
        barecheckApi
      });

      await authProject();
      const res = await authProject();
      cleanAuthProject(); // clean projectAuth state

      assert.isTrue(barecheckApi.authProject.calledOnce);
      assert.deepEqual(barecheckApi.authProject.firstCall.args, [{ apiKey }]);
      assert.deepEqual(res, { projectId: project.id, accessToken });
    });
  });
});
