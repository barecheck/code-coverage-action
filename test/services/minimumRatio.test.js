const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const actionsCoreStub = require("../stubs/actionsCore.stub");

const defaultMocks = {
  ...actionsCoreStub
};

const minCoverageRatioMock = (mocks) => {
  const { getInput, info, setFailed } = { ...defaultMocks, ...mocks };
  return proxyquire("../../src/services/minimumRatio", {
    "@actions/core": { getInput, info, setFailed }
  });
};

describe("services/minCoverageRatio", () => {
  describe("checkMinimumRatio", () => {
    it("error shouldn't be thrown once feature is not enabled", () => {
      const minCoverageRatio = NaN;
      const coverageDiff = 0;

      const getInput = sinon
        .stub()
        .withArgs("minimum-ratio")
        .returns(minCoverageRatio);
      const setFailed = sinon.spy();

      const checkMinimumRatio = minCoverageRatioMock({
        getInput,
        setFailed
      });
      const res = checkMinimumRatio(coverageDiff);

      assert.isUndefined(res);
      assert.isFalse(setFailed.calledOnce);
    });

    it("error shouldn't be thrown once coverage diff is zero", () => {
      const minCoverageRatio = 0;
      const coverageDiff = 0;

      const getInput = sinon
        .stub()
        .withArgs("minimum-ratio")
        .returns(minCoverageRatio);
      const setFailed = sinon.spy();

      const checkMinimumRatio = minCoverageRatioMock({
        getInput,
        setFailed
      });
      const res = checkMinimumRatio(coverageDiff);

      assert.isUndefined(res);
      assert.isFalse(setFailed.calledOnce);
    });

    it("should call setFailed once coverage is less than minimum coverage ratio", () => {
      const minCoverageRatio = 5;
      const coverageDiff = -10;

      const getInput = sinon
        .stub()
        .withArgs("minimum-ratio")
        .returns(minCoverageRatio);
      const setFailed = sinon.spy();

      const checkMinimumRatio = minCoverageRatioMock({
        getInput,
        setFailed
      });
      const res = checkMinimumRatio(coverageDiff);

      assert.isUndefined(res);
      assert.isTrue(setFailed.calledOnce);
    });

    it("setFailed should be called if coverageDiff is string", () => {
      const minCoverageRatio = 11;
      const coverageDiff = "-10";

      const getInput = sinon
        .stub()
        .withArgs("minimum-ratio")
        .returns(minCoverageRatio);

      const setFailed = sinon.spy();

      const checkMinimumRatio = minCoverageRatioMock({
        getInput,
        setFailed
      });

      const res = checkMinimumRatio(coverageDiff);

      assert.isUndefined(res);
      assert.isFalse(setFailed.calledOnce);
    });

    it("Supports floats as the ratio, with an acceptable diff amount", () => {
      const minCoverageRatio = 0.5;
      const coverageDiff = "-0.45";

      const getInput = sinon
        .stub()
        .withArgs("minimum-ratio")
        .returns(minCoverageRatio);

      const setFailed = sinon.spy();

      const checkMinimumRatio = minCoverageRatioMock({
        getInput,
        setFailed
      });

      const res = checkMinimumRatio(coverageDiff);

      assert.isUndefined(res);
      assert.isFalse(setFailed.calledOnce);
    });

    it("Supports floats as the ratio, with an unacceptable diff amount", () => {
      const minCoverageRatio = 0.5;
      const coverageDiff = "-0.51";

      const getInput = sinon
        .stub()
        .withArgs("minimum-ratio")
        .returns(minCoverageRatio);

      const setFailed = sinon.spy();

      const checkMinimumRatio = minCoverageRatioMock({
        getInput,
        setFailed
      });

      const res = checkMinimumRatio(coverageDiff);

      assert.isUndefined(res);
      assert.isTrue(setFailed.calledOnce);
    });
  });
});
