const github = require('@actions/github');

const sendComment = async (token, diff) => {
  const octokit = github.getOctokit(token);

  await octokit.issues.createComment({
    repo: github.context.repo.repo,
    owner: github.context.repo.owner,
    issue_number: github.context.payload.pull_request.number,
    body: `Your percentage difference is ${diff}`
  });
};
module.exports = {
  sendComment
};
