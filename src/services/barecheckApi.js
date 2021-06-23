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

  const { data } = await makeRequest(query, variables);

  if (!data.createGithubAccessToken.success) {
    throw new Error(
      "Couldn't fetch access token for Github application. Check if you use the correct `BARECHECK_GITHUB_APP_TOKEN`"
    );
  }

  return data.createGithubAccessToken;
};

module.exports = {
  createGithubAccessToken
};
