const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const actionsCoreStub = require("../stubs/actionsCore.stub");

const defaultMocks = {
  ...actionsCoreStub,
  uncoveredFileLinesByFileNames: () => null,
  mergeFileLinesWithChangedFiles: () => null,
  github: {
    context: {
      payload: {
        pull_request: {}
      }
    }
  }
};

const showAnnotationsMock = (mocks) => {
  const {
    github,
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
    "@actions/github": github,
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

    it("any logic should not be called once there is no pull_request payload", async () => {
      const showAnnotationsInput = true;
      const compareFileData = [];
      const getChangedFiles = sinon.spy();
      const github = {
        context: {
          payload: {}
        }
      };
      const { showAnnotations } = showAnnotationsMock({
        showAnnotationsInput,
        getChangedFiles,
        github
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
        `::warning file=${filename},line=${line}::${line} line is not covered with tests`
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
      assert.equal(info.callCount, 4);
      assert.deepEqual(info.secondCall.args, [
        `::warning file=${filename},line=1,endLine=4::1-4 lines are not covered with tests`
      ]);
    });
  });
});
