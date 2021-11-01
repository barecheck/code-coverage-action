const axios = require("axios");

const { barecheckApiUrl } = require("../config");

const makeRequest = async (query, variables) => {
  const { data } = await axios.post(
    barecheckApiUrl,
    {
      query,
      variables
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return data;
};

const createGithubAccessToken = async (githubAppToken) => {
  const query = `mutation createGithubAccessToken($githubAppToken: String!) {
    createGithubAccessToken(githubAppToken:$githubAppToken) {
      success
      code
      token
    }
  }`;

  const variables = {
    githubAppToken
  };

  const response = await makeRequest(query, variables);

  if (!response.data || !response.data.createGithubAccessToken.success) {
    throw new Error(
      "Couldn't fetch access token for Github application. Check if you use the correct `BARECHECK_GITHUB_APP_TOKEN`"
    );
  }

  return response.data.createGithubAccessToken;
};

const setProjectMetric = async (apiKey, ref, sha, coverage) => {
  const query = `mutation setProjectMetric($apiKey: String!, $ref: String!, $sha: String!, $coverage: Float!) {
    setProjectMetric(apiKey: $apiKey, ref: $ref, sha: $sha, coverage: $coverage) {
      code
      success
      projectMetricId
    }
  }
  `;

  const variables = {
    apiKey,
    ref,
    sha,
    coverage
  };

  const response = await makeRequest(query, variables);

  if (!response.data || !response.data.setProjectMetric.success) {
    throw new Error(
      "Couldn't send your project metric. Check if `BARECHECK_API_KEY` property set correctly and restart action"
    );
  }

  return response.data.setProjectMetric;
};

const getProjectMetric = async (apiKey, ref, sha) => {
  const query = `query projectMetric($apiKey: String!, $ref: String!, $sha: String!) {
    projectMetric(apiKey: $apiKey, ref:$ref, sha:$sha){
      projectId
      ref
      sha
      coverage
      createdAt
    }
  }
  `;

  const variables = {
    apiKey,
    ref,
    sha
  };

  const response = await makeRequest(query, variables);

  if (!response.data) {
    return null;
  }

  return response.data.projectMetric;
};

module.exports = {
  createGithubAccessToken,
  setProjectMetric,
  getProjectMetric
};
