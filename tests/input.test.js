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
  describe("getShowAnotations", () => {
    it("should return False once input is empty", () => {
      const getInput = sinon.stub().withArgs("show-anotations").returns("");

      const { getShowAnotations } = inputMock({ getInput });

      const res = getShowAnotations();

      assert.isFalse(res);
    });

    it("should return 'warning' value", () => {
      const expectedRes = "warning";
      const getInput = sinon
        .stub()
        .withArgs("show-anotations")
        .returns(expectedRes);

      const { getShowAnotations } = inputMock({ getInput });

      const res = getShowAnotations();

      assert.equal(res, expectedRes);
    });

    it("should return 'error' value", () => {
      const expectedRes = "error";
      const getInput = sinon
        .stub()
        .withArgs("show-anotations")
        .returns(expectedRes);

      const { getShowAnotations } = inputMock({ getInput });

      const res = getShowAnotations();

      assert.equal(res, expectedRes);
    });

    it("should throw error once value is not one of the allowed", () => {
      const getInput = sinon
        .stub()
        .withArgs("show-anotations")
        .returns("undefined");

      const { getShowAnotations } = inputMock({ getInput });

      assert.throws(
        () => getShowAnotations(),
        "'show-anotations' param should be empty or one of the following options warning,error"
      );
    });
  });
});
