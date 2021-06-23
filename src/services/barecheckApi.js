const axios = require("axios");

const { barecheckApiUrl } = require("../config");

const createGithubAccessToken = async (githubAppToken) => {
  const { data } = await axios.post(
    barecheckApiUrl,
    {
      query: `mutation createGithubAccessToken($githubAppToken: String!) {
        createGithubAccessToken(githubAppToken:$githubAppToken) {
          success
          code
          token
        }
      }`,
      variables: {
        githubAppToken
      }
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  // eslint-disable-next-line no-console
  console.log(data);
  // TODO: check if success

  return data.createGithubAccessToken;
};

module.exports = {
  createGithubAccessToken
};
