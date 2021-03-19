const sinon = require("sinon");

const actionsCoreStub = {
  info: sinon.spy(),
  setFailed: sinon.spy(),
  getInput: sinon.spy()
};

module.exports = actionsCoreStub;
