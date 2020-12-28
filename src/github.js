const github = require('@actions/github');

const sendComment = async (token, diff, totalCoverage) => {
  const octokit = github.getOctokit(token);

  const diffColor = diff > 0 ? '#24a148' : '#da1e28';

  if (github.context.payload.pull_request) {
    await octokit.issues.createComment({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      issue_number: github.context.payload.pull_request.number,
      body: `<h3>Code coverage report</h3>Total: <b>${totalCoverage}%</b>:\n\nYour percentage difference: <b style="color:${diffColor};">${diff}%</b>`
    });
  }
};
module.exports = {
  sendComment
};
