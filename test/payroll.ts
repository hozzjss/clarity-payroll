import {
  Client,
  Provider,
  ProviderRegistry,
  Result,
} from "@blockstack/clarity";
import { assert } from "chai";

describe("payroll contract test suite", () => {
  let payrollClient: Client;
  let provider: Provider;

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    payrollClient = new Client(
      "SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.payroll",
      "payroll",
      provider
    );
  });

  it("should have a valid syntax", async () => {
    await payrollClient.checkContract();
  });

  describe("deploying an instance of the contract", () => {
    before(async () => {
      await payrollClient.deployContract();
    });

    it("should return 'payroll'", async () => {
      const query = payrollClient.createQuery({
        method: { name: "say-hi", args: [] },
      });
      const receipt = await payrollClient.submitQuery(query);
      const result = Result.unwrapString(receipt);
      assert.equal(result, "payroll");
    });

    it("should echo number", async () => {
      const query = payrollClient.createQuery({
        method: { name: "echo-number", args: ["123"] },
      });
      const receipt = await payrollClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      assert.equal(result, 123);
    });
  });

  after(async () => {
    await provider.close();
  });
});
