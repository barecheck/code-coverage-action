const github = require('@actions/github');
const core = require('@actions/core');

const sendSummaryComment = async (diff, totalCoverage) => {
  const githubToken = core.getInput('github-token');
  const sendSummaryComment = core.getInput('send-summary-comment');

  if (sendSummaryComment && github.context.payload.pull_request) {
    core.info(`send-summary-comment is enabled for this workflow`);

    const octokit = github.getOctokit(githubToken);
    const arrow = diff === 0 ? '' : diff < 0 ? '▾' : '▴';

    await octokit.issues.createComment({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      issue_number: github.context.payload.pull_request.number,
      body: `<h3>Code coverage report</h3>Total: <b>${totalCoverage}%</b>:\n\nYour code coverage diff: <b>${diff}% ${arrow}</b>`
    });
  }
};

const getChangedFiles = async () => {
  const githubToken = core.getInput('github-token');

  if (github.context.payload.pull_request) {
    core.info(`get all github PR files`);

    const octokit = github.getOctokit(githubToken);

    const res = await octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
      {
        repo: github.context.repo.repo,
        owner: github.context.repo.owner,
        pull_number: github.context.payload.pull_request.number
      }
    );

    return res;
  }
};
module.exports = {
  sendSummaryComment,
  getChangedFiles
};
