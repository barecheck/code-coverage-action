const github = require("@actions/github");
const getOctokitClient = require("./getOctokitClient");

/**
 * Find Github comment based received part of text
 *  */
const findComment = async (bodyText) => {
  const octokit = await getOctokitClient();

  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      issue_number: github.context.payload.pull_request.number,
      per_page: 100
    }
  );

  const comment = data.find(({ body }) => body.includes(bodyText));

  return comment;
};

module.exports = findComment;
