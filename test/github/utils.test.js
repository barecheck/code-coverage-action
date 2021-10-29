const { assert } = require("chai");

const { importMock } = require("../utils");

const path = "github/utils";

const defaultStubValues = {
  getAppName: () => ""
};

const buildGithubCommentTitleMock = importMock(
  path,
  defaultStubValues,
  ({ getAppName }) => ({
    "../input": { getAppName }
  })
);

describe(path, () => {
  it("should return default title", async () => {
    const { buildGithubCommentTitle } = buildGithubCommentTitleMock({});

    const githubCommentTitle = buildGithubCommentTitle();

    assert.deepEqual(githubCommentTitle, "Barecheck - Code coverage report");
  });

  it("should return with app name from input", async () => {
    const getAppName = () => "Application 1";
    const { buildGithubCommentTitle } = buildGithubCommentTitleMock({
      getAppName
    });

    const githubCommentTitle = buildGithubCommentTitle();

    assert.deepEqual(
      githubCommentTitle,
      "Application 1 - Code coverage report"
    );
  });
});
