const { GitHub, context } = require('@actions/github');

const sendComment = async (token, diff) => {
  await new GitHub(token).issues.createComment({
    repo: context.repo.repo,
    owner: context.repo.owner,
    issue_number: context.payload.pull_request.number,
    body: `Your percentage difference is ${diff}`
  });
};

module.exports = {
  sendComment
};
