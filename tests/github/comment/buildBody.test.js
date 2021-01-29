const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { assert } = require('chai');
const buildDetails = require('../../../src/github/comment/buildDetails');

const defaultMocks = {
  buildCommentDetails: () => null,
  uncoveredFileLinesByFileNames: () => [],
  mergeFileLinesWithChangedFiles: () => []
};

const buildBodyMock = (mocks) => {
  const {
    buildCommentDetails,
    uncoveredFileLinesByFileNames,
    mergeFileLinesWithChangedFiles
  } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire('../../../src/github/comment/buildBody', {
    './buildDetails': buildCommentDetails,
    '../../lcov': { uncoveredFileLinesByFileNames },
    '../../coverage': { mergeFileLinesWithChangedFiles }
  });
};

describe('github/comment/buildDetails', () => {
  it('buildCommentDetails should be called with proper args once changedFiles arr is empty', async () => {
    const changedFiles = [];
    const coverageDiff = 1;
    const totalCoverage = 3;
    const compareFileData = [];
    const uncoveredFileLines = [{ test: 1 }];
    const fileLinesWithChangedFiles = [{ some: 4 }];

    const uncoveredFileLinesByFileNames = sinon
      .stub()
      .returns(uncoveredFileLines);

    const mergeFileLinesWithChangedFiles = sinon
      .stub()
      .returns(fileLinesWithChangedFiles);
    const buildCommentDetails = sinon.stub().returns('');

    const buildBody = buildBodyMock({
      buildCommentDetails,
      uncoveredFileLinesByFileNames,
      mergeFileLinesWithChangedFiles
    });

    const body = await buildBody(
      changedFiles,
      coverageDiff,
      totalCoverage,
      compareFileData
    );

    assert.isTrue(buildCommentDetails.calledOnce);
    assert.deepEqual(buildCommentDetails.firstCall.args, [
      fileLinesWithChangedFiles
    ]);
  });

  it('buildCommentDetails should be called with proper args when we have changed files', async () => {
    const changedFiles = [
      {
        filename: 'test.txt'
      }
    ];
    const coverageDiff = 1;
    const totalCoverage = 3;
    const compareFileData = [];
    const uncoveredFileLines = [{ test: 1 }];
    const fileLinesWithChangedFiles = [{ some: 4 }];

    const uncoveredFileLinesByFileNames = sinon
      .stub()
      .returns(uncoveredFileLines);

    const mergeFileLinesWithChangedFiles = sinon
      .stub()
      .returns(fileLinesWithChangedFiles);
    const buildCommentDetails = sinon.stub().returns('');

    const buildBody = buildBodyMock({
      buildCommentDetails,
      uncoveredFileLinesByFileNames,
      mergeFileLinesWithChangedFiles
    });

    const body = await buildBody(
      changedFiles,
      coverageDiff,
      totalCoverage,
      compareFileData
    );

    assert.isTrue(uncoveredFileLinesByFileNames.calledOnce);
    assert.deepEqual(uncoveredFileLinesByFileNames.firstCall.args, [
      ['test.txt'],
      compareFileData
    ]);
    assert.isTrue(buildCommentDetails.calledOnce);
    assert.deepEqual(buildCommentDetails.firstCall.args, [
      fileLinesWithChangedFiles
    ]);
  });

  it('should return body text', async () => {
    const changedFiles = [];
    const coverageDiff = 1;
    const totalCoverage = 3;
    const compareFileData = [];
    const uncoveredFileLines = [];
    const fileLinesWithChangedFiles = [];
    const commentDetailsMessage = 'detailed message';

    const uncoveredFileLinesByFileNames = sinon
      .stub()
      .returns(uncoveredFileLines);

    const mergeFileLinesWithChangedFiles = sinon
      .stub()
      .returns(fileLinesWithChangedFiles);
    const buildCommentDetails = sinon.stub().returns(commentDetailsMessage);

    const buildBody = buildBodyMock({
      buildCommentDetails,
      uncoveredFileLinesByFileNames,
      mergeFileLinesWithChangedFiles
    });

    const body = await buildBody(
      changedFiles,
      coverageDiff,
      totalCoverage,
      compareFileData
    );

    assert.deepEqual(
      body,
      '<h3>Barecheck - Code coverage report</h3>Total: <b>3%</b>\n\nYour code coverage diff: <b>1% ▴</b>\n\ndetailed message'
    );
  });

  [
    [-10, '▾'],
    [10, '▴'],
    [0, false]
  ].forEach(([coverageDiff, arrow]) => {
    it(`should return body text with ${arrow}`, async () => {
      const changedFiles = [];
      const totalCoverage = 3;
      const compareFileData = [];
      const uncoveredFileLines = [];
      const fileLinesWithChangedFiles = [];
      const commentDetailsMessage = 'detailed message';

      const uncoveredFileLinesByFileNames = sinon
        .stub()
        .returns(uncoveredFileLines);

      const mergeFileLinesWithChangedFiles = sinon
        .stub()
        .returns(fileLinesWithChangedFiles);
      const buildCommentDetails = sinon.stub().returns(commentDetailsMessage);

      const buildBody = buildBodyMock({
        buildCommentDetails,
        uncoveredFileLinesByFileNames,
        mergeFileLinesWithChangedFiles
      });

      const body = await buildBody(
        changedFiles,
        coverageDiff,
        totalCoverage,
        compareFileData
      );

      if (arrow) {
        assert.isTrue(body.includes(arrow));
      } else {
        assert.isFalse(body.includes('▾'));
        assert.isFalse(body.includes('▴'));
      }
    });
  });
});
