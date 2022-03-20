const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const actionsCoreStub = require("../stubs/actionsCore.stub");

const defaultMocks = {
  ...actionsCoreStub
};

const showAnnotationsMock = (mocks) => {
  const {
    getPullRequestContext,
    getShowAnnotations,
    getInput,
    info,
    setFailed
  } = {
    ...defaultMocks,
    ...mocks
  };
  return proxyquire("../../src/services/showAnnotations", {
    "@actions/core": { getInput, info, setFailed },
    "../input": { getShowAnnotations },
    "../lib/github": { getPullRequestContext }
  });
};

describe("services/showAnnotations", () => {
  [
    { showAnnotationsInput: false, pullRequestContext: false },
    { showAnnotationsInput: true, pullRequestContext: false },
    { showAnnotationsInput: false, pullRequestContext: { owner: "barecheck" } }
  ].forEach(({ showAnnotationsInput, pullRequestContext }) =>
    it(`core.info should not be called when showAnnotationsInput=${showAnnotationsInput}, pullRequestContext=${pullRequestContext}`, async () => {
      const getShowAnnotations = sinon.stub().returns(showAnnotationsInput);
      const getPullRequestContext = sinon.stub().returns(pullRequestContext);
      const info = sinon.spy();
      const coverageData = [];

      const showAnnotations = showAnnotationsMock({
        getShowAnnotations,
        getPullRequestContext,
        info
      });

      await showAnnotations(coverageData);

      assert.isFalse(info.calledOnce);
    })
  );

  it("core.info should be called once for multilines line warning", async () => {
    const getShowAnnotations = sinon.stub().returns("warning");
    const getPullRequestContext = sinon.stub().returns({});
    const info = sinon.spy();

    const filename = "src/coverage.js";
    const coverageData = [
      {
        file: filename,
        lines: [[1, 4], 8, [45, 50]]
      }
    ];

    const showAnnotations = showAnnotationsMock({
      getShowAnnotations,
      getPullRequestContext,
      info
    });

    await showAnnotations(coverageData);

    assert.equal(info.callCount, 4);
    assert.deepEqual(info.secondCall.args, [
      `::warning file=${filename},line=1,endLine=4::1-4 lines are not covered with tests`
    ]);
  });

  it("core.info should be called once for single line warning", async () => {
    const getShowAnnotations = sinon.stub().returns("warning");
    const getPullRequestContext = sinon.stub().returns({});
    const info = sinon.spy();

    const filename = "src/coverage.js";
    const line = 2;
    const coverageData = [
      {
        file: filename,
        lines: [line]
      }
    ];

    const showAnnotations = showAnnotationsMock({
      getShowAnnotations,
      getPullRequestContext,
      info
    });

    await showAnnotations(coverageData);

    assert.equal(info.callCount, 2);
    assert.deepEqual(info.secondCall.args, [
      `::warning file=${filename},line=${line}::${line} line is not covered with tests`
    ]);
  });
});
