const createComment = require("./createComment");
const updateComment = require("./updateComment");
const findComment = require("./findComment");

/**
 * Create or Update Github comment based if part of comment found
 */
const createOrUpdateComment = async (findCommentText, body) => {
  const comment = await findComment(findCommentText);

  return comment ? updateComment(comment.id, body) : createComment(body);
};

module.exports = createOrUpdateComment;
