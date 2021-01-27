const {
  percentage,
  getUncoveredFilesLines,
  getGroupedUncoveredFileLines
} = require('../src/lcov');
const { assert } = require('chai');

describe('lcov', () => {
  describe('percentage', () => {
    it('should return percentage based on received lines', () => {
      const parsedLcovFile = [
        {
          lines: {
            hit: 5,
            found: 10
          }
        },
        {
          lines: {
            hit: 5,
            found: 10
          }
        },
        {
          lines: {
            hit: 10,
            found: 20
          }
        }
      ];

      const res = percentage(parsedLcovFile);

      assert.deepEqual(res, '50.00');
    });

    it('result should be fixed to 2 symbols after comma', () => {
      const parsedLcovFile = [
        {
          lines: {
            hit: 3,
            found: 10
          }
        },
        {
          lines: {
            hit: 23,
            found: 51
          }
        }
      ];

      const res = percentage(parsedLcovFile);

      assert.deepEqual(res, '42.62');
    });
  });

  describe('getUncoveredFilesLines', () => {
    it('should return uncovered lines with file', () => {
      const lcovData = [
        {
          lines: {
            found: 16,
            hit: 10,
            details: [
              { line: 1, hit: 1 },
              { line: 3, hit: 1 },
              { line: 4, hit: 0 },
              { line: 5, hit: 0 },
              { line: 6, hit: 0 },
              { line: 7, hit: 0 },
              { line: 8, hit: 0 },
              { line: 10, hit: 0 },
              { line: 15, hit: 1 },
              { line: 16, hit: 2 },
              { line: 17, hit: 2 },
              { line: 18, hit: 2 },
              { line: 19, hit: 5 },
              { line: 20, hit: 5 },
              { line: 23, hit: 2 },
              { line: 26, hit: 1 }
            ]
          },
          file: 'src/lcov.js'
        }
      ];

      const res = getUncoveredFilesLines(lcovData);

      assert.deepEqual(res, [
        {
          file: 'src/lcov.js',
          lines: [4, 5, 6, 7, 8, 10]
        }
      ]);
    });

    it('should return empty array', () => {
      const lcovData = [];
      const res = getUncoveredFilesLines(lcovData);

      assert.isEmpty(res);
    });

    it('should return empty array once all lines are covered', () => {
      const lcovData = [
        {
          lines: {
            found: 16,
            hit: 10,
            details: [
              { line: 1, hit: 1 },
              { line: 3, hit: 2 }
            ]
          },
          file: 'src/lcov.js'
        }
      ];
      const res = getUncoveredFilesLines(lcovData);

      assert.isEmpty(res);
    });
  });

  describe('getGroupedUncoveredFileLines', () => {
    it('should return grouped lines array', () => {
      const filesLines = [
        {
          file: 'src/lcov.js',
          lines: [4, 5, 6, 7, 8, 10]
        }
      ];

      const res = getGroupedUncoveredFileLines(filesLines);
      assert.deepEqual(res, [
        {
          file: 'src/lcov.js',
          lines: [[4, 8], 10]
        }
      ]);
    });

    it('should return grouped lines array along with single values', () => {
      const filesLines = [
        {
          file: 'src/lcov.js',
          lines: [4, 5, 6, 7, 8, 10, 14, 15]
        }
      ];

      const res = getGroupedUncoveredFileLines(filesLines);
      assert.deepEqual(res, [
        {
          file: 'src/lcov.js',
          lines: [[4, 8], 10, [14, 15]]
        }
      ]);
    });

    it('should return grouped lines array along with single values at the end', () => {
      const filesLines = [
        {
          file: 'src/lcov.js',
          lines: [4, 6, 7, 8, 10, 14, 15, 19]
        }
      ];

      const res = getGroupedUncoveredFileLines(filesLines);
      assert.deepEqual(res, [
        {
          file: 'src/lcov.js',
          lines: [4, [6, 8], 10, [14, 15], 19]
        }
      ]);
    });
  });
});
