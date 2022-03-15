const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { assert } = require("chai");

const actionsCoreStub = require("./stubs/actionsCore.stub");

const defaultMocks = {
  ...actionsCoreStub
};

const inputMock = (mocks) => {
  const { getInput } = { ...defaultMocks, ...mocks };

  return proxyquire("../src/input", {
    "@actions/core": { getInput }
  });
};

describe("input", () => {
  describe("getShowAnnotations", () => {
    it("should return False once input is empty", () => {
      const getInput = sinon.stub().withArgs("show-annotations").returns("");

      const { getShowAnnotations } = inputMock({ getInput });

      const res = getShowAnnotations();

      assert.isFalse(res);
    });

    it("should return 'warning' value", () => {
      const expectedRes = "warning";
      const getInput = sinon
        .stub()
        .withArgs("show-annotations")
        .returns(expectedRes);

      const { getShowAnnotations } = inputMock({ getInput });

      const res = getShowAnnotations();

      assert.equal(res, expectedRes);
    });

    it("should return 'error' value", () => {
      const expectedRes = "error";
      const getInput = sinon
        .stub()
        .withArgs("show-annotations")
        .returns(expectedRes);

      const { getShowAnnotations } = inputMock({ getInput });

      const res = getShowAnnotations();

      assert.equal(res, expectedRes);
    });

    it("should throw error once value is not one of the allowed", () => {
      const getInput = sinon
        .stub()
        .withArgs("show-annotations")
        .returns("undefined");

      const { getShowAnnotations } = inputMock({ getInput });

      assert.throws(
        () => getShowAnnotations(),
        "'show-annotations' param should be empty or one of the following options warning,error"
      );
    });
  });
  describe("getBarecheckGithubAppToken", () => {
    it("should returnvalue from getInput core function", () => {
      const expectedRes = "token:124";
      const getInput = sinon
        .stub()
        .withArgs("barecheck-github-app-token")
        .returns(expectedRes);

      const { getBarecheckGithubAppToken } = inputMock({ getInput });

      const res = getBarecheckGithubAppToken();

      assert.equal(res, expectedRes);
    });
  });

  describe("getLcovFile", () => {
    it("should return value from getInput core function", () => {
      const expectedRes = "path-lcov-file";
      const getInput = sinon.stub().withArgs("lcov-file").returns(expectedRes);

      const { getLcovFile } = inputMock({ getInput });

      const res = getLcovFile();

      assert.equal(res, expectedRes);
    });
  });

  describe("getBaseLcovFile", () => {
    [
      { input: "value1", expected: "value1" },
      { input: "", expected: false },
      { input: "false", expected: false },
      { input: "False", expected: false }
    ].forEach(({ input, expected }) =>
      it(`should return ${expected} when  'base-lcov-file=${input}'`, () => {
        const expectedRes = "path-lcov-file";
        const getInput = sinon
          .stub()
          .withArgs("base-lcov-file")
          .returns(expectedRes);

        const { getBaseLcovFile } = inputMock({ getInput });

        const res = getBaseLcovFile();

        assert.equal(res, expectedRes);
      })
    );
  });

  describe("getBarecheckApiKey", () => {
    [
      { input: "value1", expected: "value1" },
      { input: "", expected: false },
      { input: "false", expected: false },
      { input: "False", expected: false }
    ].forEach(({ input, expected }) =>
      it(`should return ${expected} when  'barecheck-api-key=${input}'`, () => {
        const expectedRes = "path-lcov-file";
        const getInput = sinon
          .stub()
          .withArgs("barecheck-api-key")
          .returns(expectedRes);

        const { getBarecheckApiKey } = inputMock({ getInput });

        const res = getBarecheckApiKey();

        assert.equal(res, expectedRes);
      })
    );
  });
});
