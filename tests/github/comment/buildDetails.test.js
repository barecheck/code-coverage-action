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
        lines: [4, [6, 8], 10, [14, 15], 19],
        github: { blob_url: 'github/test.txt' }
      },
      {
        file: 'src/test2.js',
        lines: [101],
        github: { blob_url: 'github/test2.txt' }
      }
    ];

    const buildDetails = getBuildDetailsMock();

    const details = buildDetails(fileLines);

    assert.deepEqual(
      details,
      '<details><summary>Uncovered files and lines</summary><table><tbody><tr><th>File</th><th>Lines</th></tr><tr><td><a href="github/test.txt">src/test.js</a></td><td><a href="github/test.txt#L4">4</a>, <a href="github/test.txt#L6-L8">6-8</a>, <a href="github/test.txt#L10">10</a>, <a href="github/test.txt#L14-L15">14-15</a>, <a href="github/test.txt#L19">19</a></td></tr><tr><td><a href="github/test2.txt">src/test2.js</a></td><td><a href="github/test2.txt#L101">101</a></td></tr></tbody></table></details>'
    );
  });
});
