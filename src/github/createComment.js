const github = require("@actions/github");
const getOctokitClient = require("./getOctokitClient");

/**
 * Creates Github comments based on received params
 *  */
const createComment = async (body) => {
  const octokit = await getOctokitClient();

  const res = await octokit.rest.issues.createComment({
    repo: github.context.repo.repo,
    owner: github.context.repo.owner,
    issue_number: github.context.payload.pull_request.number,
    body
  });

  return res;
};

module.exports = createComment;
