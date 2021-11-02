const sinon = require("sinon");
const { assert } = require("chai");

const { importMock } = require("../utils");

const path = "features/barecheckApi";

const defaultStubValues = {
  github: {
    context: {
      payload: {
        pull_request: {
          base: {
            ref: null,
            sha: null
          },
          head: {
            ref: null,
            sha: null
          }
        }
      }
    }
  },
  getProjectMetric: () => null,
  setProjectMetric: () => null,
  getBarecheckApiKey: () => null
};

const barecheckApiMock = importMock(
  path,
  defaultStubValues,
  ({ github, getProjectMetric, setProjectMetric, getBarecheckApiKey }) => ({
    "@actions/github": github,
    "../services/barecheckApi": { getProjectMetric, setProjectMetric },
    "../input": { getBarecheckApiKey }
  })
);

describe(path, () => {
  describe("getBaseMetric", () => {
    it("should return metrics from getProjectMetric barecheck endpoint", async () => {
      const apiKey = "key-1-2-3";
      const branchName = "test-branch-name";
      const ref = `refs/heads/${branchName}`;
      const sha = "sha";

      const github = {
        context: {
          payload: {
            base_ref: ref,
            pull_request: {
              base: {
                sha
              }
            }
          }
        }
      };

      const expectedResponse = {
        coverage: 123
      };
      const getProjectMetric = sinon.stub().returns(expectedResponse);
      const getBarecheckApiKey = sinon.stub().returns(apiKey);

      const { getBaseMetric } = barecheckApiMock({
        getProjectMetric,
        getBarecheckApiKey,
        github
      });

      const actualRes = await getBaseMetric();

      assert.isTrue(getProjectMetric.calledOnce);
      assert.deepEqual(getProjectMetric.firstCall.args, [
        apiKey,
        branchName,
        sha
      ]);

      assert.deepEqual(actualRes, expectedResponse);
    });

    it("should return null when ref or sha cannot be defined", async () => {
      const apiKey = "key-1-2-3";

      const github = {
        context: {
          payload: {}
        }
      };

      const expectedResponse = {
        coverage: 123
      };
      const getProjectMetric = sinon.stub().returns(expectedResponse);
      const getBarecheckApiKey = sinon.stub().returns(apiKey);

      const { getBaseMetric } = barecheckApiMock({
        getProjectMetric,
        getBarecheckApiKey,
        github
      });

      const actualRes = await getBaseMetric();

      assert.isFalse(getProjectMetric.calledOnce);

      assert.isNull(actualRes);
    });
  });

  describe("sendMetricsToBarecheck", () => {
    it("should send coverage through barecheckApi service", async () => {
      const apiKey = "key-1-2-3";
      const branchName = "test-branch-name";
      const ref = `refs/heads/${branchName}`;
      const sha = "sha";
      const coverage = 123;
      const projectMetricId = 3;

      const github = {
        context: {
          payload: {
            ref,
            sha
          }
        }
      };

      const expectedResponse = {
        projectMetricId
      };
      const setProjectMetric = sinon.stub().returns(expectedResponse);
      const getBarecheckApiKey = sinon.stub().returns(apiKey);

      const { sendMetricsToBarecheck } = barecheckApiMock({
        setProjectMetric,
        getBarecheckApiKey,
        github
      });

      const actualRes = await sendMetricsToBarecheck(coverage);

      assert.isTrue(setProjectMetric.calledOnce);
      assert.deepEqual(setProjectMetric.firstCall.args, [
        apiKey,
        branchName,
        sha,
        coverage
      ]);

      assert.deepEqual(actualRes, expectedResponse.projectMetricId);
    });
  });
});
