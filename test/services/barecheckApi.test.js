const sinon = require("sinon");
const { assert } = require("chai");

const { importMock } = require("../utils");

const path = "services/barecheckApi";

const defaultStubValues = {
  axios: {}
};

const barecheckApiMock = importMock(path, defaultStubValues, ({ axios }) => ({
  axios
}));

describe(path, () => {
  describe("createGithubAccessToken", () => {
    it("should call axios post with proper params", async () => {
      const githubAppToken = "github-token:123";
      const mutationResponse = {
        data: {
          data: {
            createGithubAccessToken: {
              success: true
            }
          }
        }
      };
      const axios = {
        post: sinon.stub().returns(mutationResponse)
      };

      const { createGithubAccessToken } = barecheckApiMock({
        axios
      });

      await createGithubAccessToken(githubAppToken);

      assert.isTrue(axios.post.calledOnce);
      const [requestPath, body, headers] = axios.post.firstCall.args;
      assert.deepEqual(requestPath, "https://api.barecheck.com/graphql");
      assert.deepEqual(body.variables, { githubAppToken });
      assert.deepEqual(headers, {
        headers: {
          "Content-Type": "application/json"
        }
      });
    });

    it("should return data with token from response", async () => {
      const githubAppToken = "github-token:123";
      const token = "1234";

      const mutationResponse = {
        data: {
          data: {
            createGithubAccessToken: {
              success: true,
              token
            }
          }
        }
      };
      const axios = {
        post: sinon.stub().returns(mutationResponse)
      };

      const { createGithubAccessToken } = barecheckApiMock({
        axios
      });

      const res = await createGithubAccessToken(githubAppToken);

      assert.deepEqual(res, mutationResponse.data.data.createGithubAccessToken);
    });

    it("should throw error once mutation doesn't have succes:True", async () => {
      const githubAppToken = "github-token:123";

      const mutationResponse = {
        data: {
          data: {
            createGithubAccessToken: {
              success: false
            }
          }
        }
      };
      const axios = {
        post: sinon.stub().returns(mutationResponse)
      };

      const { createGithubAccessToken } = barecheckApiMock({
        axios
      });

      try {
        await createGithubAccessToken(githubAppToken);
        assert.fail("createGithubAccessToken should throw an error");
      } catch {
        assert.isTrue(axios.post.calledOnce);
      }
    });

    it("should throw error once there is no data in the response", async () => {
      const githubAppToken = "github-token:123";

      const mutationResponse = {
        errors: ["some error"]
      };
      const axios = {
        post: sinon.stub().returns(mutationResponse)
      };

      const { createGithubAccessToken } = barecheckApiMock({
        axios
      });

      try {
        await createGithubAccessToken(githubAppToken);
        assert.fail("createGithubAccessToken should throw an error");
      } catch {
        assert.isTrue(axios.post.calledOnce);
      }
    });
  });

  describe("setProjectMetric", () => {
    it("should call axios post with proper params", async () => {
      const apiKey = "api-key";
      const ref = "master";
      const sha = "e2e2e2";
      const coverage = 93;

      const mutationResponse = {
        data: {
          data: {
            setProjectMetric: {
              success: true
            }
          }
        }
      };
      const axios = {
        post: sinon.stub().returns(mutationResponse)
      };

      const { setProjectMetric } = barecheckApiMock({
        axios
      });

      await setProjectMetric(apiKey, ref, sha, coverage);

      assert.isTrue(axios.post.calledOnce);
      const [requestPath, body, headers] = axios.post.firstCall.args;
      assert.deepEqual(requestPath, "https://api.barecheck.com/graphql");
      assert.deepEqual(body.variables, { apiKey, ref, sha, coverage });
      assert.deepEqual(headers, {
        headers: {
          "Content-Type": "application/json"
        }
      });
    });

    it("should throw error once there is no data in the response", async () => {
      const apiKey = "api-key";
      const ref = "master";
      const sha = "e2e2e2";
      const coverage = 93;

      const mutationResponse = {
        errors: ["some error"]
      };

      const axios = {
        post: sinon.stub().returns(mutationResponse)
      };

      const { setProjectMetric } = barecheckApiMock({
        axios
      });

      try {
        await setProjectMetric(apiKey, ref, sha, coverage);
        assert.fail("createGithubAccessToken should throw an error");
      } catch {
        assert.isTrue(axios.post.calledOnce);
      }
    });

    it("should throw error once mutation doesn't have succes:True", async () => {
      const apiKey = "api-key";
      const ref = "master";
      const sha = "e2e2e2";
      const coverage = 93;

      const mutationResponse = {
        data: {
          data: {
            setProjectMetric: {
              success: false
            }
          }
        }
      };

      const axios = {
        post: sinon.stub().returns(mutationResponse)
      };

      const { setProjectMetric } = barecheckApiMock({
        axios
      });

      try {
        await setProjectMetric(apiKey, ref, sha, coverage);
        assert.fail("createGithubAccessToken should throw an error");
      } catch {
        assert.isTrue(axios.post.calledOnce);
      }
    });
  });

  describe("getProjectMetric", () => {
    it("should call axios post with proper params", async () => {
      const apiKey = "api-key";
      const ref = "master";
      const sha = "e2e2e2";
      const coverage = 93;
      const projectId = 2;

      const queryResponse = {
        data: {
          data: {
            projectMetric: {
              ref,
              sha,
              projectId,
              coverage
            }
          }
        }
      };
      const axios = {
        post: sinon.stub().returns(queryResponse)
      };

      const { getProjectMetric } = barecheckApiMock({
        axios
      });

      const actualRes = await getProjectMetric(apiKey, ref, sha);

      assert.isTrue(axios.post.calledOnce);
      const [requestPath, body, headers] = axios.post.firstCall.args;
      assert.deepEqual(requestPath, "https://api.barecheck.com/graphql");
      assert.deepEqual(body.variables, { apiKey, ref, sha });
      assert.deepEqual(headers, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      assert.deepEqual(actualRes, queryResponse.data.data.projectMetric);
    });

    it("should return null from api", async () => {
      const apiKey = "api-key";
      const ref = "master";
      const sha = "e2e2e2";

      const queryResponse = {
        data: {
          data: null
        }
      };
      const axios = {
        post: sinon.stub().returns(queryResponse)
      };

      const { getProjectMetric } = barecheckApiMock({
        axios
      });

      const actualRes = await getProjectMetric(apiKey, ref, sha);

      assert.isTrue(axios.post.calledOnce);
      assert.isNull(actualRes);
    });
  });
});
