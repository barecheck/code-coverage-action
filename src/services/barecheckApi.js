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

  // eslint-disable-next-line no-console
  console.log(response);

  if (!response.data && !response.data.createGithubAccessToken.success) {
    throw new Error(
      "Couldn't fetch access token for Github application. Check if you use the correct `BARECHECK_GITHUB_APP_TOKEN`"
    );
  }

  return response.data.createGithubAccessToken;
};

module.exports = {
  createGithubAccessToken
};
