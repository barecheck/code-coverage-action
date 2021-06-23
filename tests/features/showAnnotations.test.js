const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const actionsCoreStub = require("../stubs/actionsCore.stub");

const defaultMocks = {
  ...actionsCoreStub,
  uncoveredFileLinesByFileNames: () => null,
  mergeFileLinesWithChangedFiles: () => null
};

const showAnnotationsMock = (mocks) => {
  const {
    showAnnotationsInput,
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
  return proxyquire("../../src/features/showAnnotations", {
    "@actions/core": { getInput, info, setFailed },
    "../github/getChangedFiles": getChangedFiles,
    "../lcov": { uncoveredFileLinesByFileNames },
    "../coverage": { mergeFileLinesWithChangedFiles },
    "../input": { getShowAnnotations: () => showAnnotationsInput }
  });
};

describe("features/showAnnotations", () => {
  describe("showAnnotations", () => {
    it("any logic should not be called once flag is False", async () => {
      const showAnnotationsInput = false;
      const compareFileData = [];
      const getChangedFiles = sinon.spy();
      const { showAnnotations } = showAnnotationsMock({
        showAnnotationsInput,
        getChangedFiles
      });

      await showAnnotations(compareFileData);

      assert.isFalse(getChangedFiles.calledOnce);
    });

    it("core.info should be called once for single line warning", async () => {
      const showAnnotationsInput = "warning";
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

      const { showAnnotations } = showAnnotationsMock({
        showAnnotationsInput,
        getChangedFiles,
        uncoveredFileLinesByFileNames,
        mergeFileLinesWithChangedFiles,
        info
      });

      await showAnnotations(compareFileData);

      assert.isTrue(getChangedFiles.calledOnce);
      assert.isTrue(uncoveredFileLinesByFileNames.calledOnce);
      assert.isTrue(mergeFileLinesWithChangedFiles.calledOnce);
      assert.isTrue(info.calledTwice);
      assert.deepEqual(info.secondCall.args, [
        `::warning file=${filename}::${line} line is not covered with tests`
      ]);
    });

    it("core.info should be called once for multilines line warning", async () => {
      const showAnnotationsInput = "warning";
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

      const { showAnnotations } = showAnnotationsMock({
        showAnnotationsInput,
        getChangedFiles,
        uncoveredFileLinesByFileNames,
        mergeFileLinesWithChangedFiles,
        info
      });

      await showAnnotations(compareFileData);

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
