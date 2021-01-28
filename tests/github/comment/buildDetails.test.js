const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { assert } = require('chai');

const defaultMocks = {
  context: {}
};

const getBuildDetailsMock = (mocks) => {
  const { getInput, info, setFailed, octokit, context } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire('../../../src/github/comment/buildDetails', {
    '@actions/github': { context }
  });
};

describe('github/comment/buildDetails', () => {
  it('should return details block with formatted content', async () => {
    const fileLines = [
      {
        file: 'src/test.js',
        lines: [4, [6, 8], 10, [14, 15], 19]
      },
      {
        file: 'src/test2.js',
        lines: [101]
      }
    ];

    const buildDetails = getBuildDetailsMock();

    const details = buildDetails(fileLines);

    assert.deepEqual(
      details,
      '<details><summary>Coverage Report</summary><table><tbody><tr><th>File</th><th>Uncovered Lines</th></tr><tr><td><a href="/">src/test.js </a></td><td><a href="/">4 </a>, <a href="/">6-8</a>, <a href="/">10 </a>, <a href="/">14-15</a>, <a href="/">19 </a></td></tr>,<tr><td><a href="/">src/test2.js </a></td><td><a href="/">101 </a></td></tr></tbody></table></details>'
    );
  });
});
