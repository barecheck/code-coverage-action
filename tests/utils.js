const proxyquire = require("proxyquire").noCallThru();

const importMock = (path, defaultStubValues, stubsFunc) => (stubValues) =>
  proxyquire(
    `../src/${path}`,
    stubsFunc({ ...defaultStubValues, ...stubValues })
  );

module.exports = { importMock };
