const github = require('@actions/github');

const sendComment = async (token, diff, totalCoverage) => {
  const octokit = github.getOctokit(token);
  const arrow = diff === 0 ? '' : diff < 0 ? '▾' : '▴';

  if (github.context.payload.pull_request) {
    await octokit.issues.createComment({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      issue_number: github.context.payload.pull_request.number,
      body: `<h3>Code coverage report</h3>Total: <b>${totalCoverage}%</b>:\n\nYour code coverage diff: <b>${diff}% ${arrow}</b>`
    });
  }
};
module.exports = {
  sendComment
};
