const github = require('@actions/github');
const getOctokitClient = require('./getOctokitClient');

/**
 * Updates Github comments based on received params
 *  */
const updateComment = async (commentId, body) => {
  const octokit = getOctokitClient();
  console.log('commentId', commentId);

  const { data } = await octokit.request(
    'PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}',
    {
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      comment_id: commentId,
      body
    }
  );

  return data;
};

module.exports = updateComment;
