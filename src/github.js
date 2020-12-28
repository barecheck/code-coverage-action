const github = require('@actions/github');

const sendComment = async (token, diff, totalCoverage) => {
  const octokit = github.getOctokit(token);

  if (github.context.payload.pull_request) {
    await octokit.issues.createComment({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      issue_number: github.context.payload.pull_request.number,
      body: `<h4>Code coverage report</h4>Total: <b>${totalCoverage}%</b>:\n\nYour percentage difference: <b>${diff}%</b>`
    });
  }
};
module.exports = {
  sendComment
};
