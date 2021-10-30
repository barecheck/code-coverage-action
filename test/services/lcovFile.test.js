const sinon = require("sinon");
const { assert } = require("chai");

const { importMock } = require("../utils");

const path = "services/lcovFile";

const defaultStubValues = {
  fs: {
    readFileSync: () => null
  },
  lcov: {
    parse: () => null,
    percentage: () => null
  }
};

const lcovFileMock = importMock(path, defaultStubValues, ({ lcov, fs }) => ({
  "../lcov": lcov,
  fs
}));

describe(path, () => {
  describe("getCoverageFromFile", () => {
    it("should coverage and parsed lcov data", async () => {
      const coverageFilePath = "dir/file.lcov";

      const fileRaw = "some file data";
      const data = [
        {
          test: 1
        }
      ];

      const percentage = 50;

      const fs = {
        readFileSync: sinon.stub().returns(fileRaw)
      };
      const lcov = {
        parse: sinon.stub().returns(data),
        percentage: sinon.stub().returns(percentage)
      };

      const { getCoverageFromFile } = lcovFileMock({
        fs,
        lcov
      });

      const actualRes = await getCoverageFromFile(coverageFilePath);

      assert.isTrue(lcov.parse.calledOnce);
      assert.isTrue(lcov.percentage.calledOnce);
      assert.isTrue(fs.readFileSync.calledOnce);

      assert.deepEqual(fs.readFileSync.firstCall.args, [
        coverageFilePath,
        "utf8"
      ]);
      assert.deepEqual(lcov.parse.firstCall.args, [fileRaw]);
      assert.deepEqual(lcov.percentage.firstCall.args, [data]);

      assert.deepEqual(actualRes, { data, percentage });
    });

    it("should throw exception if there is file", async () => {
      const coverageFilePath = "dir/file.lcov";

      const fs = {
        readFileSync: sinon.stub().returns(null)
      };
      const lcov = {
        parse: sinon.spy(),
        percentage: sinon.spy()
      };

      const { getCoverageFromFile } = lcovFileMock({
        fs,
        lcov
      });

      try {
        await getCoverageFromFile(coverageFilePath);
        assert.fail("getCoverageFromFile should throw an error");
      } catch {
        assert.isTrue(fs.readFileSync.calledOnce);
        assert.isFalse(lcov.parse.calledOnce);
        assert.isFalse(lcov.percentage.calledOnce);

        assert.deepEqual(fs.readFileSync.firstCall.args, [
          coverageFilePath,
          "utf8"
        ]);
      }
    });
  });
});
