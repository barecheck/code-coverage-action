// const lcov = require('../src/lcov');
// const { assert } = require('chai');

// describe('lcov', () => {
//   describe('percentage', () => {
//     it('should return percentage based on received lines', () => {
//       const parsedLcovFile = [
//         {
//           lines: {
//             hit: 5,
//             found: 10
//           }
//         },
//         {
//           lines: {
//             hit: 5,
//             found: 10
//           }
//         },
//         {
//           lines: {
//             hit: 10,
//             found: 20
//           }
//         }
//       ];

//       const res = lcov.percentage(parsedLcovFile);

//       assert.deepEqual(res, '50.00');
//     });

//     it('result should be fixed to 2 symbols after comma', () => {
//       const parsedLcovFile = [
//         {
//           lines: {
//             hit: 3,
//             found: 10
//           }
//         },
//         {
//           lines: {
//             hit: 23,
//             found: 51
//           }
//         }
//       ];

//       const res = lcov.percentage(parsedLcovFile);

//       assert.deepEqual(res, '42.62');
//     });
//   });
// });
