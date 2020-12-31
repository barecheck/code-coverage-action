const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { assert } = require('chai');

const actionsCoreStub = require('../stubs/actionsCore.stub');

const defaultMocks = {
  ...actionsCoreStub
};

const minCoverageRatioMock = (mocks) => {
  const { getInput, info, setFailed } = { ...defaultMocks, ...mocks };
  return proxyquire('../../src/features/minCoverageRatio', {
    '@actions/core': { getInput, info, setFailed }
  });
};

describe('eatures/minCoverageRatio', () => {
  describe('checkCoverageRation', () => {
    it("error shouldn't be thrown once feature is not enabled", () => {
      const minCoverageRatio = NaN;
      const coverageDiff = 0;

      const getInput = sinon
        .stub()
        .withArgs('minimum-coverage-ratio')
        .returns(minCoverageRatio);
      const setFailed = sinon.spy();

      const { checkCoverageRation } = minCoverageRatioMock({
        getInput,
        setFailed
      });
      const res = checkCoverageRation(coverageDiff);

      assert.isUndefined(res);
      assert.isFalse(setFailed.calledOnce);
    });

    it("error shouldn't be thrown once coverage diff is zero", () => {
      const minCoverageRatio = 0;
      const coverageDiff = 0;

      const getInput = sinon
        .stub()
        .withArgs('minimum-coverage-ratio')
        .returns(minCoverageRatio);
      const setFailed = sinon.spy();

      const { checkCoverageRation } = minCoverageRatioMock({
        getInput,
        setFailed
      });
      const res = checkCoverageRation(coverageDiff);

      assert.isUndefined(res);
      assert.isFalse(setFailed.calledOnce);
    });

    it('should call setFailed once coverage is less than minimum coverage ratio', () => {
      const minCoverageRatio = 5;
      const coverageDiff = -10;

      const getInput = sinon
        .stub()
        .withArgs('minimum-coverage-ratio')
        .returns(minCoverageRatio);
      const setFailed = sinon.spy();

      const { checkCoverageRation } = minCoverageRatioMock({
        getInput,
        setFailed
      });
      const res = checkCoverageRation(coverageDiff);

      assert.isUndefined(res);
      assert.isTrue(setFailed.calledOnce);
    });
  });
});
