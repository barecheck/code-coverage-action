const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const defaultMocks = {
  createComment: () => null,
  updateComment: () => null,
  findComment: () => null
};

const createOrUpdateCommentMock = (mocks) => {
  const { createComment, updateComment, findComment } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire("../../src/github/createOrUpdateComment", {
    "./createComment": createComment,
    "./updateComment": updateComment,
    "./findComment": findComment
  });
};

describe("github/createOrUpdateComment", () => {
  it("updateComment should be called once", async () => {
    const findCommentText = "find text";
    const findCommentRes = { id: 5 };
    const body = "body";

    const findComment = sinon.stub().returns(findCommentRes);
    const updateComment = sinon.stub().returns(findCommentRes);
    const createComment = sinon.stub().returns(findCommentRes);

    const createOrUpdateComment = createOrUpdateCommentMock({
      findComment,
      updateComment,
      createComment
    });

    await createOrUpdateComment(findCommentText, body);

    assert.isTrue(findComment.calledOnce);
    assert.isTrue(updateComment.calledOnce);

    assert.deepEqual(updateComment.firstCall.args, [findCommentRes.id, body]);
  });

  it("createComment should be called once", async () => {
    const findCommentText = "find text";
    const findCommentRes = undefined;
    const body = "body";

    const findComment = sinon.stub().returns(findCommentRes);
    const updateComment = sinon.stub().returns(findCommentRes);
    const createComment = sinon.stub().returns(findCommentRes);

    const createOrUpdateComment = createOrUpdateCommentMock({
      findComment,
      updateComment,
      createComment
    });

    await createOrUpdateComment(findCommentText, body);

    assert.isTrue(findComment.calledOnce);
    assert.isTrue(createComment.calledOnce);

    assert.deepEqual(createComment.firstCall.args, [body]);
  });
});
