// const proxyquire = require('proxyquire');
// const sinon = require('sinon');
// const { assert } = require('chai');

// // TODO: create default @actions/core stub that might be reused through all tests
// const defaultMocks = {
//   info: sinon.spy()
// };

// const minCoverageRatioMock = (mocks) => {
//   const { getInput, info } = { ...defaultMocks, ...mocks };
//   return proxyquire('../../src/features/minCoverageRatio', {
//     '@actions/core': { getInput, info }
//   });
// };

// describe('eatures/minCoverageRatio', () => {
//   describe('checkCoverageRation', () => {
//     it("error shouldn't be thrown once feature is not enabled", () => {
//       const minCoverageRatio = NaN;
//       const coverageDiff = 0;

//       const getInput = sinon
//         .stub()
//         .withArgs('minimum-coverage-ratio')
//         .returns(minCoverageRatio);

//       const { checkCoverageRation } = minCoverageRatioMock({ getInput });
//       const res = checkCoverageRation(coverageDiff);

//       assert.isUndefined(res);
//     });

//     it("error shouldn't be thrown once coverage diff is zero", () => {
//       const minCoverageRatio = 0;
//       const coverageDiff = 0;

//       const getInput = sinon
//         .stub()
//         .withArgs('minimum-coverage-ratio')
//         .returns(minCoverageRatio);

//       const { checkCoverageRation } = minCoverageRatioMock({ getInput });
//       const res = checkCoverageRation(coverageDiff);

//       assert.isUndefined(res);
//     });

//     it('should thow error once coverage is less than minimum coverage ratio', () => {
//       const minCoverageRatio = 5;
//       const coverageDiff = -10;

//       const getInput = sinon
//         .stub()
//         .withArgs('minimum-coverage-ratio')
//         .returns(minCoverageRatio);

//       const { checkCoverageRation } = minCoverageRatioMock({ getInput });

//       assert.throws(
//         () => checkCoverageRation(coverageDiff),
//         'Code coverage is less than minimum code coverage ratio'
//       );
//     });
//   });
// });
