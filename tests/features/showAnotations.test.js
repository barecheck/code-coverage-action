const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const actionsCoreStub = require("../stubs/actionsCore.stub");

const defaultMocks = {
  ...actionsCoreStub,
  uncoveredFileLinesByFileNames: () => null,
  mergeFileLinesWithChangedFiles: () => null
};

const showAnotationsMock = (mocks) => {
  const {
    showAnotationsInput,
    getChangedFiles,
    uncoveredFileLinesByFileNames,
    mergeFileLinesWithChangedFiles,
    getInput,
    info,
    setFailed
  } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire("../../src/features/showAnotations", {
    "@actions/core": { getInput, info, setFailed },
    "../github/getChangedFiles": getChangedFiles,
    "../lcov": { uncoveredFileLinesByFileNames },
    "../coverage": { mergeFileLinesWithChangedFiles },
    "../input": { getShowAnotations: () => showAnotationsInput }
  });
};

describe("features/showAnotations", () => {
  describe("showAnotations", () => {
    it("any logic should not be called once flag is False", async () => {
      const showAnotationsInput = false;
      const compareFileData = [];
      const getChangedFiles = sinon.spy();
      const { showAnotations } = showAnotationsMock({
        showAnotationsInput,
        getChangedFiles
      });

      await showAnotations(compareFileData);

      assert.isFalse(getChangedFiles.calledOnce);
    });

    it("core.info should be called once for single line warning", async () => {
      const showAnotationsInput = "warning";
      const compareFileData = [];
      const filename = "src/tets.js";
      const line = 2;

      const getChangedFiles = sinon.stub().returns([{ filename }]);
      const uncoveredFileLinesByFileNames = sinon.stub().returns([]);
      const mergeFileLinesWithChangedFiles = sinon.stub().returns([
        {
          file: filename,
          lines: [line]
        }
      ]);
      const info = sinon.spy();

      const { showAnotations } = showAnotationsMock({
        showAnotationsInput,
        getChangedFiles,
        uncoveredFileLinesByFileNames,
        mergeFileLinesWithChangedFiles,
        info
      });

      await showAnotations(compareFileData);

      assert.isTrue(getChangedFiles.calledOnce);
      assert.isTrue(uncoveredFileLinesByFileNames.calledOnce);
      assert.isTrue(mergeFileLinesWithChangedFiles.calledOnce);
      assert.isTrue(info.calledTwice);
      assert.deepEqual(info.secondCall.args, [
        `::warning file=${filename}::${line} lines are not covered with tests`
      ]);
    });

    it("core.info should be called once for multilines line warning", async () => {
      const showAnotationsInput = "warning";
      const compareFileData = [];
      const filename = "src/tets.js";

      const getChangedFiles = sinon.stub().returns([{ filename }]);
      const uncoveredFileLinesByFileNames = sinon.stub().returns([]);
      const mergeFileLinesWithChangedFiles = sinon.stub().returns([
        {
          file: filename,
          lines: [[1, 4], 8, [45, 50]]
        }
      ]);
      const info = sinon.spy();

      const { showAnotations } = showAnotationsMock({
        showAnotationsInput,
        getChangedFiles,
        uncoveredFileLinesByFileNames,
        mergeFileLinesWithChangedFiles,
        info
      });

      await showAnotations(compareFileData);

      assert.isTrue(getChangedFiles.calledOnce);
      assert.isTrue(uncoveredFileLinesByFileNames.calledOnce);
      assert.isTrue(mergeFileLinesWithChangedFiles.calledOnce);
      assert.isTrue(info.calledTwice);
      assert.deepEqual(info.secondCall.args, [
        `::warning file=${filename}::1-4, 8, 45-50 lines are not covered with tests`
      ]);
    });
  });
});
