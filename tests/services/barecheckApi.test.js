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
      assert.fail("createGithubAccessToken should throiw an error");
    } catch {
      assert.isTrue(axios.post.calledOnce);
    }
  });
});
