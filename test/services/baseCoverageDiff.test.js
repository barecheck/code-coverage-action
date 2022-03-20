const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const actionsCoreStub = require("../stubs/actionsCore.stub");

const defaultMocks = {
  ...actionsCoreStub,
  parseLcovFile: () => null,
  getBaseLcovFile: () => false
};

const getBaseCoverageDiffMock = (mocks) => {
  const { parseLcovFile, getInput, info, setFailed, getBaseLcovFile } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire("../../src/services/baseCoverageDiff", {
    barecheck: { parseLcovFile },
    "@actions/core": { getInput, info, setFailed },
    "../input": { getBaseLcovFile }
  });
};

describe("services/baseCoverageDiff", () => {
  it("should return diff between current and based branch coverage", async () => {
    const baseLcovFilePath = "./test/coverage.lcov";
    const coverage = {
      percentage: 85
    };
    const baseCoverage = {
      percentage: 80
    };

    const getBaseLcovFile = sinon.stub().returns(baseLcovFilePath);
    const parseLcovFile = sinon
      .stub()
      .withArgs(baseLcovFilePath)
      .returns(baseCoverage);

    const getBaseCoverageDiff = getBaseCoverageDiffMock({
      getBaseLcovFile,
      parseLcovFile
    });
    const res = await getBaseCoverageDiff(coverage);

    assert.equal(res, "5.00");
  });
});
